import { useEffect, useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import Fuse from "fuse.js";
import debounce from "lodash/debounce";
import { showConfirm, showSuccess, showError } from "../utils/alertUtils";

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

const MyMedia = () => {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [filteredList, setFilteredList] = useState<Media[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isInitialMount = useRef(true);

  // ✅ Fetch all media once
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/media", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMediaList(res.data);
        setFilteredList(res.data);
      } catch (err) {
        console.error("Error fetching media:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  // ✅ Fuzzy search configuration
  const fuse = useMemo(
    () =>
      new Fuse(mediaList, {
        keys: ["title", "type", "director", "year"],
        threshold: 0.3,
      }),
    [mediaList]
  );

  // ✅ Debounced search handler
  const handleSearch = useMemo(
    () =>
      debounce((query: string, category: string) => {
        // Step 1: Filter by category first
        let filteredData = mediaList;
        if (category !== "All") {
          filteredData = filteredData.filter(
            (media) => media.type.toLowerCase() === category.toLowerCase()
          );
        }

        // Step 2: Apply fuzzy search only within the filtered data
        if (query.trim() !== "") {
          const fuseSearch = new Fuse(filteredData, {
            keys: ["title", "type", "director", "year"],
            threshold: 0.3,
          });
          const results = fuseSearch.search(query);
          filteredData = results.map((r) => r.item);
        }

        // Step 3: Set the final list
        setFilteredList(filteredData);
      }, 300),
    [mediaList]
  );

  // ✅ Trigger search after mount
  useEffect(() => {
    if (loading) return; // Don't run until data is ready
    handleSearch(searchQuery, category);
  }, [searchQuery, category, loading, mediaList]);

// ✅ Initial sync once data is fetched
  useEffect(() => {
    if (!loading && mediaList.length > 0) {
      setFilteredList(mediaList);
    }
  }, [mediaList, loading]);

  // ✅ Delete media
  const handleDelete = async (id: number) => {
    const confirmDelete = await showConfirm(
      "Delete Media?",
      "Are you sure you want to delete this media? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await API.delete(`/media/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedList = mediaList.filter((item) => item.id !== id);
      setMediaList(updatedList);
      setFilteredList(updatedList);
      showSuccess("Deleted!", "Your media has been deleted successfully.");
    } catch (error) {
      console.error("Error deleting media:", error);
      showError("Failed to Delete", "Something went wrong while deleting media.");
    }
  };

  // ✅ Edit media
  const handleEdit = async (id: number) => {
    const confirmEdit = await showConfirm(
      "Edit Media?",
      "Are you sure you want to edit this media details?"
    );
    if (confirmEdit) navigate(`/edit-media/${id}`);
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 bg-gray-50 min-h-[90vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Title */}
      <motion.h2
        className="text-3xl md:text-4xl font-bold mb-8 text-center text-blue-600"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        My Media
      </motion.h2>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search media..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full sm:w-40 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
        >
          <option value="All">All</option>
          <option value="Movie">Movie</option>
          <option value="TV Show">TV Show</option>
          <option value="Documentary">Documentary</option>
        </select>
      </div>

      {/* ✅ Loading / Table / No Results */}
      {loading ? (
        <div className="flex justify-center py-20 text-gray-500 text-lg">
          Loading media...
        </div>
      ) : filteredList.length > 0 ? (
        <>
          {/* ✅ Desktop Table View */}
          <motion.div
            className="hidden sm:block overflow-x-auto bg-white shadow-md rounded-2xl border border-gray-100"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-blue-50 text-sm sm:text-base">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Director</th>
                  <th className="p-4">Budget</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Year</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((media, index) => (
                  <motion.tr
                    key={media.id}
                    className="border-b hover:bg-blue-50/50 transition"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <td className="p-4">
                      {media.image ? (
                        <img
                          src={`http://localhost:5000/${media.image.replace(
                            /^\/?uploads\//,
                            "uploads/"
                          )}`}
                          alt={media.title}
                          className="w-16 h-16 object-cover rounded-lg shadow-sm border"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-semibold">{media.title}</td>
                    <td className="p-4 text-gray-600">{media.type}</td>
                    <td className="p-4 text-gray-600">{media.director || "-"}</td>
                    <td className="p-4 text-gray-600">{media.budget || "-"}</td>
                    <td className="p-4 text-gray-600">{media.location || "-"}</td>
                    <td className="p-4 text-gray-600">{media.duration || "-"}</td>
                    <td className="p-4 text-gray-600">{media.year || "-"}</td>
                    <td className="p-4 text-center space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleEdit(media.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleDelete(media.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* ✅ Mobile Card View */}
          <div className="grid grid-cols-1 gap-5 sm:hidden mt-4">
            {filteredList.map((media, index) => (
              <motion.div
                key={media.id}
                className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="flex items-center gap-4 mb-3">
                  {media.image ? (
                    <img
                      src={`http://localhost:5000/${media.image.replace(
                        /^\/?uploads\//,
                        "uploads/"
                      )}`}
                      alt={media.title}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                      No Image
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {media.title}
                    </h3>
                    <p className="text-sm text-gray-500">{media.type}</p>
                    <p className="text-xs text-gray-400">{media.year}</p>
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>Director:</strong> {media.director || "-"}
                  </p>
                  <p>
                    <strong>Budget:</strong> {media.budget || "-"}
                  </p>
                  <p>
                    <strong>Location:</strong> {media.location || "-"}
                  </p>
                  <p>
                    <strong>Duration:</strong> {media.duration || "-"}
                  </p>
                </div>

                <div className="flex justify-end gap-4 mt-4">
                  <button
                    onClick={() => handleEdit(media.id)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(media.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <motion.div
          className="flex flex-col items-center justify-center py-20 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076507.png"
            alt="No results"
            className="w-24 h-24 mb-4 opacity-70"
            animate={{ scale: [0.9, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <p className="text-lg italic">No results found</p>
        </motion.div>
      )}

      {/* Add Media Button */}
      <motion.div
        className="flex justify-center mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Link
          to="/add-media"
          className="bg-blue-200 text-white px-6 sm:px-8 py-3 rounded-lg text-sm sm:text-lg font-semibold shadow-md hover:shadow-lg transition-all"
          style={{fontFamily: "var(--font-montserrat)"}}
        >
          Add New Media
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default MyMedia;