use tauri::api::process::{Command, CommandEvent};

pub async fn export_db_csv(source_path: &str, output_path: &str, table: String) {
    let (mut rx, child) = Command::new("sqlite3")
        .args([
            "-header",
            "-csv",
            source_path,
            format!("select * from {};", table).as_str(),
            ">",
            output_path,
        ])
        .spawn()
        .expect("Failed to spawn packaged node");

    while let Some(event) = rx.recv().await {
        if let CommandEvent::Stdout(line) = event {
            println!("{:?}", line);
            let child_is_dead = child.kill();
            match child_is_dead {
                Ok(()) => {}
                Err(_e) => {}
            }
            break;
        }
    }
}
