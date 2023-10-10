// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rusqlite::Result;
// use serde_json::Value;
use std::collections::HashMap;

mod db;
use db::{create_db, delete_data, insert_data, query_data, update_data};
// use serde_json::Result;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn save(data: String) -> Result<(), String> {
    // println!("receive data: {}", data);

    let conn = create_db().unwrap();
    let deserialized: HashMap<String, String> = match serde_json::from_str(&data) {
        Ok(v) => v,
        Err(e) => return Err(e.to_string()),
    };

    if deserialized.contains_key("id") {
        match update_data(&conn, deserialized) {
            Ok(v) => v,
            Err(e) => return Err(e.to_string()),
        };
    } else {
        insert_data(&conn, deserialized).unwrap();
    }

    Ok(())
}

#[tauri::command]
async fn batch_delete(ids: String) -> Result<(), ()> {
    let conn = create_db().unwrap();

    delete_data(&conn, ids).unwrap();

    Ok(())
}

#[tauri::command]
async fn query(data: String) -> Result<String, String> {
    let conn = create_db().unwrap();

    // println!("data: {}", data);

    let deserialized: HashMap<String, String> = match serde_json::from_str(&data) {
        Ok(v) => v,
        Err(e) => return Err(e.to_string()),
    };

    let pwd = query_data(&conn, deserialized).unwrap();

    let json_str = serde_json::to_string(&pwd).unwrap();

    // println!("json_str: {}", json_str);
    Ok(json_str)
}

#[tauri::command]
async fn decrypt_password(id: String) -> Result<String, ()> {
    let conn = create_db().unwrap();

    let mut query: HashMap<String, String> = HashMap::new();

    query.insert(String::from("WHERE"), format!("id = {id}"));

    let pwd = query_data(&conn, query).unwrap();

    let password = match pwd.get(0) {
        Some(v) => v.password.clone(),
        None => String::from(""),
    };

    println!("decrypt password id: {}", id);
    Ok(password)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            save,
            batch_delete,
            query,
            decrypt_password
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
