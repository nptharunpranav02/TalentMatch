// Consistent, high-fidelity semantic badge styling system:
// - Technical skills: Refined neutral blue with subtle border
// - Certifications: Royal violet with metallic sheen accent
// - Required project skills: Emerald green with crisp contrast
// - Missing skills: Warm amber with warning indicator
// - Critical warnings / blockers: Crimson rose

export const badgeStyles = {
  // Employee verified technical skills
  technicalSkill: "bg-slate-100/90 hover:bg-blue-50 text-slate-800 hover:text-blue-800 border border-slate-200 hover:border-blue-300 font-semibold transition-all shadow-2xs",
  
  // Official industry certifications & credentials
  certification: "bg-violet-50 text-violet-900 border border-violet-200/90 font-bold hover:bg-violet-100 transition-all shadow-2xs",
  
  // Required SOW project competencies
  requiredSkill: "bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold hover:bg-emerald-100 transition-all shadow-2xs",
  
  // Unmatched / missing skill gaps
  missingSkill: "bg-amber-50 text-amber-950 border border-amber-300/90 font-semibold hover:bg-amber-100 transition-all shadow-2xs",
  
  // Critical warnings or tenure gaps
  criticalWarning: "bg-rose-50 text-rose-900 border border-rose-300/90 font-bold hover:bg-rose-100 transition-all shadow-2xs"
};

export const getSkillBadgeClass = (skillName = "", type = "technicalSkill") => {
  if (badgeStyles[type]) {
    return badgeStyles[type];
  }
  return badgeStyles.technicalSkill;
};

// Deterministic avatar color palette with refined pastel backgrounds and deep contrast text
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
