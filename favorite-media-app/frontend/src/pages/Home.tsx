import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import TypingTitle from "../components/TypingTitle"; 

import Interstellar from "../assets/Interstellar.jpg";
import Inception from "../assets/Inception.jpg";
import BreakingBad from "../assets/BreakingBad.jpg";
import StrangerThings from "../assets/StrangerThings.jpg";

const Home = () => {
  const sampleMedia = [
    { title: "Inception", image: Inception },
    { title: "Breaking Bad", image: BreakingBad },
    { title: "Interstellar", image: Interstellar },
    { title: "Stranger Things", image: StrangerThings },
  ];

  return (
    <div className="flex flex-col min-h-[90vh] bg-gray-50">
      <main className="flex-grow py-8 px-6 max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1
            className="text-3xl sm:text-4xl font-bold mb-4 flex flex-wrap justify-center items-center gap-2"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Welcome to <span><TypingTitle /></span>
          </h1>

          <p
            className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mb-6"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 400 }}
          >
            Keep track of your favorite movies, TV shows, music, or books all in
            one place. Add, view, and manage your media list easily with this
            simple and elegant application.
          </p>
        </motion.div>

        {/* Add Media Section */}
        <motion.div
          className="flex flex-col items-center space-y-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2
            className="text-xl sm:text-2xl font-semibold text-gray-700 text-center"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Start building your media list
          </h2>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="text-blue-500 w-8 h-8" />
          </motion.div>
          <Link
            to="/add-media"
            className="bg-blue-200 px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold shadow-md hover:shadow-lg transition-all"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Add New Media
          </Link>
        </motion.div>

        {/* Local Media Gallery */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10 mt-10 justify-items-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
        >
          {sampleMedia.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-2 overflow-hidden w-full max-w-[380px]"
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-64 sm:h-72 object-cover rounded-t-2xl"
              />
              <div className="p-5 text-center">
                <h3
                  className="text-lg sm:text-xl font-semibold text-gray-800"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      <footer className="bg-gradient-to-r from-blue-50 to-gray-50 border-t border-gray-200 py-6 mt-12">
        <div className="max-w-6xl mx-auto text-center text-gray-600 text-sm">
          <p style={{ fontFamily: "var(--font-inter)" }}>
            © {new Date().getFullYear()} <b>Media Verse</b>. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
