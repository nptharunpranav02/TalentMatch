// Bright, vibrant, harmonious color palettes for engineering disciplines & avatars
export const getSkillBadgeClass = (skillName = "") => {
  const s = skillName.toLowerCase();

  // Frontend & UI (Bright Electric Sky / Cyan)
  if (
    s.includes("react") ||
    s.includes("tailwind") ||
    s.includes("javascript") ||
    s.includes("typescript") ||
    s.includes("css") ||
    s.includes("redux") ||
    s.includes("next") ||
    s.includes("vue")
  ) {
    return "bg-sky-50 text-sky-800 border-sky-300 hover:bg-sky-100 transition-colors";
  }

  // Backend & Databases (Bright Warm Amber / Honey)
  if (
    s.includes("node") ||
    s.includes("java") ||
    s.includes("spring") ||
    s.includes("kafka") ||
    s.includes("postgre") ||
    s.includes("sql") ||
    s.includes("mongo") ||
    s.includes("redis")
  ) {
    return "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 transition-colors";
  }

  // Cloud & DevOps (Bright Radiant Mint / Emerald)
  if (
    s.includes("aws") ||
    s.includes("docker") ||
    s.includes("kuber") ||
    s.includes("terraform") ||
    s.includes("ci/cd") ||
    s.includes("cloud") ||
    s.includes("linux")
  ) {
    return "bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100 transition-colors";
  }

  // Data & AI (Bright Royal Indigo / Iris)
  if (
    s.includes("python") ||
    s.includes("pytorch") ||
    s.includes("fastapi") ||
    s.includes("langchain") ||
    s.includes("pandas") ||
    s.includes("tableau") ||
    s.includes("ai") ||
    s.includes("ml")
  ) {
    return "bg-indigo-50 text-indigo-900 border-indigo-300 hover:bg-indigo-100 transition-colors";
  }

  return "bg-slate-50 text-slate-800 border-slate-300 hover:bg-slate-100 transition-colors";
};

// Deterministic vibrant avatar color palette
export const getAvatarColor = (name = "") => {
  const palettes = [
    { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
    { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" },
    { bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-200" },
    { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-200" },
    { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
    { bg: "bg-rose-100", text: "text-rose-700", border: "border-rose-200" },
    { bg: "bg-cyan-100", text: "text-cyan-700", border: "border-cyan-200" }
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % palettes.length;
  return palettes[index];
};

export const getInitials = (name = "") => {
  if (!name) return "TM";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
