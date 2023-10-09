// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rusqlite::{named_params, params, Connection, Error, Result};
use serde::{Deserialize, Serialize};
use serde_json::Value;
// use serde_json::Result;

#[derive(Serialize, Deserialize, Debug)]
struct Password {
    id: i32,
    name: String,
    uri: String,
    password: String,
    username: String,
    description: String,
}
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn save(data: String) -> Result<String, String> {
    // println!("receive data: {}", data);

    let conn = create_db().unwrap();
    let deserialized: Value = match serde_json::from_str(&data) {
        Ok(v) => v,
        Err(e) => return Err(e.to_string()),
    };
    let pwd = Password {
        id: 0,
        name: deserialized["name"].as_str().unwrap().to_string(),
        password: deserialized["password"].as_str().unwrap().to_string(),
        uri: match deserialized["uri"].as_str() {
            Some(v) => v.to_string(),
            None => "".to_string(),
        },
        username: match deserialized["username"].as_str() {
            Some(v) => v.to_string(),
            None => "".to_string(),
        },
        description: match deserialized["description"].as_str() {
            Some(v) => v.to_string(),
            None => "".to_string(),
        },
    };

    println!("save data: {:?}", pwd);

    if pwd.id != 0 {
        match update_data(&conn, pwd) {
            Ok(v) => v,
            Err(e) => return Err(e.to_string()),
        };
    } else {
        insert_data(&conn, pwd).unwrap();
    }

    let pwd = query_data(&conn).unwrap();

    let json_str = serde_json::to_string(&pwd).unwrap();

    Ok(json_str)
}

#[tauri::command]
async fn batch_delete(ids: String) -> Result<(), ()> {
    let conn = create_db().unwrap();

    delete_data(&conn, ids).unwrap();

    Ok(())
}

#[tauri::command]
async fn query() -> Result<String, ()> {
    let conn = create_db().unwrap();

    let pwd = query_data(&conn).unwrap();

    let json_str = serde_json::to_string(&pwd).unwrap();

    Ok(json_str)
}

fn insert_data(conn: &Connection, data: Password) -> Result<()> {
    let mut stmt = conn.prepare("INSERT INTO password (name, URI, password, username, description) VALUES (:name, :URI, :password, :username, :description)")?;
    stmt.execute(named_params! {
    ":name": data.name,
    ":URI": data.uri,
    ":password": data.password,
    ":username": data.username,
    ":description": data.description})?;
    Ok(())
}

fn delete_data(conn: &Connection, id_str: String) -> Result<()> {
    conn.execute(
        &format!("DELETE FROM password WHERE id in ({})", id_str),
        params![],
    )?;

    Ok(())
}

fn update_data(conn: &Connection, data: Password) -> Result<(), Error> {
    let mut update_param: Vec<&str> = Vec::new();

    let name: String = format!("name = {}", data.name);
    let password: String = format!("password = {}", data.password);
    let uri: String = format!("URI = {}", data.uri);
    let username: String = format!("username = {}", data.username);
    let description: String = format!("description = {}", data.description);

    update_param.push(&name);
    update_param.push(&password);

    if data.uri != "" {
        update_param.push(&uri);
    }

    if data.username != "" {
        update_param.push(&username);
    }

    if data.username != "" {
        update_param.push(&description);
    }

    let mut stmt = conn.prepare(&format!(
        "UPDATE password SET {} WHERE id = :id",
        update_param.join(",")
    ))?;

    match stmt.execute(named_params! {":id": data.id }) {
        Ok(_) => Ok(()),
        Err(e) => return Err(e),
    }
}

fn query_data(conn: &Connection) -> Result<Vec<Password>> {
    let mut stmt =
        conn.prepare("SELECT id, name, URI, password, username, description FROM password")?;
    let password_iterator = stmt.query_map([], |row| {
        Ok(Password {
            id: row.get(0)?,
            name: row.get(1)?,
            uri: row.get(2)?,
            password: row.get(3)?,
            username: row.get(4)?,
            description: row.get(5)?,
        })
    })?;

    let mut pwd_vec = Vec::new();

    for p in password_iterator {
        pwd_vec.push(p?)
    }

    Ok(pwd_vec)
}

fn create_db() -> Result<Connection> {
    let conn = Connection::open("data.db")?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS password (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            name            TEXT NOT NULL,
            URI             TEXT,
            password        TEXT,
            username        TEXT,
            description     TEXT
        )",
        [],
    )?;

    Ok(conn)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, save, batch_delete, query])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
