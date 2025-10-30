import { useState } from "react";
import { motion } from "framer-motion";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const AddMedia = () => {
  const [form, setForm] = useState({
    title: "",
    type: "",
    director: "",
    budget: "",
    location: "",
    duration: "",
    year: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Handle Input Changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (image) formData.append("image", image);

      // ✅ Include JWT token
      const token = localStorage.getItem("token");

      await API.post("/media", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("✅ Media saved successfully!");
      setForm({
        title: "",
        type: "",
        director: "",
        budget: "",
        location: "",
        duration: "",
        year: "",
      });
      setImage(null);

      // Redirect to My Media after a short delay
      setTimeout(() => navigate("/my-media"), 1500);
    } catch (error) {
      console.error("Error saving media:", error);
      setMessage("❌ Failed to save media. Please log in again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] bg-gray-50 px-4 py-10">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-6 sm:p-10 rounded-2xl shadow-md w-full max-w-4xl"
      >
        <motion.h2
          className="text-2xl sm:text-3xl font-bold mb-8 text-center text-blue-700"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          Add New Media
        </motion.h2>

        {/* Success / Error Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center mb-6 p-3 rounded-lg font-medium ${
              message.includes("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </motion.div>
        )}

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Title */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Enter title"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="">Select Type</option>
              <option value="Movie">Movie</option>
              <option value="TV Show">TV Show</option>
              <option value="Documentary">Documentary</option>
            </select>
          </div>

          {/* Director */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Director
            </label>
            <input
              type="text"
              name="director"
              value={form.director}
              onChange={handleChange}
              placeholder="Enter director"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Budget */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Budget
            </label>
            <input
              type="text"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              placeholder="Enter budget"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Enter location"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Duration
            </label>
            <input
              type="text"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="Enter duration (e.g., 2h 15m)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Year */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Year</label>
            <input
              type="text"
              name="year"
              value={form.year}
              onChange={handleChange}
              placeholder="Enter release year"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Upload Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
            {image && (
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg shadow-md border mt-3"
              />
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition w-full sm:w-auto"
            >
              Save Media
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/my-media")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition w-full sm:w-auto"
            >
              Back
            </motion.button>
          </div>
        </div>
      </motion.form>
    </div>
  );
};

export default AddMedia;