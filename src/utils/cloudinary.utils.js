import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';
import path from 'path'

import { ApiError } from './api-error.utils.js';

// Load environment variables from config.env
if (process.env.NODE_ENV === 'production') {
    config({ path: path.resolve('.prod.env') });
} else {
    config({ path: path.resolve('.dev.env') });
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Function to upload a single file to Cloudinary
/**
 * Uploads a single file to Cloudinary.
 * 
 * @async
 * @param {string} file - The path to the file to be uploaded.
 * @param {string} folderName - The name of the folder in Cloudinary where the file will be uploaded.
 * @returns {Promise<Object>} The result data from Cloudinary, containing information about the uploaded file.
 * @throws {ApiError} Throws an error if the file upload to Cloudinary fails.
 * 
 * @example
 * const fileData = await uploadSingleFileToCloudinary('path/to/file', 'folderName');
 * console.log(fileData);
 */
export const uploadSingleFileToCloudinary = async (file, folderName) => {
    try {
        // Upload file to Cloudinary
        const data = await cloudinary.uploader.upload(file, {
            folder: folderName,
            resource_type: 'raw'
        });
        return data;
    } catch (error) {
        throw new ApiError('Failed to upload file to Cloudinary', 500, 'file upload service.');
    }
};


export const deleteFileFromCloudinary = async (publicId) => {
    try {
        // remove file to Cloudinary
        const data = await cloudinary.uploader.destroy(publicId);
        return data;
    } catch (error) {
        throw new ApiError('Failed to upload file to Cloudinary', 500, 'file upload service.');
    }
};
