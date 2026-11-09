// Natural, organic color palettes categorized by engineering discipline
export const getSkillBadgeClass = (skillName = "") => {
  const s = skillName.toLowerCase();

  // Frontend & UI (Coastal Sky Blue)
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
    return "bg-sky-50 text-sky-800 border-sky-200";
  }

  // Backend & Databases (Warm Ochre / Amber)
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
    return "bg-amber-50 text-amber-800 border-amber-200";
  }

  // Cloud & DevOps (Forest Emerald / Sage)
  if (
    s.includes("aws") ||
    s.includes("docker") ||
    s.includes("kuber") ||
    s.includes("terraform") ||
    s.includes("ci/cd") ||
    s.includes("cloud") ||
    s.includes("linux")
  ) {
    return "bg-emerald-50 text-emerald-800 border-emerald-200";
  }

  // Data & AI (Deep Heather Blue / Indigo)
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
    return "bg-indigo-50 text-indigo-800 border-indigo-200";
  }

  return "bg-slate-100 text-slate-700 border-slate-200";
};
