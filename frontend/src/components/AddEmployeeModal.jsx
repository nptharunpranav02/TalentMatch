import React, { useState } from "react";
import { X, Plus, Trash2, UserPlus, Sparkles } from "lucide-react";

export default function AddEmployeeModal({ isOpen, onClose, onEmployeeAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Full Stack Engineer");
  const [department, setDepartment] = useState("Engineering");
  const [experienceYears, setExperienceYears] = useState(3);
  const [availabilityStatus, setAvailabilityStatus] = useState("BENCH");
  
  // Dynamic skills
  const [skills, setSkills] = useState([
    { name: "React", proficiency: 4, years: 3 },
    { name: "Node.js", proficiency: 3, years: 2 }
  ]);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillProf, setNewSkillProf] = useState(4);

  // Dynamic career interests
  const [careerInterests, setCareerInterests] = useState(["Cloud Architecture", "GenAI"]);
  const [newInterest, setNewInterest] = useState("");

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setSkills([...skills, { name: newSkillName.trim(), proficiency: Number(newSkillProf), years: 2 }]);
    setNewSkillName("");
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleAddInterest = () => {
    if (!newInterest.trim()) return;
    setCareerInterests([...careerInterests, newInterest.trim()]);
    setNewInterest("");
  };

  const handleRemoveInterest = (index) => {
    setCareerInterests(careerInterests.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;

    const newEmp = {
      name,
      email,
      role,
      department,
      experienceYears: Number(experienceYears),
      availabilityStatus,
      skills,
      careerInterests
    };

    onEmployeeAdded(newEmp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Register New Employee</h2>
              <p className="text-xs text-slate-500">Add an engineer's technical profile to the bench management pool.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Corporate Email *
              </label>
              <input
                type="email"
                required
                placeholder="e.g. rahul.sharma@talentmatch.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Designation / Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Engineering">Engineering</option>
                <option value="Data & AI">Data & AI</option>
                <option value="Cloud Operations">Cloud Operations</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="QA & Testing">QA & Testing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Experience (Years)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Availability Status */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Initial Bench Status
            </label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 p-3 rounded-xl border border-amber-200 bg-amber-50/50 cursor-pointer flex-1">
                <input
                  type="radio"
                  name="status"
                  value="BENCH"
                  checked={availabilityStatus === "BENCH"}
                  onChange={() => setAvailabilityStatus("BENCH")}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <span className="text-xs font-bold text-amber-800">Available on Bench (Ready to match)</span>
              </label>
              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer flex-1">
                <input
                  type="radio"
                  name="status"
                  value="ALLOCATED"
                  checked={availabilityStatus === "ALLOCATED"}
                  onChange={() => setAvailabilityStatus("ALLOCATED")}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-bold text-slate-700">Already Allocated</span>
              </label>
            </div>
          </div>

          {/* Technical Skills Section */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Technical Skills & Proficiencies
            </label>
            
            {/* Added Skills Tags */}
            <div className="flex flex-wrap gap-2">
              {skills.map((s, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs"
                >
                  <span>{s.name}</span>
                  <span className="text-[10px] text-indigo-600 font-mono">L{s.proficiency}/5</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(idx)}
                    className="text-slate-400 hover:text-rose-500 ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Skill Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Docker, Python, AWS, PostgreSQL"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={newSkillProf}
                onChange={(e) => setNewSkillProf(e.target.value)}
                className="px-2 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
              >
                <option value={5}>L5 (Expert)</option>
                <option value={4}>L4 (Advanced)</option>
                <option value={3}>L3 (Proficient)</option>
                <option value={2}>L2 (Intermediate)</option>
                <option value={1}>L1 (Beginner)</option>
              </select>
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Career Interests */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Career Aspirations / Preferred Domains
            </label>

            <div className="flex flex-wrap gap-1.5">
              {careerInterests.map((interest, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 shadow-2xs"
                >
                  <span>{interest}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(idx)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. LLMs, Kubernetes, Fintech, Microservices"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddInterest}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              Save Employee Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
