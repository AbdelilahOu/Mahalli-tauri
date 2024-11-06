use image::{DynamicImage, GenericImageView, ImageEncoder, ImageError, ImageFormat};
use std::fs;
use std::path::Path;

#[derive(Debug)]
pub enum ImageProcessError {
    IoError(std::io::Error),
    ImageError(ImageError),
}

impl From<std::io::Error> for ImageProcessError {
    fn from(error: std::io::Error) -> Self {
        ImageProcessError::IoError(error)
    }
}

impl From<ImageError> for ImageProcessError {
    fn from(error: ImageError) -> Self {
        ImageProcessError::ImageError(error)
    }
}

pub struct ImageProcessor {
    max_dimension: u32,
}

impl ImageProcessor {
    pub fn new(max_dimension: u32) -> Self {
        ImageProcessor { max_dimension }
    }

    /// Process an image with cropping, resizing, and optimization
    pub fn process_image(
        &self,
        input_path: &Path,
        output_path: &Path,
        crop_dimensions: Option<(u32, u32, u32, u32)>,
    ) -> Result<(), ImageProcessError> {
        // Read the image
        let mut img = image::open(input_path)?;

        // Crop if dimensions provided
        if let Some((x, y, width, height)) = crop_dimensions {
            if x + width <= img.width() && y + height <= img.height() {
                img = img.crop(x, y, width, height);
            }
        }

        // Resize if needed
        img = self.resize_image(img);

        // Optimize and save
        self.save_optimized(img, output_path)?;

        Ok(())
    }

    /// Resize image while maintaining aspect ratio
    fn resize_image(&self, img: DynamicImage) -> DynamicImage {
        let (width, height) = img.dimensions();

        if width <= self.max_dimension && height <= self.max_dimension {
            return img;
        }

        let aspect_ratio = width as f32 / height as f32;
        let (new_width, new_height) = if width > height {
            let new_width = self.max_dimension;
            let new_height = (new_width as f32 / aspect_ratio) as u32;
            (new_width, new_height)
        } else {
            let new_height = self.max_dimension;
            let new_width = (new_height as f32 * aspect_ratio) as u32;
            (new_width, new_height)
        };

        img.resize(new_width, new_height, image::imageops::FilterType::Lanczos3)
    }

    /// Save image with optimization
    fn save_optimized(
        &self,
        img: DynamicImage,
        output_path: &Path,
    ) -> Result<(), ImageProcessError> {
        let format = ImageFormat::from_path(output_path)?;

        match format {
            ImageFormat::Jpeg => {
                img.save_with_format(output_path, ImageFormat::Jpeg)?;
            }
            ImageFormat::Png => {
                // For PNG, we can use different compression options
                let encoder = image::codecs::png::PngEncoder::new_with_quality(
                    fs::File::create(output_path)?,
                    image::codecs::png::CompressionType::Best,
                    image::codecs::png::FilterType::Adaptive,
                );
                encoder.write_image(
                    img.as_bytes(),
                    img.width(),
                    img.height(),
                    img.color().into(),
                )?;
            }
            _ => {
                // For other formats, save normally
                img.save(output_path)?;
            }
        }

        Ok(())
    }
}
