import { motion } from "framer-motion";
import { useState } from "react";

const TemplateCard = ({ template, selected, onSelect }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.button
      type="button"
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect?.(template.id)}
      className={`w-full rounded-xl border p-3 text-left transition ${
        selected
          ? "border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/20 ring-2 ring-primary-500/30 dark:border-primary-400 dark:bg-primary-900/20"
          : "border-slate-200 bg-white hover:border-primary-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-primary-500"
      }`}
    >
      <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
        {!imageError ? (
          <img
            src={template.previewUrl}
            alt={template.name}
            className="h-28 w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-28 w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-xs text-slate-500 dark:from-slate-800 dark:to-slate-700 dark:text-slate-300">
            Upload template{template.id}.png
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{template.name}</p>
        {selected ? (
          <span className="rounded-full bg-primary-600 px-2 py-0.5 text-xs font-medium text-white">Selected</span>
        ) : null}
      </div>
    </motion.button>
  );
};

export default TemplateCard;
