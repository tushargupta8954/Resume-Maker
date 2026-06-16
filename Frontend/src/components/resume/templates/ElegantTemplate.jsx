import { Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink, Award, BookOpen, Sparkles, Briefcase, GraduationCap, Code2, Languages, Trophy, Calendar, MapPinIcon } from "lucide-react";

const Section = ({ title, icon: Icon, children, color = "#6366f1" }) => (
  <div className="mb-8 group">
    <div className="flex items-center gap-2 mb-4">
      <div className="p-1 rounded-lg transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: `${color}15` }}>
        <Icon className="w-3.5 h-3.5" style={{ color }} />
      </div>
      <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color, letterSpacing: '0.1em' }}>
        {title}
      </h2>
      <div className="flex-1 h-px bg-gradient-to-r" style={{ background: `linear-gradient(to right, ${color}30, transparent)` }} />
    </div>
    {children}
  </div>
);

const ElegantTemplate = ({ data }) => {
  if (!data) return null;

  const {
    personalInfo = {}, 
    summary, 
    experience = [], 
    education = [],
    skills = [], 
    projects = [], 
    certifications = [], 
    languages = [],
    colorScheme = {}, 
    sectionOrder = [],
  } = data;

  const primary = colorScheme.primary || "#6366f1";
  const secondary = colorScheme.secondary || "#8b5cf6";
  const accent = colorScheme.accent || "#f59e0b";
  const textColor = colorScheme.text || "#1e293b";

  const renderSection = (key) => {
    switch (key) {
      case "summary":
        return summary ? (
          <Section key="summary" title="About Me" icon={Sparkles} color={primary}>
            <div className="relative px-6 py-5 rounded-2xl transition-all duration-300 hover:shadow-lg" 
                 style={{ 
                   backgroundColor: `${primary}04`,
                   borderLeft: `3px solid ${primary}`,
                 }}>
              <div className="absolute -top-2 -right-2 w-12 h-12 opacity-5" style={{ backgroundColor: primary, borderRadius: '50%' }} />
              <p className="text-sm leading-relaxed" style={{ color: textColor }}>
                {summary}
              </p>
            </div>
          </Section>
        ) : null;

      case "experience":
        return experience.length > 0 ? (
          <Section key="experience" title="Work Experience" icon={Briefcase} color={primary}>
            <div className="space-y-6">
              {experience.map((exp, idx) => (
                <div key={exp.id} className="relative pl-8">
                  {/* Timeline line */}
                  {idx !== experience.length - 1 && (
                    <div className="absolute left-[5px] top-6 bottom-0 w-px" style={{ backgroundColor: `${primary}20` }} />
                  )}
                  
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1.5">
                    <div className="w-3 h-3 rounded-full transition-all duration-300 hover:scale-125" style={{ backgroundColor: primary, boxShadow: `0 0 0 3px ${primary}20` }} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold" style={{ color: textColor }}>{exp.position}</h3>
                        <p className="text-xs font-medium mt-0.5" style={{ color: primary }}>{exp.company}</p>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Calendar className="w-2.5 h-2.5" />
                        <span>{exp.startDate} – {exp.isCurrentRole ? "Present" : exp.endDate}</span>
                      </div>
                    </div>
                    
                    {exp.description && (
                      <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>
                    )}
                    
                    {exp.achievements?.length > 0 && (
                      <ul className="space-y-1.5 mt-2">
                        {exp.achievements.map((ach, i) => (
                          <li key={i} className="text-xs text-slate-600 flex items-start gap-2 group/ach">
                            <span className="text-sm mt-0.5 transition-transform group-hover/ach:translate-x-0.5 inline-block" style={{ color: accent }}>✦</span>
                            <span className="leading-relaxed">{ach}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    {exp.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {exp.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-[9px] font-medium rounded-full transition-all duration-200 hover:scale-105"
                            style={{ backgroundColor: `${primary}10`, color: primary }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        ) : null;

      case "education":
        return education.length > 0 ? (
          <Section key="education" title="Education" icon={GraduationCap} color={primary}>
            <div className="grid gap-4">
              {education.map((edu) => (
                <div key={edu.id} 
                     className="p-4 rounded-xl transition-all duration-300 hover:shadow-md"
                     style={{ backgroundColor: `${primary}04` }}>
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-sm font-semibold" style={{ color: textColor }}>
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </h3>
                      <p className="text-xs mt-0.5" style={{ color: primary }}>{edu.institution}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Calendar className="w-2.5 h-2.5" />
                      <span>{edu.startDate} – {edu.endDate}</span>
                    </div>
                  </div>
                  {edu.gpa && (
                    <div className="mt-2">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${primary}10`, color: primary }}>
                        GPA: {edu.gpa}
                      </span>
                    </div>
                  )}
                  {edu.location && (
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400">
                      <MapPinIcon className="w-2.5 h-2.5" />
                      <span>{edu.location}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        ) : null;

      case "skills":
        return skills.length > 0 ? (
          <Section key="skills" title="Skills & Expertise" icon={Code2} color={primary}>
            <div className="grid grid-cols-2 gap-2">
              {skills.map((skill) => (
                <div key={skill.id} 
                     className="group/skill flex items-center gap-2 p-2 rounded-lg transition-all duration-300 hover:translate-x-1"
                     style={{ backgroundColor: `${primary}04` }}>
                  <div className="w-1.5 h-1.5 rounded-full transition-all duration-300 group-hover/skill:scale-150" style={{ backgroundColor: primary }} />
                  <div className="flex-1">
                    <span className="text-xs font-medium" style={{ color: textColor }}>{skill.name}</span>
                    {skill.level && skill.level !== "intermediate" && (
                      <div className="mt-1">
                        <div className="w-full h-0.5 rounded-full overflow-hidden" style={{ backgroundColor: `${primary}15` }}>
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: skill.level === "expert" ? "100%" : skill.level === "advanced" ? "75%" : "50%",
                              backgroundColor: primary 
                            }} 
                          />
                        </div>
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
          <Section key="projects" title="Featured Projects" icon={Trophy} color={primary}>
            <div className="grid gap-4">
              {projects.map((proj) => (
                <div key={proj.id} 
                     className="group/project p-4 rounded-xl transition-all duration-300 hover:shadow-lg cursor-pointer"
                     style={{ backgroundColor: `${primary}04` }}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold transition-colors duration-300 group-hover/project" style={{ color: textColor }}>
                      {proj.name}
                    </h3>
                    {proj.liveUrl && (
                      <a 
                        href={proj.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1 rounded-lg transition-all duration-300 opacity-0 group-hover/project:opacity-100 hover:scale-110"
                        style={{ backgroundColor: `${primary}10` }}
                      >
                        <ExternalLink className="w-3 h-3" style={{ color: primary }} />
                      </a>
                    )}
                  </div>
                  
                  {proj.description && (
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">{proj.description}</p>
                  )}
                  
                  {proj.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies.map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 text-[9px] font-mono rounded-full" style={{ backgroundColor: `${primary}08`, color: primary }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        ) : null;

      case "certifications":
        return certifications.length > 0 ? (
          <Section key="certifications" title="Certifications" icon={Award} color={primary}>
            <div className="grid gap-3">
              {certifications.map((cert, idx) => (
                <div key={cert.id} 
                     className="flex items-start gap-3 p-3 rounded-lg transition-all duration-300 hover:translate-x-1"
                     style={{ backgroundColor: `${primary}04` }}>
                  <div className="p-1.5 rounded-lg flex-shrink-0" style={{ backgroundColor: `${primary}15` }}>
                    <Award className="w-3.5 h-3.5" style={{ color: primary }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold" style={{ color: textColor }}>{cert.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px]" style={{ color: primary }}>{cert.issuer}</p>
                      <span className="text-[9px] text-slate-400">•</span>
                      <p className="text-[10px] text-slate-400">{cert.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        ) : null;

      case "languages":
        return languages.length > 0 ? (
          <Section key="languages" title="Languages" icon={Languages} color={primary}>
            <div className="grid grid-cols-2 gap-3">
              {languages.map((lang) => (
                <div key={lang.id} 
                     className="flex items-center justify-between p-3 rounded-lg transition-all duration-300 hover:scale-105"
                     style={{ backgroundColor: `${primary}04` }}>
                  <span className="text-xs font-medium" style={{ color: textColor }}>{lang.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${primary}15`, color: primary }}>
                    {lang.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        ) : null;

      default:
        return null;
    }
  };

  const defaultOrder = ["summary", "experience", "skills", "projects", "education", "certifications", "languages"];
  const order = sectionOrder.length > 0 ? sectionOrder : defaultOrder;

  return (
    <div className="min-h-full" style={{ backgroundColor: colorScheme.background || "#faf9f6" }}>
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0" style={{ 
          background: `linear-gradient(135deg, ${primary}08, ${secondary}04, transparent)`,
        }} />
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10" style={{ backgroundColor: primary }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-5" style={{ backgroundColor: secondary }} />
        
        {/* Header Content */}
        <div className="relative px-8 pt-12 pb-10 text-center">
          <div className="max-w-2xl mx-auto">
            {/* Profile Image with elegant frame - Removed rounded initials */}
            {personalInfo.profileImage && (
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 rounded-full blur-xl opacity-30 animate-pulse" style={{ backgroundColor: primary }} />
                <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden ring-4 transition-all duration-300 hover:scale-105" 
                     style={{ ringColor: `${primary}30`, boxShadow: `0 20px 35px -10px ${primary}40` }}>
                  <img src={personalInfo.profileImage} alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
            
            {/* Name with gradient accent - No initials circle */}
            <h1 className="text-4xl font-light tracking-tight" style={{ color: textColor }}>
              {personalInfo.firstName}{' '}
              <span className="font-semibold bg-gradient-to-r bg-clip-text text-transparent" 
                    style={{ backgroundImage: `linear-gradient(135deg, ${primary}, ${secondary})`, WebkitBackgroundClip: 'text' }}>
                {personalInfo.lastName}
              </span>
            </h1>
            
            {personalInfo.jobTitle && (
              <p className="text-sm mt-2 font-medium" style={{ color: primary }}>{personalInfo.jobTitle}</p>
            )}
            
            {/* Contact Information with elegant icons */}
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-5">
              {personalInfo.email && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 transition-colors duration-200 hover:text-slate-700">
                  <Mail className="w-3 h-3" style={{ color: primary }} />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 transition-colors duration-200 hover:text-slate-700">
                  <Phone className="w-3 h-3" style={{ color: primary }} />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 transition-colors duration-200 hover:text-slate-700">
                  <MapPin className="w-3 h-3" style={{ color: primary }} />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 transition-colors duration-200 hover:text-slate-700">
                  <Linkedin className="w-3 h-3" style={{ color: primary }} />
                  <span className="truncate max-w-[150px]">{personalInfo.linkedin}</span>
                </div>
              )}
              {personalInfo.github && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 transition-colors duration-200 hover:text-slate-700">
                  <Github className="w-3 h-3" style={{ color: primary }} />
                  <span className="truncate max-w-[150px]">{personalInfo.github}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Decorative divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="px-8 py-8 max-w-4xl mx-auto">
        {order.map((key) => renderSection(key))}
      </div>
    </div>
  );
};

export default ElegantTemplate;