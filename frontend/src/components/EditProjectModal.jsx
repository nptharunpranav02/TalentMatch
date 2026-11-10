import React, { useState, useEffect } from "react";
import { X, Briefcase, Building2, Calendar, Users, AlertCircle, CheckCircle2 } from "lucide-react";

export default function EditProjectModal({ isOpen, onClose, project, onSaveProject }) {
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    description: "",
    domain: "Fintech & Banking",
    priority: "Normal",
    minExperienceYears: 3,
    targetBand: "L4 / Senior SDE",
    teamSize: 3,
    startDate: "",
    deadline: "",
    requiredSkillsInput: ""
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        client: project.client || "",
        description: project.description || "",
        domain: project.domain || "Enterprise IT",
        priority: project.priority || "Normal",
        minExperienceYears: project.minExperienceYears || 2,
        targetBand: project.targetBand || "L4 / Senior SDE",
        teamSize: project.teamSize || 3,
        startDate: project.startDate || "",
        deadline: project.deadline || "",
        requiredSkillsInput: (project.requiredSkills || [])
          .map(s => `${s.name}:${s.minProficiency || 3.5}`)
          .join(", ")
      });
      setError(null);
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.client.trim()) {
      setError("Please specify both Project Name and Client.");
      return;
    }

    const parsedSkills = formData.requiredSkillsInput
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)
      .map(item => {
        const [name, prof] = item.split(":");
        const pNum = parseFloat(prof) || 3.5;
        return {
          name: name.trim(),
          minProficiency: Math.min(Math.max(pNum, 1), 5),
          weight: 1.0
        };
      });

    const newTeamSize = parseInt(formData.teamSize, 10) || 1;
    if (newTeamSize < (project.allocatedCount || 0)) {
      setError(`Team size cannot be smaller than currently allocated engineers (${project.allocatedCount}).`);
      return;
    }

    const updated = {
      ...project,
      name: formData.name.trim(),
      client: formData.client.trim(),
      description: formData.description.trim(),
      domain: formData.domain,
      priority: formData.priority,
      minExperienceYears: parseFloat(formData.minExperienceYears) || 1,
      targetBand: formData.targetBand,
      teamSize: newTeamSize,
      startDate: formData.startDate,
      deadline: formData.deadline,
      requiredSkills: parsedSkills.length > 0 ? parsedSkills : project.requiredSkills
    };

    onSaveProject(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Edit Project SOW & Requirements
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Update staffing requirements, dates, and priorities ({project.projectCode})
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 font-bold">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Project Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Client Organization *</label>
              <input
                type="text"
                required
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Project Description & SOW Scope</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-medium text-xs resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Industry Domain</label>
              <select
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold cursor-pointer bg-white"
              >
                <option value="Fintech & Banking">Fintech & Banking</option>
                <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                <option value="Supply Chain & Cloud Infrastructure">Supply Chain & Cloud Infrastructure</option>
                <option value="Enterprise IT & SaaS">Enterprise IT & SaaS</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Priority Level</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold cursor-pointer bg-white"
              >
                <option value="Critical">Critical Priority</option>
                <option value="High">High Priority</option>
                <option value="Normal">Normal Priority</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Min Experience (Yrs)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="20"
                value={formData.minExperienceYears}
                onChange={(e) => setFormData({ ...formData, minExperienceYears: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Seniority</label>
              <select
                value={formData.targetBand}
                onChange={(e) => setFormData({ ...formData, targetBand: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold cursor-pointer bg-white"
              >
                <option value="L3 / Software Engineer">L3 / Software Engineer</option>
                <option value="L4 / Senior SDE">L4 / Senior SDE</option>
                <option value="L5 / Staff AI Engineer">L5 / Staff AI Engineer</option>
                <option value="L5 / Senior Infrastructure">L5 / Senior Infrastructure</option>
                <option value="L6 / Principal Architect">L6 / Principal Architect</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Total Positions (Seats)</label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.teamSize}
                onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-slate-700">Required Skills & Minimum Proficiency</label>
              <span className="text-[10px] text-slate-400 font-medium">Format: Skill:MinProficiency (1 to 5)</span>
            </div>
            <input
              type="text"
              value={formData.requiredSkillsInput}
              onChange={(e) => setFormData({ ...formData, requiredSkillsInput: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
              placeholder="Python:4.0, FastAPI:3.5, Docker:3.0"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Target End / Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>
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
              <span>Update Project SOW</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
