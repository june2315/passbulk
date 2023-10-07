// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rusqlite::{params, Connection, Result};
use serde::{Deserialize, Serialize};
// use serde_json::Result;

#[derive(Serialize, Deserialize)]
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
async fn save(
    name: String,
    password: String,
    uri: String,
    username: String,
    description: String,
) -> Result<String, ()> {
    println!("{}", name);

    let conn = create_db().unwrap();

    let pwd = Password {
        id: 0,
        name,
        uri,
        password,
        username,
        description,
    };

    insert_data(&conn, pwd).unwrap();

    let pwd = query_data(&conn).unwrap();

    let json_str = serde_json::to_string(&pwd).unwrap();

    Ok(json_str)
}

#[tauri::command]
async fn query() -> Result<String, ()> {
    let conn = create_db().unwrap();
    let pwd = query_data(&conn).unwrap();

    let json_str = serde_json::to_string(&pwd).unwrap();

    Ok(json_str)
}

fn insert_data(conn: &Connection, data: Password) -> Result<()> {
    // data.name
    conn.execute(
        "INSERT INTO password (name, URI, password, username, description) VALUES (?1, ?2, ?3, ?4, ?5)",
        params![
            data.name,
            data.uri,
            data.password,
            data.username,
            data.description
        ],
    )?;
    Ok(())
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
        .invoke_handler(tauri::generate_handler![greet, save, query])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
