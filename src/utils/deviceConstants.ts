
// Define iPhone models available in the system
export const IPHONE_MODELS = [
  "iPhone XR",
  "iPhone 11",
  "iPhone 11 Pro",
  "iPhone 11 Pro Max",
  "iPhone 12",
  "iPhone 12 Mini",
  "iPhone 12 Pro",
  "iPhone 12 Pro Max",
  "iPhone 13",
  "iPhone 13 Mini",
  "iPhone 13 Pro",
  "iPhone 13 Pro Max",
  "iPhone 14",
  "iPhone 14 Plus",
  "iPhone 14 Pro",
  "iPhone 14 Pro Max",
  "iPhone 15",
  "iPhone 15 Plus",
  "iPhone 15 Pro",
  "iPhone 15 Pro Max",
  "iPhone 16",
  "iPhone 16 Plus",
  "iPhone 16 Pro",
  "iPhone 16 Pro Max"
];

// Define specifications for each model (colors and storage options)
export const MODEL_SPECS: Record<string, { colors: string[], storage: string[] }> = {
  "iPhone XR": {
    colors: ["Preto", "Branco", "Azul", "Amarelo", "Coral", "Vermelho"],
    storage: ["64GB", "128GB", "256GB"]
  },
  "iPhone 11": {
    colors: ["Preto", "Branco", "Verde", "Amarelo", "Roxo", "Vermelho"],
    storage: ["64GB", "128GB", "256GB"]
  },
  "iPhone 11 Pro": {
    colors: ["Cinza-espacial", "Prateado", "Verde-meia-noite", "Dourado"],
    storage: ["64GB", "256GB", "512GB"]
  },
  "iPhone 11 Pro Max": {
    colors: ["Cinza-espacial", "Prateado", "Verde-meia-noite", "Dourado"],
    storage: ["64GB", "256GB", "512GB"]
  },
  "iPhone 12": {
    colors: ["Preto", "Branco", "Azul", "Verde", "Roxo", "Vermelho"],
    storage: ["64GB", "128GB", "256GB"]
  },
  "iPhone 12 Mini": {
    colors: ["Preto", "Branco", "Azul", "Verde", "Roxo", "Vermelho"],
    storage: ["64GB", "128GB", "256GB"]
  },
  "iPhone 12 Pro": {
    colors: ["Grafite", "Prateado", "Azul-Pacífico", "Dourado"],
    storage: ["128GB", "256GB", "512GB"]
  },
  "iPhone 12 Pro Max": {
    colors: ["Grafite", "Prateado", "Azul-Pacífico", "Dourado"],
    storage: ["128GB", "256GB", "512GB"]
  },
  "iPhone 13": {
    colors: ["Rosa", "Azul", "Meia-noite", "Estelar", "Vermelho"],
    storage: ["128GB", "256GB", "512GB"]
  },
  "iPhone 13 Mini": {
    colors: ["Rosa", "Azul", "Meia-noite", "Estelar", "Vermelho"],
    storage: ["128GB", "256GB", "512GB"]
  },
  "iPhone 13 Pro": {
    colors: ["Grafite", "Prateado", "Azul-Sierra", "Dourado", "Verde-alpino"],
    storage: ["128GB", "256GB", "512GB", "1TB"]
  },
  "iPhone 13 Pro Max": {
    colors: ["Grafite", "Prateado", "Azul-Sierra", "Dourado", "Verde-alpino"],
    storage: ["128GB", "256GB", "512GB", "1TB"]
  },
  "iPhone 14": {
    colors: ["Azul", "Roxo", "Meia-noite", "Estelar", "Vermelho"],
    storage: ["128GB", "256GB", "512GB"]
  },
  "iPhone 14 Plus": {
    colors: ["Azul", "Roxo", "Meia-noite", "Estelar", "Vermelho"],
    storage: ["128GB", "256GB", "512GB"]
  },
  "iPhone 14 Pro": {
    colors: ["Preto-espacial", "Prateado", "Dourado", "Roxo-profundo"],
    storage: ["128GB", "256GB", "512GB", "1TB"]
  },
  "iPhone 14 Pro Max": {
    colors: ["Preto-espacial", "Prateado", "Dourado", "Roxo-profundo"],
    storage: ["128GB", "256GB", "512GB", "1TB"]
  },
  "iPhone 15": {
    colors: ["Azul", "Rosa", "Amarelo", "Verde", "Preto"],
    storage: ["128GB", "256GB", "512GB"]
  },
  "iPhone 15 Plus": {
    colors: ["Azul", "Rosa", "Amarelo", "Verde", "Preto"],
    storage: ["128GB", "256GB", "512GB"]
  },
  "iPhone 15 Pro": {
    colors: ["Titânio natural", "Titânio azul", "Titânio branco", "Titânio preto"],
    storage: ["128GB", "256GB", "512GB", "1TB"]
  },
  "iPhone 15 Pro Max": {
    colors: ["Titânio natural", "Titânio azul", "Titânio branco", "Titânio preto"],
    storage: ["256GB", "512GB", "1TB"]
  },
  "iPhone 16": {
    colors: ["Preto", "Branco", "Rosa", "Azul", "Verde"],
    storage: ["128GB", "256GB", "512GB"]
  },
  "iPhone 16 Plus": {
    colors: ["Preto", "Branco", "Rosa", "Azul", "Verde"],
    storage: ["128GB", "256GB", "512GB"]
  },
  "iPhone 16 Pro": {
    colors: ["Titânio natural", "Titânio preto", "Titânio branco", "Titânio desert"],
    storage: ["128GB", "256GB", "512GB", "1TB"]
  },
  "iPhone 16 Pro Max": {
    colors: ["Titânio natural", "Titânio preto", "Titânio branco", "Titânio desert"],
    storage: ["256GB", "512GB", "1TB"]
  }
};

// Define condition options for device state
export const CONDITION_OPTIONS = [
  { value: "10", label: "Novo (10/10)" },
  { value: "9", label: "Excelente (9/10)" },
  { value: "8", label: "Muito bom (8/10)" },
  { value: "7", label: "Bom (7/10)" },
  { value: "6", label: "Regular (6/10)" },
  { value: "5", label: "Médio (5/10)" },
  { value: "4", label: "Abaixo da média (4/10)" },
  { value: "3", label: "Ruim (3/10)" },
  { value: "2", label: "Muito ruim (2/10)" },
  { value: "1", label: "Péssimo (1/10)" }
];

// Add the missing constants
export const DEVICE_MODEL = IPHONE_MODELS;
export const DEVICE_STORAGE = Array.from(new Set(
  Object.values(MODEL_SPECS).flatMap(spec => spec.storage)
)).sort();
export const DEVICE_COLOR = Array.from(new Set(
  Object.values(MODEL_SPECS).flatMap(spec => spec.colors)
)).sort();
export const DEVICE_CONDITION = CONDITION_OPTIONS.map(option => option.value);
