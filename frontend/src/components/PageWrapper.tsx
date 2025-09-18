import { motion } from "framer-motion";

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-b from-black to-red-900 text-white flex flex-col items-center justify-center p-8"
    >
      {children}
    </motion.div>
  );
}

export default PageWrapper;
