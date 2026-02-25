const BACKEND_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

export const TEMPLATE_OPTIONS = [
  { id: "classic", name: "Classic", uploadSlot: 1 },
  { id: "modern", name: "Modern", uploadSlot: 2 },
  { id: "minimal", name: "Minimal", uploadSlot: 3 },
  { id: "dark-elegant", name: "Dark Elegant", uploadSlot: 4 },
].map((template) => ({
  ...template,
  previewUrl: `${BACKEND_BASE_URL}/templates/${template.id}.png`,
}));

export const getTemplateById = (id) => TEMPLATE_OPTIONS.find((template) => template.id === id) || TEMPLATE_OPTIONS[0];
