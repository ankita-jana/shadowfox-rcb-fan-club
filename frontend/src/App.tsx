import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Photos from "./pages/Photos";
import Footer from "./components/Footer"; // 👈 import Footer
import Home from "./pages/Home";
import Players from "./pages/Players";
import Matches from "./pages/Matches";
import Stats from "./pages/Stats";
import News from "./pages/News";
import About from "./pages/About";
import FanHub from "./pages/FanHub";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/players" element={<Players />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/news" element={<News />} />
          <Route path="/about" element={<About />} />
          <Route path="/fan-hub" element={<FanHub />} />
          <Route path="/photos/:yearOrType" element={<Photos />} />
        </Routes>
      </main>

      {/* Page Footer (always at bottom) */}
      <Footer />
    </div>
  );
}

export default App;
