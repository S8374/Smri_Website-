import { useState } from "react";
import axios from "axios";

const useImageUpload = () => {
    const [uploading, setUploading] = useState(false);
    const IMAGE_BB_API = import.meta.env.VITE_BBIMAGE_API;

    const uploadImage = async (file) => {
        if (!file) return null;
        setUploading(true);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await axios.post(`https://api.imgbb.com/1/upload?key=${IMAGE_BB_API}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (!response.data.success) {
                throw new Error("Image upload failed.");
            }

            return response.data.data.url;
        } catch (error) {
            console.error("Image Upload Error:", error);
            return null;
        } finally {
            setUploading(false);
        }
    };

    return { uploadImage, uploading };
};

export default useImageUpload;
