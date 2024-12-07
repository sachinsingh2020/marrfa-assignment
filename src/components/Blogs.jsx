import React, { useState, useEffect } from "react";
import BlogModal from "./BlogModal";
import toast from "react-hot-toast";

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleAddBlog = (newBlog) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            const createdBlog = {
                ...newBlog,
                id: Date.now(),
                createdAt: new Date().toISOString(),
                blogImage: reader.result, // Base64 string of the image
            };

            setBlogs((prev) => [...prev, createdBlog]);
            localStorage.setItem("blogs", JSON.stringify([...blogs, createdBlog]));
            toast.success("Blog added successfully!");
        };

        if (newBlog.blogImage) {
            reader.readAsDataURL(newBlog.blogImage);
        }
    };

    const handleDelete = (id) => {
        const updatedBlogs = blogs.filter((blog) => blog.id !== id);
        setBlogs(updatedBlogs);
        localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
        toast.success("Blog deleted successfully!");
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
                    onClick={() => setModalOpen(true)}
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
                        <p className="text-gray-700 mb-4">{blog.blogContent}</p>
                        {blog.blogImage && (
                            <img
                                src={blog.blogImage} // Directly use the base64 string
                                alt={blog.blogTitle}
                                className="w-full h-40 object-contain rounded"
                            />
                        )}

                        <button
                            className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md"
                            onClick={() => handleDelete(blog.id)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
            <BlogModal
                open={modalOpen}
                handleClose={() => setModalOpen(false)}
                handleSave={handleAddBlog}
            />
        </div>
    );
};

export default Blogs;
