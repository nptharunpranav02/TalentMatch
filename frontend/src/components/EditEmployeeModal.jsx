import React, { useState, useEffect } from "react";
import { X, User, Briefcase, MapPin, Award, CheckCircle2, AlertCircle } from "lucide-react";

export default function EditEmployeeModal({ isOpen, onClose, employee, onSaveEmployee }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    band: "L4 / Senior SDE",
    experienceYears: 4,
    location: "",
    skillsInput: "",
    certificationsInput: "",
    careerInterestsInput: ""
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || "",
        email: employee.email || "",
        role: employee.role || "",
        band: employee.band || "L4 / Senior SDE",
        experienceYears: employee.experienceYears || 1,
        location: employee.location || "",
        skillsInput: (employee.skills || []).map(s => `${s.name}:${s.proficiency}`).join(", "),
        certificationsInput: (employee.certifications || []).join(", "),
        careerInterestsInput: (employee.careerInterests || []).join(", ")
      });
      setError(null);
    }
  }, [employee]);

  if (!isOpen || !employee) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim()) {
      setError("Please provide both name and designation.");
      return;
    }

    // Parse skills format "Skill:Proficiency" e.g., "React:4.5, Node.js:4.0"
    const parsedSkills = formData.skillsInput
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)
      .map(item => {
        const [name, prof] = item.split(":");
        const pNum = parseFloat(prof) || 3.5;
        return {
          name: name.trim(),
          proficiency: Math.min(Math.max(pNum, 1), 5),
          years: Math.max(1, Math.round(formData.experienceYears * 0.7))
        };
      });

    const parsedCerts = formData.certificationsInput
      .split(",")
      .map(c => c.trim())
      .filter(Boolean);

    const parsedInterests = formData.careerInterestsInput
      .split(",")
      .map(i => i.trim())
      .filter(Boolean);

    const updated = {
      ...employee,
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role.trim(),
      band: formData.band,
      experienceYears: parseFloat(formData.experienceYears) || 1,
      location: formData.location.trim() || "Global Remote",
      skills: parsedSkills.length > 0 ? parsedSkills : employee.skills,
      certifications: parsedCerts,
      careerInterests: parsedInterests
    };

    onSaveEmployee(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Edit Employee Profile
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Update technical competencies, band, and availability records ({employee.empCode})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 font-bold">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Corporate Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Designation / Role *</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Seniority Band</label>
              <select
                value={formData.band}
                onChange={(e) => setFormData({ ...formData, band: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold cursor-pointer bg-white"
              >
                <option value="L3 / Software Engineer">L3 / Software Engineer</option>
                <option value="L4 / Senior SDE">L4 / Senior SDE</option>
                <option value="L5 / Staff AI Engineer">L5 / Staff AI Engineer</option>
                <option value="L5 / Senior Infrastructure Engineer">L5 / Senior Infrastructure Engineer</option>
                <option value="L6 / Principal Architect">L6 / Principal Architect</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Years of Experience</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="30"
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Location / Base Office</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
                placeholder="e.g. Bengaluru, India or Berlin, Germany"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-slate-700">Technical Skills & Proficiency</label>
              <span className="text-[10px] text-slate-400 font-medium">Format: Skill:Proficiency (1 to 5)</span>
            </div>
            <input
              type="text"
              value={formData.skillsInput}
              onChange={(e) => setFormData({ ...formData, skillsInput: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
              placeholder="React:4.5, TypeScript:4.0, Node.js:3.5, PostgreSQL:3.0"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Industry Certifications</label>
            <input
              type="text"
              value={formData.certificationsInput}
              onChange={(e) => setFormData({ ...formData, certificationsInput: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
              placeholder="AWS Certified Developer, CKA (Kubernetes), DeepLearning.AI"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Career Interests & Domain Aspirations</label>
            <input
              type="text"
              value={formData.careerInterestsInput}
              onChange={(e) => setFormData({ ...formData, careerInterestsInput: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
              placeholder="Healthcare & Life Sciences, Cloud Architecture, Generative AI"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-blue-200 flex items-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
