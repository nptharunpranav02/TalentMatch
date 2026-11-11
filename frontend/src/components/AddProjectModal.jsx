import React, { useState } from "react";
import { X, Briefcase, Plus } from "lucide-react";

export default function AddProjectModal({ isOpen, onClose, onProjectAdded }) {
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("High");
  const [teamSize, setTeamSize] = useState(3);
  const [minExperienceYears, setMinExperienceYears] = useState(3);
  const [deadline, setDeadline] = useState("2027-05-31");

  const [requiredSkills, setRequiredSkills] = useState([
    { name: "React", minProficiency: 4 },
    { name: "Node.js", minProficiency: 3 }
  ]);
  const [newSkillName, setNewSkillName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setRequiredSkills([...requiredSkills, { name: newSkillName.trim(), minProficiency: 3 }]);
    setNewSkillName("");
  };

  const handleRemoveSkill = (index) => {
    setRequiredSkills(requiredSkills.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !client.trim()) return;
    setSaving(true);
    setError("");
    try {
      await onProjectAdded({ name: name.trim(), client: client.trim(), description, priority,
        teamSize: Number(teamSize), minExperienceYears: Number(minExperienceYears), deadline, requiredSkills });
      onClose();
    } catch (err) {
      setError(err.message || "Could not save project. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <Briefcase className="h-4 w-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900">Create Client Engagement & SOW</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Engagement Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Core Banking Cloud Migration"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Client Organization *</label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Global Bank"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Project Scope & SOW Deliverables</label>
            <textarea
              rows={2}
              placeholder="Scope, technical deliverables, architectural challenges..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold"
              >
                <option value="Critical">Critical SOW</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Team Quota</label>
              <input
                type="number"
                min="1"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Min Exp (Yrs)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={minExperienceYears}
                onChange={(e) => setMinExperienceYears(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Date</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 font-bold"
              />
            </div>
          </div>

          {/* Required Skills */}
          <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 space-y-2">
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">Required Skills</label>
            <div className="flex flex-wrap gap-1.5">
              {requiredSkills.map((req, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 font-bold shadow-2xs"
                >
                  <span>{req.name}</span>
                  <button type="button" onClick={() => handleRemoveSkill(idx)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. React, Python, Docker"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition-all shadow-xs"
              >
                + Add
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-200 cursor-pointer transition-all"
            >
              Create Engagement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
