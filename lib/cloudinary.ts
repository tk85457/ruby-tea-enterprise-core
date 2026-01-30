import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(fileUri: string, folder: string = 'ruby-tea') {
  try {
    const response = await cloudinary.uploader.upload(fileUri, {
      folder: folder,
      resource_type: 'auto',
    });
    return response.secure_url;
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    throw new Error('Image upload failed');
  }
}

export async function deleteImage(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete failed:', error);
  }
}
