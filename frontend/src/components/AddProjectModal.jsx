import React, { useState } from "react";
import { X } from "lucide-react";

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

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setRequiredSkills([...requiredSkills, { name: newSkillName.trim(), minProficiency: 3 }]);
    setNewSkillName("");
  };

  const handleRemoveSkill = (index) => {
    setRequiredSkills(requiredSkills.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !client) return;

    onProjectAdded({
      name,
      client,
      description,
      priority,
      teamSize: Number(teamSize),
      minExperienceYears: Number(minExperienceYears),
      deadline,
      requiredSkills
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden my-8">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">Create Project</h2>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Project Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Core Banking Migration"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-200 focus:outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Client *</label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Financial"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-200 focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Scope and technical deliverables..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-200 focus:outline-none focus:border-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-200 bg-white"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Team Size</label>
              <input
                type="number"
                min="1"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Min Exp (Yrs)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={minExperienceYears}
                onChange={(e) => setMinExperienceYears(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-200"
              />
            </div>
          </div>

          {/* Required Skills */}
          <div className="p-3 rounded-md bg-slate-50 border border-slate-100 space-y-2">
            <label className="block text-xs font-medium text-slate-700">Required Skills</label>
            <div className="flex flex-wrap gap-1.5">
              {requiredSkills.map((req, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 text-xs text-slate-800"
                >
                  <span>{req.name}</span>
                  <button type="button" onClick={() => handleRemoveSkill(idx)} className="text-slate-400 hover:text-slate-600">
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
                className="flex-1 px-2.5 py-1 text-xs rounded border border-slate-200 bg-white"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-2.5 py-1 rounded bg-slate-800 text-white text-xs font-medium"
              >
                Add Skill
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
