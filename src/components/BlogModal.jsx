import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button } from "@mui/material";
import toast from "react-hot-toast";

const BlogModal = ({ open, handleClose, handleSave, editingBlog }) => {
    const [formData, setFormData] = useState({
        blogTitle: "",
        blogContent: "",
        blogImage: null,
    });

    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (editingBlog) {
            setFormData({
                blogTitle: editingBlog.blogTitle,
                blogContent: editingBlog.blogContent,
                blogImage: editingBlog.blogImage,
            });
            setPreview(editingBlog.blogImage);
        } else {
            setFormData({ blogTitle: "", blogContent: "", blogImage: null });
            setPreview(null);
        }
    }, [editingBlog]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({ ...prev, blogImage: file }));
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = () => {
        if (!formData.blogTitle || !formData.blogContent || !formData.blogImage) {
            toast.error("Please fill out all fields!");
            return;
        }
        handleSave(formData);
        setFormData({ blogTitle: "", blogContent: "", blogImage: null });
        setPreview(null);
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle className="text-xl font-bold text-blue-600 text-center">
                {editingBlog ? "Edit Blog" : "Add New Blog"}
            </DialogTitle>
            <DialogContent>
                <div className="flex flex-col gap-4">
                    <TextField
                        label="Blog Title"
                        name="blogTitle"
                        fullWidth
                        value={formData.blogTitle}
                        onChange={handleChange}
                        margin="normal"
                        className="border-gray-300 rounded"
                    />
                    <TextField
                        label="Blog Content"
                        name="blogContent"
                        fullWidth
                        multiline
                        rows={4}
                        value={formData.blogContent}
                        onChange={handleChange}
                        margin="normal"
                        className="border-gray-300 rounded"
                    />
                    <input
                        type="file"
                        name="blogImage"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="file-input border border-gray-300 p-2 rounded"
                    />
                    {preview && (
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-40 object-contain rounded border border-gray-300"
                        />
                    )}

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSubmit}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
                    >
                        {editingBlog ? "Update Blog" : "Save Blog"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BlogModal;
