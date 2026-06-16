import { Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink, Target, TrendingUp, Users, Award } from "lucide-react";

const Section = ({ title, children, color = "#1e293b" }) => (
  <div className="mb-6">
    <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2" style={{ color, borderColor: color }}>
      {title}
    </h2>
    {children}
  </div>
);

const ExecutiveTemplate = ({ data }) => {
  if (!data) return null;

  const {
    personalInfo = {}, summary, experience = [], education = [],
    skills = [], projects = [], certifications = [], languages = [],
    colorScheme = {}, sectionOrder = [],
  } = data;

  const primary = colorScheme.primary || "#1e293b";
  const secondary = colorScheme.secondary || "#475569";
  const accent = colorScheme.accent || "#0f172a";

  const renderSection = (key) => {
    switch (key) {
      case "summary":
        return summary ? (
          <Section key="summary" title="Executive Profile" color={primary}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <p className="text-sm leading-relaxed text-slate-700">{summary}</p>
              </div>
              <div className="space-y-2">
                {personalInfo.linkedin && (
                  <div className="flex items-center gap-2 text-xs">
                    <Linkedin className="w-3.5 h-3.5" style={{ color: primary }} />
                    <span className="text-slate-600">{personalInfo.linkedin}</span>
                  </div>
                )}
                {personalInfo.github && (
                  <div className="flex items-center gap-2 text-xs">
                    <Github className="w-3.5 h-3.5" style={{ color: primary }} />
                    <span className="text-slate-600">{personalInfo.github}</span>
                  </div>
                )}
              </div>
            </div>
          </Section>
        ) : null;

      case "experience":
        return experience.length > 0 ? (
          <Section key="experience" title="Leadership Experience" color={primary}>
            <div className="space-y-5">
              {experience.map((exp) => (
                <div key={exp.id} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-1">
                    <p className="text-xs font-medium" style={{ color: secondary }}>{exp.company}</p>
                    <p className="text-[10px] text-slate-500">
                      {exp.startDate} – {exp.isCurrentRole ? "Present" : exp.endDate}
                    </p>
                    {exp.location && <p className="text-[10px] text-slate-400">{exp.location}</p>}
                  </div>
                  <div className="md:col-span-3">
                    <h3 className="text-sm font-bold mb-1" style={{ color: textColor }}>{exp.position}</h3>
                    {exp.description && (
                      <p className="text-xs text-slate-600 leading-relaxed mb-2">{exp.description}</p>
                    )}
                    {exp.achievements?.length > 0 && (
                      <ul className="space-y-1">
                        {exp.achievements.map((ach, i) => (
                          <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                            <TrendingUp className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: primary }} />
                            {ach}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        ) : null;

      case "education":
        return education.length > 0 ? (
          <Section key="education" title="Education & Credentials" color={primary}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {education.map((edu) => (
                <div key={edu.id} className="p-3" style={{ borderLeft: `3px solid ${primary}` }}>
                  <h3 className="text-sm font-bold" style={{ color: textColor }}>{edu.degree}</h3>
                  <p className="text-xs" style={{ color: secondary }}>{edu.institution}</p>
                  <p className="text-[10px] text-slate-500">{edu.startDate} – {edu.endDate}</p>
                  {edu.gpa && <p className="text-[10px] text-slate-500 mt-1">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </Section>
        ) : null;

      case "skills":
        return skills.length > 0 ? (
          <Section key="skills" title="Core Competencies" color={primary}>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: `${primary}08` }}>
                  <Target className="w-3 h-3" style={{ color: primary }} />
                  <span className="text-xs font-medium" style={{ color: textColor }}>{skill.name}</span>
                </div>
              ))}
            </div>
          </Section>
        ) : null;

      case "certifications":
        return certifications.length > 0 ? (
          <Section key="certifications" title="Professional Certifications" color={primary}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex items-start gap-2">
                  <Award className="w-4 h-4 flex-shrink-0" style={{ color: primary }} />
                  <div>
                    <h3 className="text-xs font-semibold">{cert.name}</h3>
                    <p className="text-[10px] text-slate-500">{cert.issuer} · {cert.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        ) : null;

      case "languages":
        return languages.length > 0 ? (
          <Section key="languages" title="Languages" color={primary}>
            <div className="flex flex-wrap gap-3">
              {languages.map((lang) => (
                <div key={lang.id} className="flex items-center gap-2">
                  <span className="text-sm font-medium">{lang.name}</span>
                  <span className="text-xs text-slate-500">({lang.proficiency})</span>
                </div>
              ))}
            </div>
          </Section>
        ) : null;

      default:
        return null;
    }
  };

  const defaultOrder = ["summary", "experience", "education", "skills", "certifications", "languages"];
  const order = sectionOrder.length > 0 ? sectionOrder : defaultOrder;

  return (
    <div className="min-h-full" style={{ backgroundColor: colorScheme.background || "#ffffff" }}>
      {/* Executive Header */}
      <div className="px-8 py-10" style={{ backgroundColor: primary }}>
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white font-display">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            {personalInfo.jobTitle && (
              <p className="text-white/80 text-lg mt-2">{personalInfo.jobTitle}</p>
            )}
          </div>
          <div className="text-white/70 text-right">
            {personalInfo.email && <p className="text-sm">{personalInfo.email}</p>}
            {personalInfo.phone && <p className="text-sm">{personalInfo.phone}</p>}
            {personalInfo.location && <p className="text-sm">{personalInfo.location}</p>}
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {order.map((key) => renderSection(key))}
      </div>
    </div>
  );
};

export default ExecutiveTemplate;