// Consistent semantic badge styling system:
// - Technical skills: Neutral blue
// - Certifications: Light violet
// - Required project skills: Green
// - Missing skills: Orange
// - Critical warnings / blockers: Red

export const badgeStyles = {
  // Employee verified technical skills
  technicalSkill: "bg-blue-50 text-blue-800 border-blue-200/90 hover:bg-blue-100/70 transition-colors",
  
  // Official industry certifications & credentials
  certification: "bg-purple-50 text-purple-800 border-purple-200/90 hover:bg-purple-100/70 transition-colors",
  
  // Required SOW project competencies
  requiredSkill: "bg-emerald-50 text-emerald-800 border-emerald-200/90 hover:bg-emerald-100/70 transition-colors",
  
  // Unmatched / missing skill gaps
  missingSkill: "bg-amber-50 text-amber-900 border-amber-300/90 hover:bg-amber-100/70 transition-colors",
  
  // Critical warnings or tenure gaps
  criticalWarning: "bg-rose-50 text-rose-800 border-rose-300/90 hover:bg-rose-100/70 transition-colors"
};

export const getSkillBadgeClass = (skillName = "", type = "technicalSkill") => {
  if (badgeStyles[type]) {
    return badgeStyles[type];
  }
  return badgeStyles.technicalSkill;
};

// Deterministic avatar color palette
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
