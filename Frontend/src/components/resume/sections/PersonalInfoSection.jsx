import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  User, Mail, Phone, MapPin, Linkedin,
  Github, Globe, Briefcase, Link,
} from "lucide-react";
import { updatePersonalInfo, selectActiveResumeData } from "../../../features/resume/resumeSlice.js";
import Input from "../../common/Input.jsx";

const PersonalInfoSection = () => {
  const dispatch = useDispatch();
  const resumeData = useSelector(selectActiveResumeData);
  const info = resumeData?.personalInfo || {};

  const handleChange = (field) => (e) => {
    dispatch(updatePersonalInfo({ [field]: e.target.value }));
  };

  const fields = [
    { key: "firstName", label: "First Name", placeholder: "Harish", icon: User, required: true, col: 1 },
    { key: "lastName", label: "Last Name", placeholder: "Kumar", icon: User, required: true, col: 1 },
    { key: "jobTitle", label: "Job Title", placeholder: "Senior Software Engineer", icon: Briefcase, required: false, col: 2 },
    { key: "email", label: "Email", placeholder: "harish@example.com", type: "email", icon: Mail, required: true, col: 1 },
    { key: "phone", label: "Phone", placeholder: "+1 (555) 000-0000", type: "tel", icon: Phone, required: false, col: 1 },
    { key: "location", label: "Location", placeholder: "Delhi, DL", icon: MapPin, required: false, col: 2 },
    { key: "linkedin", label: "LinkedIn URL", placeholder: "linkedin.com/in/harish21", icon: Linkedin, required: false, col: 1 },
    { key: "github", label: "GitHub URL", placeholder: "github.com/harish21", icon: Github, required: false, col: 1 },
    { key: "website", label: "Website / Portfolio", placeholder: "harish.dev", icon: Globe, required: false, col: 1 },
    { key: "portfolio", label: "Portfolio Link", placeholder: "portfolio.harish.com", icon: Link, required: false, col: 1 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div>
        <h3 className="text-base font-semibold text-slate-800">Personal Information</h3>
        <p className="text-sm text-slate-500 mt-0.5">Your contact details and professional identity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ key, label, placeholder, type = "text", icon, required, col }) => (
          <div key={key} className={col === 2 ? "sm:col-span-2" : ""}>
            <Input
              label={label}
              type={type}
              placeholder={placeholder}
              value={info[key] || ""}
              onChange={handleChange(key)}
              icon={icon}
              required={required}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PersonalInfoSection;