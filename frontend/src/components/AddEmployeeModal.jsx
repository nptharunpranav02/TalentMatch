import React, { useState } from "react";
import { X, Plus, UserPlus } from "lucide-react";

export default function AddEmployeeModal({ isOpen, onClose, onEmployeeAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Full Stack Software Engineer");
  const [band, setBand] = useState("L4 / Senior SDE");
  const [department, setDepartment] = useState("Enterprise Web Engineering");
  const [location, setLocation] = useState("Global Remote");
  const [experienceYears, setExperienceYears] = useState(3.5);
  const [availabilityStatus, setAvailabilityStatus] = useState("BENCH");

  const [skills, setSkills] = useState([
    { name: "React", proficiency: 4, years: 3 },
    { name: "Node.js", proficiency: 4, years: 2.5 }
  ]);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillProf, setNewSkillProf] = useState(4);

  const [careerInterests, setCareerInterests] = useState(["Cloud Architecture", "System Design"]);
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

    onEmployeeAdded({
      name,
      email,
      role,
      band,
      department,
      location,
      experienceYears: Number(experienceYears),
      availabilityStatus,
      skills,
      careerInterests
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <UserPlus className="h-4 w-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900">Add Global Talent Profile</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Corporate Email *</label>
              <input
                type="email"
                required
                placeholder="e.g. alex@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Role Title</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Seniority Band</label>
              <select
                value={band}
                onChange={(e) => setBand(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
              >
                <option value="L3 / SDE-1">L3 / Associate</option>
                <option value="L4 / Senior SDE">L4 / Mid-Senior</option>
                <option value="L5 / Staff Engineer">L5 / Staff / Lead</option>
                <option value="L6 / Principal Architect">L6 / Principal</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Base Office</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. London, UK / Remote"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
              >
                <option value="Enterprise Web Engineering">Enterprise Web Engineering</option>
                <option value="Applied AI & Machine Learning">Applied AI & Machine Learning</option>
                <option value="Cloud Platform Engineering">Cloud Platform Engineering</option>
                <option value="Enterprise Systems">Enterprise Systems</option>
                <option value="Security & Compliance">Security & Compliance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tenure (Years Exp)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Availability Status</label>
            <div className="flex gap-3 text-xs">
              <label className="flex items-center gap-2 p-3 rounded-xl border border-amber-300 cursor-pointer flex-1 bg-amber-50/70 shadow-2xs">
                <input
                  type="radio"
                  name="status"
                  value="BENCH"
                  checked={availabilityStatus === "BENCH"}
                  onChange={() => setAvailabilityStatus("BENCH")}
                  className="accent-amber-600"
                />
                <span className="font-extrabold text-amber-950">On Bench (Available to match)</span>
              </label>
              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer flex-1 bg-slate-50">
                <input
                  type="radio"
                  name="status"
                  value="ALLOCATED"
                  checked={availabilityStatus === "ALLOCATED"}
                  onChange={() => setAvailabilityStatus("ALLOCATED")}
                />
                <span className="font-bold text-slate-700">Already Allocated</span>
              </label>
            </div>
          </div>

          {/* Skills */}
          <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 space-y-2">
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">Skills & Proficiencies</label>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 font-bold shadow-2xs"
                >
                  <span>{s.name} (L{s.proficiency})</span>
                  <button type="button" onClick={() => handleRemoveSkill(idx)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill (e.g. React, Kubernetes, Python)"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium"
              />
              <select
                value={newSkillProf}
                onChange={(e) => setNewSkillProf(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-bold"
              >
                <option value={5}>L5 (Mastery)</option>
                <option value={4}>L4 (Advanced)</option>
                <option value={3}>L3 (Proficient)</option>
                <option value={2}>L2 (Intermediate)</option>
              </select>
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition-all shadow-xs"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Domain Aspirations */}
          <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 space-y-2">
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">Domain Aspirations</label>
            <div className="flex flex-wrap gap-1.5">
              {careerInterests.map((interest, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 border border-emerald-300 text-xs text-emerald-900 font-bold"
                >
                  <span>{interest}</span>
                  <button type="button" onClick={() => handleRemoveInterest(idx)} className="text-emerald-700 hover:text-emerald-950 cursor-pointer">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add career goal (e.g. Distributed Systems, GenAI)"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium"
              />
              <button
                type="button"
                onClick={handleAddInterest}
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
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-200 cursor-pointer transition-all"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
