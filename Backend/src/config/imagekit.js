import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const uploadToImageKit = async (
  fileBuffer,
  fileName,
  folder = "/resume-builder"
) => {
  try {
    const response = await imagekit.upload({
      file: fileBuffer.toString("base64"),
      fileName: `${Date.now()}-${fileName}`,
      folder,
      useUniqueFileName: true,
      tags: ["resume-builder", "profile-image"],
    });
    return response;
  } catch (error) {
    throw new Error(`ImageKit upload failed: ${error.message}`);
  }
};

export const deleteFromImageKit = async (fileId) => {
  try {
    await imagekit.deleteFile(fileId);
    return true;
  } catch (error) {
    throw new Error(`ImageKit delete failed: ${error.message}`);
  }
};

export const getImageKitUrl = (path, transformations = []) => {
  return imagekit.url({
    path,
    transformation: transformations,
  });
};

export default imagekit;