use chrono::{Local, NaiveDateTime};
use rusqlite::{named_params, params, Connection, Error, Result};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::HashMap;
use std::fs;
use std::path::Path;

// #[derive(Serialize, Deserialize, Debug)]
// pub enum PasswordVal {
//     Int(i32),
//     String,
// }

#[derive(Serialize, Deserialize, Debug)]
pub struct Password {
    id: i32,
    name: String,
    uri: String,
    pub password: String,
    username: String,
    description: String,
    modified: String,
}

// Check if a database file exists, and create one if it does not.
pub fn init() {
    if !db_file_exists() {
        create_db_file();
    }
}

// Create the database file.
fn create_db_file() {
    let db_path = get_db_path();
    let db_dir = Path::new(&db_path).parent().unwrap();

    // If the parent directory does not exist, create it.
    if !db_dir.exists() {
        fs::create_dir_all(db_dir).unwrap();
    }

    // Create the database file.
    fs::File::create(db_path).unwrap();
}

fn db_file_exists() -> bool {
    let db_path = get_db_path();
    Path::new(&db_path).exists()
}

fn get_db_path() -> String {
    let home_dir = dirs::home_dir().unwrap();
    home_dir.to_str().unwrap().to_string() + "/.config/passbulk/database.sqlite"
    // home_dir.to_str().unwrap().to_string() + "/.config/passbulk/test.sqlite"
}

pub fn insert_data(conn: &Connection, deserialized: Value) -> Result<()> {
    let now: chrono::DateTime<Local> = Local::now();

    let data: Password = Password {
        id: 0,
        name: String::from(deserialized.get("name").unwrap().as_str().unwrap()),
        password: String::from(deserialized.get("password").unwrap().as_str().unwrap()),
        uri: match deserialized.get("uri") {
            Some(v) => String::from(v.as_str().unwrap()),
            None => "".to_string(),
        },
        username: match deserialized.get("username") {
            Some(v) => String::from(v.as_str().unwrap()),
            None => "".to_string(),
        },
        description: match deserialized.get("description") {
            Some(v) => String::from(v.as_str().unwrap()),
            None => "".to_string(),
        },
        modified: now.format("%Y-%m-%d %H:%M:%S").to_string(),
    };
    println!("save data: {:?}", data);
    let mut stmt = conn.prepare("INSERT INTO password (name, URI, password, username, description, modified) VALUES (:name, :URI, :password, :username, :description, :modified)")?;
    stmt.execute(named_params! {
    ":name": data.name,
    ":URI": data.uri,
    ":password": data.password,
    ":username": data.username,
    ":description": data.description,
    ":modified": data.modified})?;
    Ok(())
}

pub fn delete_data(conn: &Connection, id_str: String) -> Result<()> {
    conn.execute(
        &format!("DELETE FROM password WHERE id in ({})", id_str),
        params![],
    )?;
    Ok(())
}

pub fn update_data(conn: &Connection, deserialized: Value) -> Result<(), Error> {
    let mut update_param: Vec<String> = Vec::new();

    update_param.push(format!(
        "name = {}",
        deserialized.get("name").unwrap().to_string()
    ));

    update_param.push(format!(
        "password = {}",
        deserialized.get("password").unwrap().to_string()
    ));

    if !deserialized["uri"].is_null() {
        update_param.push(format!(
            "URI = {}",
            deserialized.get("uri").unwrap().to_string()
        ));
    }

    if !deserialized["username"].is_null() {
        update_param.push(format!(
            "username = {}",
            deserialized.get("username").unwrap().to_string()
        ));
    }

    if !deserialized["description"].is_null() {
        update_param.push(format!(
            "description = {}",
            deserialized.get("description").unwrap().to_string()
        ));
    }

    update_param.push(format!(
        "modified = '{}'",
        String::from(Local::now().format("%Y-%m-%d %H:%M:%S").to_string())
    ));

    println!("SQL: {}", update_param.join(","));

    let mut stmt = conn.prepare(&format!(
        "UPDATE password SET {} WHERE id = :id",
        update_param.join(",")
    ))?;

    match stmt.execute(named_params! {":id": deserialized["id"].as_i64() }) {
        Ok(_) => Ok(()),
        Err(e) => return Err(e),
    }
}

pub fn query_data(conn: &Connection, query: HashMap<String, String>) -> Result<Vec<Password>> {
    let sort_str = format!(
        "ORDER BY modified {}",
        match query.get("order_by") {
            Some(v) => v.to_string(),
            None => "DESC".to_string(),
        }
    );

    let mut base_sql: String = String::from(
        "SELECT id, name, URI, password, username, description, modified FROM password",
    );

    if query.contains_key("WHERE") {
        base_sql = format!("{base_sql} WHERE {}", query.get("WHERE").unwrap());
    }

    if query.contains_key("name") {
        base_sql = format!(
            "{base_sql} WHERE name LIKE '{}%'",
            query.get("name").unwrap()
        );
    }

    base_sql = format!("{base_sql} {sort_str}");

    let mut stmt = conn.prepare(&base_sql)?;
    let password_iterator = stmt.query_map([], |row| {
        Ok(Password {
            id: row.get(0)?,
            name: row.get(1)?,
            uri: row.get(2)?,
            password: row.get(3)?,
            username: row.get(4)?,
            description: row.get(5)?,
            modified: match row.get(6) {
                // Ok(v) => DateTime::parse_from_str(v.as_str().unwrap().to_string(), fmt).unwrap().to_string(),
                Ok(v) => v,
                Err(_) => String::from(""),
            },
        })
    })?;

    let mut pwd_vec = Vec::new();

    for p in password_iterator {
        // pwd_vec.push(p?)

        let mut pwd = p?;
        if pwd.modified != "" {
            pwd.modified = NaiveDateTime::parse_from_str(&pwd.modified, "%Y-%m-%d %H:%M:%S")
                .unwrap()
                .format("%Y年%m月%d日 %H:%M:%S")
                .to_string();
        }
        pwd_vec.push(pwd)
    }

    Ok(pwd_vec)
}

pub fn create_db() -> Result<Connection> {
    // let conn = Connection::open("data.db")?;
    let conn = Connection::open(get_db_path())?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS password (
                id              INTEGER PRIMARY KEY AUTOINCREMENT,
                name            TEXT NOT NULL,
                URI             TEXT,
                password        TEXT,
                username        TEXT,
                description     TEXT,
                modified        DATETIME
            )",
        [],
    )?;

    Ok(conn)
}
