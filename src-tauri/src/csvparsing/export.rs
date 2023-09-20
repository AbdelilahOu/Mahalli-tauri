use std::fs::OpenOptions;
use tauri::api::process::Command;
use tauri::api::process::CommandEvent;

pub async fn table_to_csv(source_path: &str, output_path: &str, table: &String) {
    // get data from command line
    let (mut rx, _child) = Command::new("sqlite3")
        .args([
            "-header",
            "-csv",
            source_path,
            format!("select * from {};", table).as_str(),
        ])
        .spawn()
        .expect("Failed to spawn packaged node");
    // specify file options
    let file = OpenOptions::new()
        .write(true)
        .append(true)
        .create(true)
        .open(output_path)
        .unwrap();
    // get file writer
    let mut wtr = csv::Writer::from_writer(file);
    // write to the file
    while let Some(event) = rx.recv().await {
        if let CommandEvent::Stdout(line) = event {
            let write_record_result = wtr.write_record(
                &line
                    .split(r#"""#)
                    .collect::<String>()
                    .split(",")
                    .collect::<Vec<&str>>(),
            );
            match write_record_result {
                Ok(()) => println!("record written"),
                Err(e) => println!("{:?}", e),
            }
        }
    }

    match _child.kill() {
        Ok(_) => println!("child process terminated"),
        Err(_) => println!("error while killing the child"),
    }
}
