import path from 'path';
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid';

import { ApiError } from '../utils/api-error.utils.js';



const uploadFile = (folderName) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `uploads/${folderName}`)
        },
        filename: (req, file, cb) => {
            cb(null, `${uuidv4()}-${folderName}-${file.originalname}`)
        }
    });

    function fileFilter(req, file, cb) {
        // Check file type
        const filetypes = /pdf/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // .PDF => .pdf

        if (mimetype && extname) {
            cb(null, true)
        }
        else {
            cb(new ApiError('Only PDF files are allowed!', 401, 'file upload service.'))
        }
    };

    const upload = multer({
        storage,
        limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
        fileFilter,
    });

    return upload;
}

export const uploadSingleFile = (fieldName, folerName) => {
    return uploadFile(folerName).single(fieldName)
}