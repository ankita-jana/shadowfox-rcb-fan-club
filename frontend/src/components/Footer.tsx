import { FaYoutube, FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-black via-gray-900 to-black text-gray-400 py-4 border-t border-gray-800">
      <div className="container mx-auto px-6 flex flex-col items-center text-center space-y-3">
        {/* Branding */}
        <p className="text-sm md:text-base">
          ⚡ Powered by{" "}
          <span className="text-red-500 font-bold">
            Royal Challengers Bengaluru
          </span>
        </p>

        {/* Official Website */}
        <p className="text-xs md:text-sm">
          Visit the{" "}
          <a
            href="https://www.royalchallengers.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-500 hover:text-yellow-400 font-semibold transition-colors duration-300"
          >
            Official RCB Website
          </a>
        </p>

        {/* Social Links */}
        <div className="flex gap-4">
          <a
            href="https://www.youtube.com/channel/UCCq1xDJMBRF61kiOgU90_kw"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-500 transition transform hover:scale-110"
          >
            <FaYoutube size={20} />
          </a>
          <a
            href="https://www.facebook.com/RoyalChallengersBangalore/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-500 transition transform hover:scale-110"
          >
            <FaFacebookF size={18} />
          </a>
          <a
            href="https://x.com/rcbtweets"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-500 transition transform hover:scale-110"
          >
            <FaTwitter size={18} />
          </a>
          <a
            href="https://www.instagram.com/royalchallengers.bengaluru/#"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-500 transition transform hover:scale-110"
          >
            <FaInstagram size={20} />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} RCB Fan Hub. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
