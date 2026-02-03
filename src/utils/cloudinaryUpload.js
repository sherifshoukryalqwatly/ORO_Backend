import cloudinary from '../config/cloudinary.config.js';
import streamifier from 'streamifier';

export const uploadToCloudinary = (file,folder = "General")=> {
    return new Promise((resolve,reject) => {
        let stream = cloudinary.uploader.upload_stream(
            {
            folder,
            resource_type: "image"
            },
            (error, result) => {
            if (error) return reject(error);
            resolve(result);
            }
        )
        streamifier.createReadStream(file.buffer).pipe(stream);
    });
}