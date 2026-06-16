// src/components/resume/ResumeForm.jsx
import { useState } from "react";
import Button from "../common/Button.jsx";

const ResumeForm = ({ initialData, onSave, onCancel, isSaving, isEditing }) => {
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {isEditing ? "Edit Resume" : "Create New Resume"}
        </h1>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            isLoading={isSaving}
          >
            {isEditing ? "Update" : "Create"} Resume
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-soft p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Resume Title
            </label>
            <input
              type="text"
              value={formData.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Software Engineer Resume"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={formData.personalInfo?.firstName || ""}
              onChange={(e) => handleChange("personalInfo", {
                ...formData.personalInfo,
                firstName: e.target.value
              })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={formData.personalInfo?.lastName || ""}
              onChange={(e) => handleChange("personalInfo", {
                ...formData.personalInfo,
                lastName: e.target.value
              })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.personalInfo?.email || ""}
              onChange={(e) => handleChange("personalInfo", {
                ...formData.personalInfo,
                email: e.target.value
              })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Add more form fields as needed */}
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;