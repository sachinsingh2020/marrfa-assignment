import React, { useState, useEffect } from "react";
import BlogModal from "./BlogModal";
import toast from "react-hot-toast";

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const handleAddBlog = (newBlog) => {
        const reader = new FileReader();

        // If a new image is provided, read it, otherwise, use the existing image
        if (newBlog.blogImage && newBlog.blogImage instanceof File) {
            reader.onloadend = () => {
                const createdBlog = {
                    ...newBlog,
                    id: Date.now(),
                    createdAt: new Date().toISOString(),
                    blogImage: reader.result, // Base64 string of the image
                };

                if (editingBlog) {
                    // Update existing blog and keep the image if not changed
                    const updatedBlogs = blogs.map((blog) =>
                        blog.id === editingBlog.id
                            ? { ...createdBlog, id: editingBlog.id }
                            : blog
                    );
                    setBlogs(updatedBlogs);
                    localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
                    toast.success("Blog updated successfully!");
                    setEditingBlog(null);
                } else {
                    // Add new blog
                    setBlogs((prev) => [...prev, createdBlog]);
                    localStorage.setItem("blogs", JSON.stringify([...blogs, createdBlog]));
                    toast.success("Blog added successfully!");
                }
            };

            reader.readAsDataURL(newBlog.blogImage); // Proceed with reading the image as DataURL
        } else {
            // No image provided, use the existing image if editing
            const createdBlog = {
                ...newBlog,
                id: editingBlog ? editingBlog.id : Date.now(),
                createdAt: editingBlog ? editingBlog.createdAt : new Date().toISOString(),
                blogImage: editingBlog ? editingBlog.blogImage : null, // Keep the existing image if editing
            };

            if (editingBlog) {
                // Update existing blog without changing the image
                const updatedBlogs = blogs.map((blog) =>
                    blog.id === editingBlog.id ? { ...createdBlog, id: editingBlog.id } : blog
                );
                setBlogs(updatedBlogs);
                localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
                toast.success("Blog updated successfully!");
                setEditingBlog(null);
            } else {
                // Add new blog without image
                setBlogs((prev) => [...prev, createdBlog]);
                localStorage.setItem("blogs", JSON.stringify([...blogs, createdBlog]));
                toast.success("Blog added successfully!");
            }
        }
    };



    const handleDelete = (id) => {
        const updatedBlogs = blogs.filter((blog) => blog.id !== id);
        setBlogs(updatedBlogs);
        localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
        toast.success("Blog deleted successfully!");
    };

    const handleEdit = (blog) => {
        setEditingBlog(blog);
        setModalOpen(true);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    useEffect(() => {
        const savedBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
        setBlogs(savedBlogs);
    }, []);

    const filteredBlogs = blogs.filter(
        (blog) =>
            blog.blogTitle.toLowerCase().includes(searchQuery) ||
            blog.blogContent.toLowerCase().includes(searchQuery)
    );

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-200 min-h-screen">
            <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">My Blog Dashboard</h1>
                <input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="px-4 py-2 w-full sm:w-1/2 md:w-1/3 border border-gray-300 rounded shadow-sm"
                />
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600"
                    onClick={() => {
                        setModalOpen(true);
                        setEditingBlog(null); // Ensure modal is in add mode
                    }}
                >
                    Add New Blog
                </button>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredBlogs.map((blog) => (
                    <div
                        key={blog.id}
                        className="relative p-4 bg-white rounded shadow-md hover:shadow-lg transition-shadow hover:transform hover:-translate-y-1 group overflow-hidden"
                    >
                        <h2 className="text-xl font-semibold text-blue-600 mb-2">
                            {blog.blogTitle}
                        </h2>
                        <p
                            className="text-gray-700 mb-4 overflow-auto max-h-20"
                            style={{ wordBreak: "break-word" }}
                        >
                            {blog.blogContent}
                        </p>
                        {blog.blogImage && (
                            <img
                                src={blog.blogImage} // Directly use the base64 string
                                alt={blog.blogTitle}
                                className="w-full h-40 object-contain rounded"
                            />
                        )}
                        <div className="flex justify-between items-center absolute bottom-2 left-2 right-2">
                            <button
                                className="px-2 py-1 bg-yellow-500 text-white rounded shadow-md hover:bg-yellow-600"
                                onClick={() => handleEdit(blog)}
                            >
                                Edit
                            </button>
                            <button
                                className="px-2 py-1 bg-red-500 text-white rounded shadow-md hover:bg-red-600"
                                onClick={() => handleDelete(blog.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <BlogModal
                open={modalOpen}
                handleClose={() => setModalOpen(false)}
                handleSave={handleAddBlog}
                editingBlog={editingBlog}
            />
        </div>
    );
};

export default Blogs;
