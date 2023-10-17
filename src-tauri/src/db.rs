use rusqlite::{named_params, params, Connection, Error, Result};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::HashMap;

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

pub fn insert_data(conn: &Connection, deserialized: Value) -> Result<()> {
    let data: Password = Password {
        id: 0,
        name: deserialized.get("name").unwrap().to_string(),
        password: deserialized.get("password").unwrap().to_string(),
        uri: match deserialized.get("uri") {
            Some(v) => v.to_string(),
            None => "".to_string(),
        },
        username: match deserialized.get("username") {
            Some(v) => v.to_string(),
            None => "".to_string(),
        },
        description: match deserialized.get("description") {
            Some(v) => v.to_string(),
            None => "".to_string(),
        },
        modified: "".to_string(),
    };
    println!("save data: {:?}", data);
    let mut stmt = conn.prepare("INSERT INTO password (name, URI, password, username, description) VALUES (:name, :URI, :password, :username, :description)")?;
    stmt.execute(named_params! {
    ":name": data.name,
    ":URI": data.uri,
    ":password": data.password,
    ":username": data.username,
    ":description": data.description})?;
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
                Ok(v) => v,
                Err(_) => String::from(""),
            },
        })
    })?;

    let mut pwd_vec = Vec::new();

    for p in password_iterator {
        pwd_vec.push(p?)
    }

    Ok(pwd_vec)
}

pub fn create_db() -> Result<Connection> {
    let conn = Connection::open("data.db")?;

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
