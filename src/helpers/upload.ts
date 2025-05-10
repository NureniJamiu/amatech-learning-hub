import axios from "axios";

export const handleFileSubmit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file)
    formData.append("upload_preset", "tutors")

    try {
        const response = await axios.post("/api/upload", formData)
        return {
            url: response.data.secure_url,
            public_id: response.data.public_id,
            message: "File uploaded successfully",
            status: 201
        }
    } catch (error) {
    console.error("Error uploading file:", error);
    return {
        message: "File upload failed",
        status: 500
    }
}}
