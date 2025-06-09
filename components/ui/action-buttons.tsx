import { motion } from "framer-motion";

export function ActionButtons() {
  return (
    <motion.div
      className="flex flex-wrap justify-center gap-3 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
    </motion.div>
  );
} 