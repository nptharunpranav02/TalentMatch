import React, { useState } from "react";
import { X, Plus } from "lucide-react";

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden my-8">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70">
          <h2 className="text-base font-bold text-slate-900">Add Global Talent Profile</h2>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-200 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Corporate Email *</label>
              <input
                type="email"
                required
                placeholder="e.g. alex@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-200 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Role Title</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-200 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Seniority Band</label>
              <select
                value={band}
                onChange={(e) => setBand(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-200 bg-white"
              >
                <option value="L3 / SDE-1">L3 / Associate</option>
                <option value="L4 / Senior SDE">L4 / Mid-Senior</option>
                <option value="L5 / Staff Engineer">L5 / Staff / Lead</option>
                <option value="L6 / Principal Architect">L6 / Principal</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Base Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. London, UK / Remote"
                className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-200 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-200 bg-white"
              >
                <option value="Enterprise Web Engineering">Enterprise Web Engineering</option>
                <option value="Applied AI & Machine Learning">Applied AI & Machine Learning</option>
                <option value="Cloud Platform Engineering">Cloud Platform Engineering</option>
                <option value="Enterprise Systems">Enterprise Systems</option>
                <option value="Security & Compliance">Security & Compliance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Tenure (Years Exp)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-200 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Availability Status</label>
            <div className="flex gap-3 text-xs">
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 cursor-pointer flex-1 bg-amber-50/50">
                <input
                  type="radio"
                  name="status"
                  value="BENCH"
                  checked={availabilityStatus === "BENCH"}
                  onChange={() => setAvailabilityStatus("BENCH")}
                />
                <span className="font-semibold text-amber-900">On Bench (Available to match)</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 cursor-pointer flex-1">
                <input
                  type="radio"
                  name="status"
                  value="ALLOCATED"
                  checked={availabilityStatus === "ALLOCATED"}
                  onChange={() => setAvailabilityStatus("ALLOCATED")}
                />
                <span className="font-medium text-slate-700">Already Allocated</span>
              </label>
            </div>
          </div>

          {/* Skills */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Skills & Proficiencies</label>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 text-xs text-slate-800 font-medium"
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
                className="flex-1 px-2.5 py-1 text-xs rounded border border-slate-200 bg-white"
              />
              <select
                value={newSkillProf}
                onChange={(e) => setNewSkillProf(e.target.value)}
                className="px-2 py-1 text-xs rounded border border-slate-200 bg-white"
              >
                <option value={5}>L5 (Mastery)</option>
                <option value={4}>L4 (Advanced)</option>
                <option value={3}>L3 (Proficient)</option>
                <option value={2}>L2 (Intermediate)</option>
              </select>
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1 rounded bg-slate-900 text-white text-xs font-semibold cursor-pointer"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Career Interests */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Domain Aspirations</label>
            <div className="flex flex-wrap gap-1.5">
              {careerInterests.map((interest, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 text-xs text-slate-700"
                >
                  <span>{interest}</span>
                  <button type="button" onClick={() => handleRemoveInterest(idx)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
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
                className="flex-1 px-2.5 py-1 text-xs rounded border border-slate-200 bg-white"
              />
              <button
                type="button"
                onClick={handleAddInterest}
                className="px-3 py-1 rounded bg-slate-800 text-white text-xs font-semibold cursor-pointer"
              >
                + Add
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded shadow-xs cursor-pointer"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
