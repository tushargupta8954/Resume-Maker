import { Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink, Code, Database, Cloud, Terminal, Award } from "lucide-react";

const Section = ({ title, children, color = "#06b6d4" }) => (
  <div className="mb-6">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: color }} />
      <h2 className="text-sm font-mono font-bold uppercase tracking-wider" style={{ color }}>
        &lt;{title} /&gt;
      </h2>
    </div>
    {children}
  </div>
);

const TechTemplate = ({ data }) => {
  if (!data) return null;

  const {
    personalInfo = {}, summary, experience = [], education = [],
    skills = [], projects = [], certifications = [], languages = [],
    colorScheme = {}, sectionOrder = [],
  } = data;

  const primary = colorScheme.primary || "#06b6d4";
  const secondary = colorScheme.secondary || "#3b82f6";
  const accent = colorScheme.accent || "#8b5cf6";
  const textColor = colorScheme.text || "#0f172a";

  const renderSection = (key) => {
    switch (key) {
      case "summary":
        return summary ? (
          <Section key="summary" title="Technical Profile" color={primary}>
            <div className="font-mono text-sm leading-relaxed border-l-2 pl-3" style={{ borderColor: primary, color: textColor }}>
              {summary}
            </div>
          </Section>
        ) : null;

      case "experience":
        return experience.length > 0 ? (
          <Section key="experience" title="Experience" color={primary}>
            <div className="space-y-5">
              {experience.map((exp) => (
                <div key={exp.id} className="relative">
                  <div className="absolute -left-2 top-2 w-3 h-3 border-2 rounded-full" style={{ borderColor: primary, backgroundColor: colorScheme.background || "#ffffff" }} />
                  <div className="pl-5 ml-2 border-l-2 pb-4" style={{ borderColor: `${primary}30` }}>
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-sm font-bold font-mono" style={{ color: textColor }}>{exp.position}</h3>
                        <p className="text-xs" style={{ color: primary }}>{exp.company}</p>
                      </div>
                      <p className="text-[10px] font-mono text-slate-500">
                        {exp.startDate} – {exp.isCurrentRole ? "Present" : exp.endDate}
                      </p>
                    </div>
                    {exp.description && (
                      <p className="text-xs text-slate-600 font-mono leading-relaxed mb-2">{exp.description}</p>
                    )}
                    {exp.achievements?.length > 0 && (
                      <ul className="space-y-1">
                        {exp.achievements.map((ach, i) => (
                          <li key={i} className="text-xs font-mono text-slate-600 flex items-start gap-2">
                            <code style={{ color: primary }}>&gt;</code>
                            {ach}
                          </li>
                        ))}
                      </ul>
                    )}
                    {exp.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {exp.technologies.map((tech, i) => (
                          <code key={i} className="px-2 py-0.5 text-[9px] font-mono rounded" style={{ backgroundColor: `${primary}10`, color: primary }}>
                            {tech}
                          </code>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        ) : null;

      case "skills":
        return skills.length > 0 ? (
          <Section key="skills" title="Tech Stack" color={primary}>
            <div className="grid grid-cols-2 gap-3">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: `${primary}05` }}>
                  <Code className="w-4 h-4" style={{ color: primary }} />
                  <div className="flex-1">
                    <p className="text-xs font-medium font-mono">{skill.name}</p>
                    {skill.level && (
                      <div className="w-full h-1 rounded-full mt-1 overflow-hidden" style={{ backgroundColor: `${primary}20` }}>
                        <div className="h-full rounded-full" style={{ width: skill.level === "expert" ? "100%" : skill.level === "advanced" ? "75%" : "50%", backgroundColor: primary }} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        ) : null;

      case "projects":
        return projects.length > 0 ? (
          <Section key="projects" title="Projects" color={primary}>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="p-3 rounded-lg" style={{ border: `1px solid ${primary}20` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Terminal className="w-4 h-4" style={{ color: primary }} />
                    <h3 className="text-sm font-bold font-mono" style={{ color: textColor }}>{proj.name}</h3>
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} className="text-[10px]" style={{ color: primary }}>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-xs text-slate-600 font-mono leading-relaxed mb-2">{proj.description}</p>
                  )}
                  {proj.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies.map((tech, i) => (
                        <code key={i} className="px-2 py-0.5 text-[9px] font-mono rounded" style={{ backgroundColor: `${primary}10`, color: primary }}>
                          {tech}
                        </code>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        ) : null;

      case "education":
        return education.length > 0 ? (
          <Section key="education" title="Education" color={primary}>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="flex items-start gap-3">
                  <Database className="w-4 h-4 mt-0.5" style={{ color: primary }} />
                  <div>
                    <h3 className="text-sm font-bold font-mono">{edu.degree}</h3>
                    <p className="text-xs font-mono" style={{ color: primary }}>{edu.institution}</p>
                    <p className="text-[10px] font-mono text-slate-500">{edu.startDate} – {edu.endDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        ) : null;

      case "certifications":
        return certifications.length > 0 ? (
          <Section key="certifications" title="Certifications" color={primary}>
            <div className="space-y-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex items-start gap-2">
                  <Cloud className="w-3.5 h-3.5" style={{ color: primary }} />
                  <div>
                    <h3 className="text-xs font-semibold font-mono">{cert.name}</h3>
                    <p className="text-[10px] font-mono text-slate-500">{cert.issuer} · {cert.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        ) : null;

      case "languages":
        return languages.length > 0 ? (
          <Section key="languages" title="Languages" color={primary}>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <div key={lang.id} className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: `${primary}10` }}>
                  <span className="text-xs font-medium font-mono">{lang.name}</span>
                  <span className="text-[10px] font-mono">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </Section>
        ) : null;

      default:
        return null;
    }
  };

  const defaultOrder = ["summary", "experience", "projects", "skills", "education", "certifications", "languages"];
  const order = sectionOrder.length > 0 ? sectionOrder : defaultOrder;

  return (
    <div className="min-h-full" style={{ backgroundColor: colorScheme.background || "#0a0a0f" }}>
      {/* Tech Header */}
      <div className="px-8 py-8 border-b-2" style={{ borderColor: `${primary}30` }}>
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold font-mono" style={{ color: primary }}>
              {personalInfo.firstName} <span style={{ color: textColor }}>{personalInfo.lastName}</span>
            </h1>
            {personalInfo.jobTitle && (
              <p className="text-sm font-mono mt-1" style={{ color: textColor }}>{personalInfo.jobTitle}</p>
            )}
            <div className="flex flex-wrap gap-4 mt-3">
              {personalInfo.github && (
                <span className="flex items-center gap-1 text-xs font-mono text-slate-400">
                  <Github className="w-3 h-3" /> {personalInfo.github}
                </span>
              )}
              {personalInfo.linkedin && (
                <span className="flex items-center gap-1 text-xs font-mono text-slate-400">
                  <Linkedin className="w-3 h-3" /> {personalInfo.linkedin}
                </span>
              )}
            </div>
          </div>
          <div className="text-right font-mono">
            {personalInfo.email && <p className="text-xs text-slate-400">{personalInfo.email}</p>}
            {personalInfo.phone && <p className="text-xs text-slate-400">{personalInfo.phone}</p>}
            {personalInfo.location && <p className="text-xs text-slate-400">{personalInfo.location}</p>}
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {order.map((key) => renderSection(key))}
      </div>
    </div>
  );
};

export default TechTemplate;