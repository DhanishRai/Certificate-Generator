import { motion } from "framer-motion";

const blobs = [
  "left-[-8rem] top-[-6rem] h-64 w-64 bg-primary-500/20",
  "right-[-6rem] top-1/3 h-72 w-72 bg-secondary-500/20",
  "bottom-[-7rem] left-1/3 h-80 w-80 bg-accent-500/20",
];

const FloatingBackground = ({ className = "" }) => {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.14),transparent_50%),radial-gradient(circle_at_80%_40%,rgba(20,184,166,0.12),transparent_45%),radial-gradient(circle_at_50%_90%,rgba(245,158,11,0.12),transparent_45%)]"
        animate={{ backgroundPosition: ["0% 0%", "100% 40%", "0% 0%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      {blobs.map((blobClass, index) => (
        <motion.div
          key={blobClass}
          className={`absolute rounded-full blur-3xl ${blobClass}`}
          animate={{ y: [0, -14, 0], x: [0, index % 2 === 0 ? 10 : -10, 0] }}
          transition={{ duration: 8 + index * 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

export default FloatingBackground;
