use std::sync::Arc;
use tokio::sync::Mutex;
use apalis::{prelude::*, sqlite::SqliteStorage};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub enum EntityEnum {
    CLIENT,
    PRODUCT,
    SUPPLIER
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ImageProcessor {
    pub id: String,
    pub entity: EntityEnum,
    pub data: String
}

impl Job for ImageProcessor {
    const NAME: &'static str = "image_processor";
}

// Thread-safe storage wrapper using tokio::sync::Mutex
#[derive(Clone)]
pub struct ThreadSafeJobStorage {
    storage: Arc<Mutex<SqliteStorage<ImageProcessor>>>
}

impl ThreadSafeJobStorage {
    pub fn new(storage: SqliteStorage<ImageProcessor>) -> Self {
        Self {
            storage: Arc::new(Mutex::new(storage))
        }
    }

    pub async fn push_job(&self, job: ImageProcessor) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let mut storage = self.storage.lock().await;
        storage.push(job).await?;
        Ok(())
    }

    pub async fn get_storage(&self) -> SqliteStorage<ImageProcessor> {
        self.storage.lock().await.clone()
    }
}


pub async fn process_image(_job: ImageProcessor, _data: Data<usize>) -> Result<(), Error> {
  Ok(())
}
