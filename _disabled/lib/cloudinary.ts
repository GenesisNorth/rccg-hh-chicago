import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (
  file: string,
  folder: string = "church-app"
): Promise<{ url: string; public_id: string }> => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "auto",
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload file");
  }
};

export const deleteFromCloudinary = async (public_id: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw new Error("Failed to delete file");
  }
};


export default cloudinary;