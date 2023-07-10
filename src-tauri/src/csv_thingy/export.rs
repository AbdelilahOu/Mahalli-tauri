#[tauri::command]
pub async fn export_db_csv() {
    let (mut rx, mut child) = Command::new("sqlite3")
        .args(["serve"])
        .spawn()
        .expect("Failed to spawn packaged node");

    while let Some(event) = rx.recv().await {
        if let CommandEvent::Stdout(line) = event {
            println!("{:?}", line);
            child.write("message from Rust\n".as_bytes()).unwrap();
        }
    }
}
