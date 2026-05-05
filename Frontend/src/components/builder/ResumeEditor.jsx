import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCurrentResume } from '../../redux/slices/resumeSlice';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  FaUser,
  FaBriefcase,
  FaGraduationCap,
  FaCode,
  FaProjectDiagram,
  FaCertificate,
  FaPlus,
} from 'react-icons/fa';
import PersonalInfoSection from './sections/PersonalInfoSection';
import ProfessionalSummarySection from './sections/ProfessionalSummarySection';
import ExperienceSection from './sections/ExperienceSection';
import EducationSection from './sections/EducationSection';
import SkillsSection from './sections/SkillsSection';
import ProjectsSection from './sections/ProjectsSection';
import CertificationsSection from './sections/CertificationsSection';

const ResumeEditor = ({ resume }) => {
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState('personalInfo');

  const sections = [
    { id: 'personalInfo', name: 'Personal Info', icon: FaUser },
    { id: 'professionalSummary', name: 'Summary', icon: FaBriefcase },
    { id: 'experience', name: 'Experience', icon: FaBriefcase },
    { id: 'education', name: 'Education', icon: FaGraduationCap },
    { id: 'skills', name: 'Skills', icon: FaCode },
    { id: 'projects', name: 'Projects', icon: FaProjectDiagram },
    { id: 'certifications', name: 'Certifications', icon: FaCertificate },
  ];

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(resume.sectionOrder || sections.map((s) => s.id));
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    dispatch(updateCurrentResume({ sectionOrder: items }));
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'personalInfo':
        return <PersonalInfoSection resume={resume} />;
      case 'professionalSummary':
        return <ProfessionalSummarySection resume={resume} />;
      case 'experience':
        return <ExperienceSection resume={resume} />;
      case 'education':
        return <EducationSection resume={resume} />;
      case 'skills':
        return <SkillsSection resume={resume} />;
      case 'projects':
        return <ProjectsSection resume={resume} />;
      case 'certifications':
        return <CertificationsSection resume={resume} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-2">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                  ${
                    activeSection === section.id
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                <Icon />
                {section.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Section Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {renderSection()}
      </div>

      {/* Section Reordering */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Section Order</h3>
        <p className="text-sm text-gray-600 mb-4">
          Drag and drop to reorder sections on your resume
        </p>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {(resume.sectionOrder || sections.map((s) => s.id)).map(
                  (sectionId, index) => {
                    const section = sections.find((s) => s.id === sectionId);
                    if (!section) return null;

                    const Icon = section.icon;

                    return (
                      <Draggable
                        key={sectionId}
                        draggableId={sectionId}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`
                              flex items-center gap-3 p-3 rounded-lg border-2
                              ${
                                snapshot.isDragging
                                  ? 'border-primary-500 bg-primary-50'
                                  : 'border-gray-200 bg-white'
                              }
                            `}
                          >
                            <div className="text-gray-400">☰</div>
                            <Icon className="text-gray-600" />
                            <span className="font-medium text-gray-900">
                              {section.name}
                            </span>
                          </div>
                        )}
                      </Draggable>
                    );
                  }
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default ResumeEditor;