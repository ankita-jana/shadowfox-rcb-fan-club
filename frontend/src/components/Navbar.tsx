import { Link } from "react-router-dom";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const Navbar = () => {
  const [isPhotosOpen, setIsPhotosOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2 text-2xl font-bold">
          <img
            src="/logos/rcb-logo.png"
            alt="RCB Logo"
            className="w-10 h-10 object-contain"
          />
          <span className="text-red-500">RCB Fan Hub</span>
        </div>

        {/* Links */}
        <ul className="flex space-x-6 text-lg font-medium relative">
          <li>
            <Link
              to="/"
              className="hover:text-red-400 transition-colors duration-300"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/players"
              className="hover:text-red-400 transition-colors duration-300"
            >
              Players
            </Link>
          </li>
          <li>
            <Link
              to="/matches"
              className="hover:text-red-400 transition-colors duration-300"
            >
              Matches
            </Link>
          </li>
          <li>
            <Link
              to="/stats"
              className="hover:text-red-400 transition-colors duration-300"
            >
              Stats
            </Link>
          </li>
          <li>
            <Link
              to="/news"
              className="hover:text-red-400 transition-colors duration-300"
            >
              News
            </Link>
          </li>
          <li>
            <Link
              to="/fan-hub"
              className="hover:text-red-400 transition-colors duration-300"
            >
              Fan Hub
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="hover:text-red-400 transition-colors duration-300"
            >
              About
            </Link>
          </li>

          {/* Photos Dropdown */}
          <li className="relative cursor-pointer">
            {/* Click to toggle dropdown */}
            <div
              className="flex items-center hover:text-red-400 transition-colors duration-300"
              onClick={() => setIsPhotosOpen(!isPhotosOpen)}
            >
              <span>Photos</span>
              <FaChevronDown className="ml-1 text-sm" />
            </div>

            {isPhotosOpen && (
              <ul className="absolute left-0 mt-2 w-44 bg-gray-800 border border-red-600 rounded-lg shadow-lg">
                <li className="px-4 py-2 hover:bg-red-700">
                  <Link
                    to="/photos/2024"
                    onClick={() => setIsPhotosOpen(false)}
                  >
                    IPL 2024
                  </Link>
                </li>
                <li className="px-4 py-2 hover:bg-red-700">
                  <Link
                    to="/photos/2023"
                    onClick={() => setIsPhotosOpen(false)}
                  >
                    IPL 2023
                  </Link>
                </li>
                <li className="px-4 py-2 hover:bg-red-700">
                  <Link
                    to="/photos/legends"
                    onClick={() => setIsPhotosOpen(false)}
                  >
                    RCB Legends
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
