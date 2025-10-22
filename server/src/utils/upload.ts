import cloudinary from "../configs/cloudinary";
import streamifier from "streamifier";

export interface UploadedFile {
    filename: string;
    url: string;
}

const getResourceType = (mimetype: string): "image" | "raw" => {
    if (mimetype.startsWith("image/")) return "image";
    return "raw";
};

export const uploadFiles = async (attachments: Express.Multer.File[]): Promise<UploadedFile[]> => {
    const uploadPromises: Promise<UploadedFile>[] = attachments.map(file => {
        return new Promise<UploadedFile>((resolve, reject) => {
            const resourceType = getResourceType(file.mimetype);
            const stream = cloudinary.uploader.upload_stream(
                { folder: "tasq/task/attachments", resource_type: resourceType },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result || !result.secure_url) return reject(new Error("Upload failed"));
                    resolve({ filename: file.originalname, url: result.secure_url });
                }
            );
            streamifier.createReadStream(file.buffer).pipe(stream);
        });
    });
    return await Promise.all(uploadPromises);
}
