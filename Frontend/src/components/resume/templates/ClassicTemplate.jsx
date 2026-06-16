import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";

const ClassicTemplate = ({ data }) => {
  if (!data) return null;

  const {
    personalInfo = {}, summary, experience = [], education = [],
    skills = [], projects = [], certifications = [], languages = [],
    colorScheme = {}, sectionOrder = [],
  } = data;

  const primary = colorScheme.primary || "#1e293b";
  const textColor = colorScheme.text || "#1f2937";

  const Section = ({ title, children }) => (
    <div className="mb-5">
      <div className="mb-2 pb-1" style={{ borderBottom: `2px solid ${primary}` }}>
        <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: primary }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );

  const renderSection = (key) => {
    switch (key) {
      case "summary":
        return summary ? (
          <Section key="summary" title="Professional Summary">
            <p className="text-[11px] leading-relaxed text-slate-600">{summary}</p>
          </Section>
        ) : null;

      case "experience":
        return experience.length > 0 ? (
          <Section key="experience" title="Experience">
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold" style={{ color: textColor }}>{exp.position}</h3>
                    <p className="text-xs font-medium" style={{ color: primary }}>{exp.company}{exp.location && `, ${exp.location}`}</p>
                  </div>
                  <p className="text-[10px] text-slate-500 text-right flex-shrink-0 ml-2">
                    {exp.startDate} – {exp.isCurrentRole ? "Present" : exp.endDate}
                  </p>
                </div>
                {exp.description && <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{exp.description}</p>}
                {exp.achievements?.map((ach, i) => (
                  <p key={i} className="text-[11px] text-slate-600 mt-0.5 pl-3 relative before:absolute before:left-0 before:content-['•']">
                    {ach}
                  </p>
                ))}
              </div>
            ))}
          </Section>
        ) : null;

      case "education":
        return education.length > 0 ? (
          <Section key="education" title="Education">
            {education.map((edu) => (
              <div key={edu.id} className="mb-2 flex justify-between">
                <div>
                  <h3 className="text-xs font-bold" style={{ color: textColor }}>
                    {edu.degree}{edu.field && ` in ${edu.field}`}
                  </h3>
                  <p className="text-xs text-slate-600">{edu.institution}</p>
                  {edu.gpa && <p className="text-[10px] text-slate-500">GPA: {edu.gpa}</p>}
                </div>
                <p className="text-[10px] text-slate-500 text-right flex-shrink-0 ml-2">
                  {edu.startDate} – {edu.endDate}
                </p>
              </div>
            ))}
          </Section>
        ) : null;

      case "skills":
        return skills.length > 0 ? (
          <Section key="skills" title="Skills">
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span key={skill.id} className="text-[10px] text-slate-600 border border-slate-300 px-2 py-0.5 rounded">
                  {skill.name}
                </span>
              ))}
            </div>
          </Section>
        ) : null;

      case "projects":
        return projects.length > 0 ? (
          <Section key="projects" title="Projects">
            {projects.map((proj) => (
              <div key={proj.id} className="mb-2">
                <h3 className="text-xs font-bold" style={{ color: textColor }}>{proj.name}</h3>
                {proj.description && <p className="text-[11px] text-slate-600 leading-relaxed">{proj.description}</p>}
              </div>
            ))}
          </Section>
        ) : null;

      case "certifications":
        return certifications.length > 0 ? (
          <Section key="certifications" title="Certifications">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between mb-1.5">
                <div>
                  <span className="text-xs font-semibold" style={{ color: textColor }}>{cert.name}</span>
                  <span className="text-[11px] text-slate-500"> · {cert.issuer}</span>
                </div>
                <span className="text-[10px] text-slate-400">{cert.date}</span>
              </div>
            ))}
          </Section>
        ) : null;

      case "languages":
        return languages.length > 0 ? (
          <Section key="languages" title="Languages">
            <div className="flex flex-wrap gap-3">
              {languages.map((lang) => (
                <span key={lang.id} className="text-[11px] text-slate-600">
                  <strong style={{ color: textColor }}>{lang.name}</strong> ({lang.proficiency})
                </span>
              ))}
            </div>
          </Section>
        ) : null;

      default:
        return null;
    }
  };

  const defaultOrder = ["summary", "experience", "education", "skills", "projects", "certifications", "languages"];
  const order = sectionOrder.length > 0 ? sectionOrder : defaultOrder;

  return (
    <div style={{ color: textColor, backgroundColor: colorScheme.background || "#ffffff" }} className="min-h-full">
      {/* Classic Header */}
      <div className="text-center px-8 py-8 border-b-2" style={{ borderColor: primary }}>
        <h1 className="text-xl font-bold uppercase tracking-widest font-display" style={{ color: primary }}>
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.jobTitle && (
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{personalInfo.jobTitle}</p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-3">
          {personalInfo.email && (
            <span className="flex items-center gap-1 text-[10px] text-slate-500">
              <Mail className="w-2.5 h-2.5" /> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1 text-[10px] text-slate-500">
              <Phone className="w-2.5 h-2.5" /> {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1 text-[10px] text-slate-500">
              <MapPin className="w-2.5 h-2.5" /> {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1 text-[10px] text-slate-500">
              <Linkedin className="w-2.5 h-2.5" /> {personalInfo.linkedin}
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1 text-[10px] text-slate-500">
              <Github className="w-2.5 h-2.5" /> {personalInfo.github}
            </span>
          )}
        </div>
      </div>

      <div className="px-8 py-6">
        {order.map((key) => renderSection(key))}
      </div>
    </div>
  );
};

export default ClassicTemplate;