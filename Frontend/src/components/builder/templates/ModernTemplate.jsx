import { format } from 'date-fns';

const ModernTemplate = ({ resume }) => {
  const primaryColor = resume.styling?.colorScheme?.primary || '#2563eb';

  return (
    <div className="p-12 font-sans">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-6">
          {resume.personalInfo?.profileImage?.url && (
            <img
              src={resume.personalInfo.profileImage.url}
              alt={resume.personalInfo.fullName}
              className="w-24 h-24 rounded-full object-cover"
            />
          )}
          <div className="flex-1">
            <h1
              className="text-4xl font-bold mb-2"
              style={{ color: primaryColor }}
            >
              {resume.personalInfo?.fullName}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {resume.personalInfo?.email && (
                <span>📧 {resume.personalInfo.email}</span>
              )}
              {resume.personalInfo?.phone && (
                <span>📱 {resume.personalInfo.phone}</span>
              )}
              {resume.personalInfo?.location && (
                <span>📍 {resume.personalInfo.location}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-4 text-sm mt-2">
              {resume.personalInfo?.linkedIn && (
                <a
                  href={resume.personalInfo.linkedIn}
                  className="text-blue-600 hover:underline"
                >
                  LinkedIn
                </a>
              )}
              {resume.personalInfo?.github && (
                <a
                  href={resume.personalInfo.github}
                  className="text-blue-600 hover:underline"
                >
                  GitHub
                </a>
              )}
              {resume.personalInfo?.portfolio && (
                <a
                  href={resume.personalInfo.portfolio}
                  className="text-blue-600 hover:underline"
                >
                  Portfolio
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      {resume.professionalSummary?.text && (
        <div className="mb-6">
          <h2
            className="text-xl font-bold mb-3 pb-2 border-b-2"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {resume.professionalSummary.text}
          </p>
        </div>
      )}

      {/* Experience */}
      {resume.experience && resume.experience.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-xl font-bold mb-3 pb-2 border-b-2"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            WORK EXPERIENCE
          </h2>
          <div className="space-y-4">
            {resume.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                    <p className="text-gray-700">
                      {exp.company}
                      {exp.location && ` • ${exp.location}`}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600">
                    {exp.startDate &&
                      format(new Date(exp.startDate), 'MMM yyyy')}
                    {' - '}
                    {exp.isCurrentlyWorking
                      ? 'Present'
                      : exp.endDate
                      ? format(new Date(exp.endDate), 'MMM yyyy')
                      : ''}
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-700 mb-2">{exp.description}</p>
                )}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
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
        <div className="mb-6">
          <h2
            className="text-xl font-bold mb-3 pb-2 border-b-2"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            EDUCATION
          </h2>
          <div className="space-y-3">
            {resume.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-700">{edu.institution}</p>
                    {edu.gpa && (
                      <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {edu.endDate && format(new Date(edu.endDate), 'yyyy')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {((resume.skills?.technical && resume.skills.technical.length > 0) ||
        (resume.skills?.soft && resume.skills.soft.length > 0)) && (
        <div className="mb-6">
          <h2
            className="text-xl font-bold mb-3 pb-2 border-b-2"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            SKILLS
          </h2>
          {resume.skills.technical && resume.skills.technical.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold">Technical: </span>
              <span className="text-gray-700">
                {resume.skills.technical.join(' • ')}
              </span>
            </div>
          )}
          {resume.skills.soft && resume.skills.soft.length > 0 && (
            <div>
              <span className="font-semibold">Soft Skills: </span>
              <span className="text-gray-700">
                {resume.skills.soft.join(' • ')}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-xl font-bold mb-3 pb-2 border-b-2"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            PROJECTS
          </h2>
          <div className="space-y-3">
            {resume.projects.map((project, index) => (
              <div key={index}>
                <h3 className="font-bold text-gray-900">{project.title}</h3>
                {project.description && (
                  <p className="text-gray-700">{project.description}</p>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    {project.link}
                  </a>
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
            className="text-xl font-bold mb-3 pb-2 border-b-2"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            CERTIFICATIONS
          </h2>
          <div className="space-y-2">
            {resume.certifications.map((cert, index) => (
              <div key={index}>
                <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                <p className="text-sm text-gray-700">
                  {cert.issuer}
                  {cert.dateIssued &&
                    ` • ${format(new Date(cert.dateIssued), 'MMM yyyy')}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernTemplate;