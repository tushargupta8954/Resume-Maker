import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";

const MinimalTemplate = ({ data }) => {
  if (!data) return null;

  const {
    personalInfo = {}, summary, experience = [], education = [],
    skills = [], projects = [], certifications = [], languages = [],
    colorScheme = {}, sectionOrder = [],
  } = data;

  const primary = colorScheme.primary || "#111827";
  const accent = colorScheme.accent || "#6366f1";
  const textColor = colorScheme.text || "#374151";

  const renderSection = (key) => {
    switch (key) {
      case "summary":
        return summary ? (
          <div key="summary" className="mb-6">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: accent }}>About</h2>
            <p className="text-[11px] leading-relaxed" style={{ color: textColor }}>{summary}</p>
          </div>
        ) : null;

      case "experience":
        return experience.length > 0 ? (
          <div key="experience" className="mb-6">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: accent }}>Experience</h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between mb-0.5">
                    <span className="text-xs font-bold" style={{ color: primary }}>{exp.position}</span>
                    <span className="text-[10px] text-slate-400">{exp.startDate} – {exp.isCurrentRole ? "Present" : exp.endDate}</span>
                  </div>
                  <p className="text-[11px] font-medium mb-1" style={{ color: accent }}>{exp.company}</p>
                  {exp.description && <p className="text-[11px] leading-relaxed" style={{ color: textColor }}>{exp.description}</p>}
                  {exp.achievements?.map((ach, i) => (
                    <p key={i} className="text-[11px] mt-0.5" style={{ color: textColor }}>– {ach}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "education":
        return education.length > 0 ? (
          <div key="education" className="mb-6">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: accent }}>Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between mb-2">
                <div>
                  <p className="text-xs font-bold" style={{ color: primary }}>{edu.degree}{edu.field && ` — ${edu.field}`}</p>
                  <p className="text-[11px]" style={{ color: accent }}>{edu.institution}</p>
                </div>
                <p className="text-[10px] text-slate-400">{edu.startDate} – {edu.endDate}</p>
              </div>
            ))}
          </div>
        ) : null;

      case "skills":
        return skills.length > 0 ? (
          <div key="skills" className="mb-6">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: accent }}>Skills</h2>
            <p className="text-[11px] leading-relaxed" style={{ color: textColor }}>
              {skills.map((s) => s.name).join(" · ")}
            </p>
          </div>
        ) : null;

      case "projects":
        return projects.length > 0 ? (
          <div key="projects" className="mb-6">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: accent }}>Projects</h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-2">
                <p className="text-xs font-bold" style={{ color: primary }}>{proj.name}</p>
                {proj.description && <p className="text-[11px] leading-relaxed" style={{ color: textColor }}>{proj.description}</p>}
              </div>
            ))}
          </div>
        ) : null;

      case "certifications":
        return certifications.length > 0 ? (
          <div key="certifications" className="mb-6">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: accent }}>Certifications</h2>
            {certifications.map((cert) => (
              <p key={cert.id} className="text-[11px] mb-1" style={{ color: textColor }}>
                <strong>{cert.name}</strong> — {cert.issuer} {cert.date && `(${cert.date})`}
              </p>
            ))}
          </div>
        ) : null;

      case "languages":
        return languages.length > 0 ? (
          <div key="languages" className="mb-6">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: accent }}>Languages</h2>
            <p className="text-[11px]" style={{ color: textColor }}>
              {languages.map((l) => `${l.name} (${l.proficiency})`).join(" · ")}
            </p>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  const defaultOrder = ["summary", "experience", "education", "skills", "projects", "certifications", "languages"];
  const order = sectionOrder.length > 0 ? sectionOrder : defaultOrder;

  return (
    <div style={{ color: textColor, backgroundColor: colorScheme.background || "#ffffff" }} className="min-h-full">
      {/* Minimal Header */}
      <div className="px-10 pt-10 pb-6" style={{ borderBottom: `1px solid #e2e8f0` }}>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: primary }}>
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.jobTitle && (
          <p className="text-xs mt-1" style={{ color: accent }}>{personalInfo.jobTitle}</p>
        )}
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3">
          {personalInfo.email && (
            <span className="text-[10px] text-slate-500">{personalInfo.email}</span>
          )}
          {personalInfo.phone && (
            <span className="text-[10px] text-slate-500">{personalInfo.phone}</span>
          )}
          {personalInfo.location && (
            <span className="text-[10px] text-slate-500">{personalInfo.location}</span>
          )}
          {personalInfo.linkedin && (
            <span className="text-[10px] text-slate-500">{personalInfo.linkedin}</span>
          )}
          {personalInfo.github && (
            <span className="text-[10px] text-slate-500">{personalInfo.github}</span>
          )}
          {personalInfo.website && (
            <span className="text-[10px] text-slate-500">{personalInfo.website}</span>
          )}
        </div>
      </div>

      <div className="px-10 py-6">
        {order.map((key) => renderSection(key))}
      </div>
    </div>
  );
};

export default MinimalTemplate;