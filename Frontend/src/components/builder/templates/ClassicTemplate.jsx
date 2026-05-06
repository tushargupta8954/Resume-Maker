import { format } from 'date-fns';

const ClassicTemplate = ({ resume }) => {
  return (
    <div className="p-12 font-serif bg-white" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Header Section */}
      <div className="text-center mb-8 pb-6 border-b-2 border-gray-800">
        <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-wide uppercase">
          {resume.personalInfo?.fullName || 'Your Name'}
        </h1>

        {/* Contact Information */}
        <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-700">
          {resume.personalInfo?.email && (
            <span className="flex items-center">
              <span className="mr-1">✉</span>
              {resume.personalInfo.email}
            </span>
          )}
          {resume.personalInfo?.phone && (
            <span className="flex items-center">
              <span className="mr-1">☎</span>
              {resume.personalInfo.phone}
            </span>
          )}
          {resume.personalInfo?.location && (
            <span className="flex items-center">
              <span className="mr-1">⌂</span>
              {resume.personalInfo.location}
            </span>
          )}
        </div>

        {/* Professional Links */}
        {(resume.personalInfo?.linkedIn ||
          resume.personalInfo?.github ||
          resume.personalInfo?.portfolio) && (
          <div className="flex flex-wrap justify-center gap-3 text-sm mt-2">
            {resume.personalInfo?.linkedIn && (
              <a
                href={resume.personalInfo.linkedIn}
                className="text-gray-700 hover:text-gray-900 underline"
              >
                LinkedIn
              </a>
            )}
            {resume.personalInfo?.github && (
              <a
                href={resume.personalInfo.github}
                className="text-gray-700 hover:text-gray-900 underline"
              >
                GitHub
              </a>
            )}
            {resume.personalInfo?.portfolio && (
              <a
                href={resume.personalInfo.portfolio}
                className="text-gray-700 hover:text-gray-900 underline"
              >
                Portfolio
              </a>
            )}
          </div>
        )}
      </div>

      {/* Professional Summary */}
      {resume.professionalSummary?.text && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-400 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-800 leading-relaxed text-justify">
            {resume.professionalSummary.text}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {resume.experience && resume.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-400 pb-1">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {resume.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-bold text-gray-900">{exp.jobTitle}</h3>
                  <span className="text-sm text-gray-600 italic">
                    {exp.startDate && format(new Date(exp.startDate), 'MMMM yyyy')}
                    {' - '}
                    {exp.isCurrentlyWorking
                      ? 'Present'
                      : exp.endDate
                      ? format(new Date(exp.endDate), 'MMMM yyyy')
                      : ''}
                  </span>
                </div>
                <p className="text-gray-700 italic mb-2">
                  {exp.company}
                  {exp.location && `, ${exp.location}`}
                </p>
                {exp.description && (
                  <p className="text-gray-800 mb-2 text-justify">{exp.description}</p>
                )}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-gray-800 space-y-1 ml-2">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="leading-relaxed">
                        {achievement}
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
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-400 pb-1">
            Education
          </h2>
          <div className="space-y-3">
            {resume.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-700 italic">
                      {edu.institution}
                      {edu.location && `, ${edu.location}`}
                    </p>
                    {edu.gpa && (
                      <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                    )}
                  </div>
                  <span className="text-sm text-gray-600 italic">
                    {edu.startDate && format(new Date(edu.startDate), 'yyyy')}
                    {edu.endDate && ` - ${format(new Date(edu.endDate), 'yyyy')}`}
                  </span>
                </div>
                {edu.achievements && edu.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-gray-800 text-sm mt-1 ml-2">
                    {edu.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
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
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-400 pb-1">
            Skills & Competencies
          </h2>
          {resume.skills.technical && resume.skills.technical.length > 0 && (
            <div className="mb-2">
              <span className="font-bold text-gray-900">Technical Skills: </span>
              <span className="text-gray-800">
                {resume.skills.technical.join(', ')}
              </span>
            </div>
          )}
          {resume.skills.soft && resume.skills.soft.length > 0 && (
            <div>
              <span className="font-bold text-gray-900">Professional Skills: </span>
              <span className="text-gray-800">{resume.skills.soft.join(', ')}</span>
            </div>
          )}
          {resume.skills.languages && resume.skills.languages.length > 0 && (
            <div className="mt-2">
              <span className="font-bold text-gray-900">Languages: </span>
              <span className="text-gray-800">
                {resume.skills.languages
                  .map((lang) => `${lang.name} (${lang.proficiency})`)
                  .join(', ')}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-400 pb-1">
            Projects
          </h2>
          <div className="space-y-3">
            {resume.projects.map((project, index) => (
              <div key={index}>
                <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                {project.description && (
                  <p className="text-gray-800 mb-1 text-justify">
                    {project.description}
                  </p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Technologies: </span>
                    {project.technologies.join(', ')}
                  </p>
                )}
                {(project.link || project.githubLink) && (
                  <div className="text-sm mt-1">
                    {project.link && (
                      <a
                        href={project.link}
                        className="text-gray-700 hover:text-gray-900 underline mr-3"
                      >
                        Live Demo
                      </a>
                    )}
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        className="text-gray-700 hover:text-gray-900 underline"
                      >
                        Source Code
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
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-400 pb-1">
            Certifications
          </h2>
          <div className="space-y-2">
            {resume.certifications.map((cert, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-bold text-gray-900">{cert.name}</h3>
                    <p className="text-gray-700 text-sm italic">
                      {cert.issuer}
                      {cert.credentialId && ` • ID: ${cert.credentialId}`}
                    </p>
                  </div>
                  <span className="text-sm text-gray-600 italic">
                    {cert.dateIssued &&
                      format(new Date(cert.dateIssued), 'MMMM yyyy')}
                  </span>
                </div>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    className="text-sm text-gray-700 hover:text-gray-900 underline"
                  >
                    Verify Credential
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {resume.achievements && resume.achievements.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-400 pb-1">
            Achievements & Awards
          </h2>
          <ul className="list-disc list-inside text-gray-800 space-y-1 ml-2">
            {resume.achievements.map((achievement, index) => (
              <li key={index} className="leading-relaxed">
                {achievement}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClassicTemplate;