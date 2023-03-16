// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use image_compressor::compressor::Compressor;
use serde::Serialize;
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Serialize)]
struct CompressorResult {
    original_file: String,
    success: bool,
    error: String,
}

#[tauri::command]
fn compress_images(filepaths: Vec<String>) -> Vec<CompressorResult> {
    filepaths
        .iter()
        .map(|filepath| {
            let origin = PathBuf::from(filepath);
            let mut dest = origin.clone();
            dest.pop();
            dest.push("Compressed");

            let original_file = origin
                .file_stem()
                .unwrap()
                .to_os_string()
                .into_string()
                .unwrap();
            match fs::create_dir_all(&dest) {
                Ok(_) => {
                    let comp = Compressor::new(origin, dest);
                    match comp.compress_to_jpg() {
                        Ok(_) => {
                            return CompressorResult {
                                original_file: original_file,
                                success: true,
                                error: String::new(),
                            };
                        }
                        Err(e) => {
                            return CompressorResult {
                                original_file: original_file,
                                success: false,
                                error: e.to_string(),
                            };
                        }
                    }
                }
                Err(e) => {
                    return CompressorResult {
                        original_file: original_file,
                        success: false,
                        error: e.to_string(),
                    };
                }
            }
        })
        .collect()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![compress_images])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
