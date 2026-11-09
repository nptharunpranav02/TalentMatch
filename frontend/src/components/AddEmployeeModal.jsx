import React, { useState } from "react";
import { X, Plus } from "lucide-react";

export default function AddEmployeeModal({ isOpen, onClose, onEmployeeAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Full Stack Developer");
  const [department, setDepartment] = useState("Web Technologies");
  const [experienceYears, setExperienceYears] = useState(3);
  const [availabilityStatus, setAvailabilityStatus] = useState("BENCH");

  const [skills, setSkills] = useState([
    { name: "React", proficiency: 4, years: 3 },
    { name: "Node.js", proficiency: 3, years: 2 }
  ]);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillProf, setNewSkillProf] = useState(4);

  const [careerInterests, setCareerInterests] = useState(["System Design"]);
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
      department,
      experienceYears: Number(experienceYears),
      availabilityStatus,
      skills,
      careerInterests
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden my-8">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">Add Employee</h2>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
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
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-200 focus:outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Email *</label>
              <input
                type="email"
                required
                placeholder="e.g. rahul@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-200 focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Role / Title</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-200 focus:outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-200 bg-white"
              >
                <option value="Web Technologies">Web Technologies</option>
                <option value="Data & AI">Data & AI</option>
                <option value="Cloud Operations">Cloud Operations</option>
                <option value="Enterprise Systems">Enterprise Systems</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Exp (Years)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-200 focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Availability Status</label>
            <div className="flex gap-3 text-xs">
              <label className="flex items-center gap-2 p-2.5 rounded border border-slate-200 cursor-pointer flex-1 bg-slate-50">
                <input
                  type="radio"
                  name="status"
                  value="BENCH"
                  checked={availabilityStatus === "BENCH"}
                  onChange={() => setAvailabilityStatus("BENCH")}
                />
                <span className="font-medium text-slate-800">On Bench</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 rounded border border-slate-200 cursor-pointer flex-1">
                <input
                  type="radio"
                  name="status"
                  value="ALLOCATED"
                  checked={availabilityStatus === "ALLOCATED"}
                  onChange={() => setAvailabilityStatus("ALLOCATED")}
                />
                <span className="font-medium text-slate-700">Allocated</span>
              </label>
            </div>
          </div>

          {/* Skills */}
          <div className="p-3 rounded-md bg-slate-50 border border-slate-100 space-y-2">
            <label className="block text-xs font-medium text-slate-700">Skills</label>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 text-xs text-slate-800"
                >
                  <span>{s.name}</span>
                  <button type="button" onClick={() => handleRemoveSkill(idx)} className="text-slate-400 hover:text-slate-600">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill (e.g. React, Docker)"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="flex-1 px-2.5 py-1 text-xs rounded border border-slate-200 bg-white"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-2.5 py-1 rounded bg-slate-800 text-white text-xs font-medium"
              >
                Add
              </button>
            </div>
          </div>

          {/* Career Interests */}
          <div className="p-3 rounded-md bg-slate-50 border border-slate-100 space-y-2">
            <label className="block text-xs font-medium text-slate-700">Career Aspirations</label>
            <div className="flex flex-wrap gap-1.5">
              {careerInterests.map((interest, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 text-xs text-slate-700"
                >
                  <span>{interest}</span>
                  <button type="button" onClick={() => handleRemoveInterest(idx)} className="text-slate-400 hover:text-slate-600">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add interest (e.g. Cloud, Microservices)"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                className="flex-1 px-2.5 py-1 text-xs rounded border border-slate-200 bg-white"
              />
              <button
                type="button"
                onClick={handleAddInterest}
                className="px-2.5 py-1 rounded bg-slate-800 text-white text-xs font-medium"
              >
                Add
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
              Save Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
