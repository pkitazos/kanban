// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![greet])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn greet(name: &str) -> String {
   format!("Hello, {}!", name)
}

// fn read_directory(path: &str) -> Vec<String> {
//   let mut files = Vec::new();
//   if let Ok(entries) = std::fs::read_dir(path) {
//     for entry in entries {
//       if let Ok(entry) = entry {
//         if let Ok(file_name) = entry.file_name().into_string() {
//           files.push(file_name);
//         }
//       }
//     }
//   }
//   return  files
// }


// fn create_directory(path: &str) -> bool {
//   if let Ok(_) = std::fs::create_dir(path) {
//     return true
//   }
//   return false
// }