import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";

interface Media {
  id: number;
  title: string;
  type: string;
  director?: string;
  budget: string;
  location: string;
  duration: string;
  year: string;
  image?: string;
}

const EditMedia = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setFormData] = useState({
    title: "",
    type: "",
    director: "",
    budget: "",
    location: "",
    duration: "",
    year: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // ✅ Fetch existing media by ID
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const res = await API.get(`/media/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData(res.data);
      } catch (err: any) {
        console.error("Error fetching media:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    fetchMedia();
  }, [id, navigate]);

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Submit form to update media with JWT header
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (image) formData.append("image", image);

      await API.put(`/media/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, 
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("✅ Media updated successfully!");
      setTimeout(() => navigate("/my-media"), 1500);
    } catch (error: any) {
      console.error("Error updating media:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login"); 
      }

      setMessage("❌ Failed to update media. Please try again.");
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
        {/* Title */}
        <motion.h2
          className="text-2xl sm:text-3xl font-bold mb-8 text-center text-blue-700"
          style={{ fontFamily: "var(--font-montserrat)" }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Edit Media
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-white text-gray-700"
            >
              <option value="">Select Type</option>
              <option value="Movie">Movie</option>
              <option value="TV Show">TV Show</option>
            </select>
          </div>

          {/* Director */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Director</label>
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
            <label className="block text-gray-700 mb-2 font-medium">Budget</label>
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
            <label className="block text-gray-700 mb-2 font-medium">Location</label>
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
            <label className="block text-gray-700 mb-2 font-medium">Duration</label>
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
            <label className="block text-gray-700 mb-2 font-medium">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
            {preview && (
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg shadow-md border mt-3"
              />
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition w-full sm:w-auto"
            >
              Update Media
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

export default EditMedia;