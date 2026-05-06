import { format } from 'date-fns';

const MinimalTemplate = ({ resume }) => {
  const accentColor = resume.styling?.colorScheme?.primary || '#000000';

  return (
    <div className="p-12 font-sans bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1
              className="text-5xl font-light mb-2 tracking-tight"
              style={{ color: accentColor }}
            >
              {resume.personalInfo?.fullName || 'Your Name'}
            </h1>
            <div className="h-1 w-20 bg-current mb-4" style={{ backgroundColor: accentColor }}></div>

            {/* Contact Info - Minimalist Style */}
            <div className="space-y-1 text-sm text-gray-600">
              {resume.personalInfo?.email && (
                <div>{resume.personalInfo.email}</div>
              )}
              {resume.personalInfo?.phone && (
                <div>{resume.personalInfo.phone}</div>
              )}
              {resume.personalInfo?.location && (
                <div>{resume.personalInfo.location}</div>
              )}
            </div>

            {/* Links */}
            {(resume.personalInfo?.linkedIn ||
              resume.personalInfo?.github ||
              resume.personalInfo?.portfolio) && (
              <div className="flex gap-4 text-sm mt-3">
                {resume.personalInfo?.linkedIn && (
                  <a
                    href={resume.personalInfo.linkedIn}
                    className="text-gray-600 hover:text-gray-900"
                    style={{ color: accentColor }}
                  >
                    LinkedIn
                  </a>
                )}
                {resume.personalInfo?.github && (
                  <a
                    href={resume.personalInfo.github}
                    className="text-gray-600 hover:text-gray-900"
                    style={{ color: accentColor }}
                  >
                    GitHub
                  </a>
                )}
                {resume.personalInfo?.portfolio && (
                  <a
                    href={resume.personalInfo.portfolio}
                    className="text-gray-600 hover:text-gray-900"
                    style={{ color: accentColor }}
                  >
                    Portfolio
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Profile Image */}
          {resume.personalInfo?.profileImage?.url && (
            <div className="ml-6">
              <img
                src={resume.personalInfo.profileImage.url}
                alt={resume.personalInfo.fullName}
                className="w-28 h-28 rounded-full object-cover border-2"
                style={{ borderColor: accentColor }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {resume.professionalSummary?.text && (
        <div className="mb-8">
          <h2
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: accentColor }}
          >
            Profile
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {resume.professionalSummary.text}
          </p>
        </div>
      )}

      {/* Experience */}
      {resume.experience && resume.experience.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: accentColor }}
          >
            Experience
          </h2>
          <div className="space-y-6">
            {resume.experience.map((exp, index) => (
              <div key={index} className="relative pl-6 border-l-2 border-gray-200">
                <div className="absolute w-3 h-3 rounded-full -left-[7px] top-1" style={{ backgroundColor: accentColor }}></div>
                
                <div className="mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {exp.jobTitle}
                  </h3>
                  <div className="flex justify-between items-baseline text-sm">
                    <p className="text-gray-600">{exp.company}</p>
                    <span className="text-gray-500 text-xs">
                      {exp.startDate && format(new Date(exp.startDate), 'MMM yyyy')}
                      {' - '}
                      {exp.isCurrentlyWorking
                        ? 'Present'
                        : exp.endDate
                        ? format(new Date(exp.endDate), 'MMM yyyy')
                        : ''}
                    </span>
                  </div>
                </div>

                {exp.description && (
                  <p className="text-gray-700 text-sm mb-2">{exp.description}</p>
                )}

                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="space-y-1 text-sm text-gray-700">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2 mt-1.5" style={{ color: accentColor }}>•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: accentColor }}
          >
            Education
          </h2>
          <div className="space-y-4">
            {resume.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                    {edu.gpa && (
                      <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {edu.endDate && format(new Date(edu.endDate), 'yyyy')}
                  </span>
                </div>
                {edu.achievements && edu.achievements.length > 0 && (
                  <ul className="text-xs text-gray-600 mt-1 space-y-0.5">
                    {edu.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2" style={{ color: accentColor }}>•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {((resume.skills?.technical && resume.skills.technical.length > 0) ||
        (resume.skills?.soft && resume.skills.soft.length > 0)) && (
        <div className="mb-8">
          <h2
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: accentColor }}
          >
            Skills
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {resume.skills.technical && resume.skills.technical.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  Technical
                </h4>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.technical.map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs px-3 py-1 rounded-full border"
                      style={{ 
                        borderColor: accentColor,
                        color: accentColor 
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {resume.skills.soft && resume.skills.soft.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  Professional
                </h4>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.soft.map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs px-3 py-1 rounded-full"
                      style={{ 
                        backgroundColor: `${accentColor}15`,
                        color: accentColor 
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: accentColor }}
          >
            Projects
          </h2>
          <div className="space-y-4">
            {resume.projects.map((project, index) => (
              <div key={index}>
                <h3 className="font-semibold text-gray-900">{project.title}</h3>
                {project.description && (
                  <p className="text-sm text-gray-700 mb-1">{project.description}</p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <p className="text-xs text-gray-500">
                    {project.technologies.join(' • ')}
                  </p>
                )}
                {(project.link || project.githubLink) && (
                  <div className="flex gap-3 text-xs mt-1">
                    {project.link && (
                      <a
                        href={project.link}
                        className="hover:underline"
                        style={{ color: accentColor }}
                      >
                        Demo
                      </a>
                    )}
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        className="hover:underline"
                        style={{ color: accentColor }}
                      >
                        Code
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {resume.certifications && resume.certifications.length > 0 && (
        <div>
          <h2
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: accentColor }}
          >
            Certifications
          </h2>
          <div className="space-y-2">
            {resume.certifications.map((cert, index) => (
              <div key={index} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {cert.name}
                  </h3>
                  <p className="text-xs text-gray-600">{cert.issuer}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {cert.dateIssued &&
                    format(new Date(cert.dateIssued), 'MMM yyyy')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MinimalTemplate;