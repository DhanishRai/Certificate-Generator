import { motion } from "framer-motion";

const TemplateCard = ({ template, selected, onSelect }) => {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect?.(template.id)}
      className={`w-full rounded-xl border p-3 text-left transition ${
        selected
          ? "border-primary-500 bg-primary-50 shadow-md dark:border-primary-400 dark:bg-primary-900/20"
          : "border-slate-200 bg-white hover:border-primary-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-primary-500"
      }`}
    >
      <div className={`rounded-lg p-3 ${template.previewStyle} ${template.border}`}>
        <div className={`text-sm ${template.fontClass}`}>Certificate of Achievement</div>
        <div className={`mt-2 h-2 w-2/3 rounded bg-gradient-to-r ${template.accent}`} />
        <div className="mt-2 h-1.5 w-1/2 rounded bg-slate-300/70 dark:bg-slate-500/60" />
        <div className="mt-5 h-7 w-7 rounded-full border-2 border-accent-500" />
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
