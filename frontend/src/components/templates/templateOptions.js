export const TEMPLATE_OPTIONS = [
  {
    id: "classic",
    name: "Classic",
    accent: "from-primary-600 to-primary-500",
    border: "border-double border-4 border-primary-300",
    fontClass: "font-serif",
    previewStyle: "bg-gradient-to-br from-white to-primary-50",
  },
  {
    id: "modern",
    name: "Modern",
    accent: "from-secondary-600 to-primary-600",
    border: "border border-secondary-300",
    fontClass: "font-sans",
    previewStyle: "bg-gradient-to-br from-white to-secondary-50",
  },
  {
    id: "minimal",
    name: "Minimal",
    accent: "from-slate-700 to-slate-500",
    border: "border border-dashed border-slate-400",
    fontClass: "font-mono",
    previewStyle: "bg-gradient-to-br from-white to-slate-100",
  },
  {
    id: "dark-elegant",
    name: "Dark Elegant",
    accent: "from-slate-900 to-slate-700",
    border: "border border-amber-400",
    fontClass: "font-serif",
    previewStyle: "bg-gradient-to-br from-slate-900 to-slate-700 text-white",
  },
];

export const getTemplateById = (id) =>
  TEMPLATE_OPTIONS.find((template) => template.id === id) || TEMPLATE_OPTIONS[0];
