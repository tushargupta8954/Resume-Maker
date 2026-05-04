import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCurrentResume } from '../../../redux/slices/resumeSlice';
import Button from '../../common/Button';
import Input from '../../common/Input';
import { FaPlus, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ProjectsSection = ({ resume }) => {
  const dispatch = useDispatch();
  const [expandedIndex, setExpandedIndex] = useState(0);

  const projects = resume.projects || [];

  const handleAdd = () => {
    const newProject = {
      title: '',
      description: '',
      technologies: [],
      link: '',
      githubLink: '',
      startDate: '',
      endDate: '',
      highlights: [],
    };

    dispatch(
      updateCurrentResume({
        projects: [...projects, newProject],
      })
    );
    setExpandedIndex(projects.length);
  };

  const handleRemove = (index) => {
    const updated = projects.filter((_, i) => i !== index);
    dispatch(updateCurrentResume({ projects: updated }));
  };

  const handleChange = (index, field, value) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    dispatch(updateCurrentResume({ projects: updated }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
          <p className="text-gray-600">Showcase your best work</p>
        </div>
        <Button icon={FaPlus} onClick={handleAdd}>
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No projects added yet</p>
          <Button icon={FaPlus} onClick={handleAdd}>
            Add Your First Project
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? -1 : index)
                }
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {project.title || 'Project Title'}
                  </h3>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded">
                  {expandedIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </div>

              {expandedIndex === index && (
                <div className="p-4 border-t border-gray-200 space-y-4">
                  <Input
                    label="Project Title *"
                    value={project.title}
                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                    placeholder="E-commerce Platform"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={project.description}
                      onChange={(e) =>
                        handleChange(index, 'description', e.target.value)
                      }
                      placeholder="Describe your project..."
                      rows={4}
                      className="input resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Project Link"
                      value={project.link}
                      onChange={(e) => handleChange(index, 'link', e.target.value)}
                      placeholder="https://project.com"
                    />

                    <Input
                      label="GitHub Link"
                      value={project.githubLink}
                      onChange={(e) =>
                        handleChange(index, 'githubLink', e.target.value)
                      }
                      placeholder="https://github.com/user/repo"
                    />
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-200">
                    <Button
                      variant="danger"
                      size="small"
                      icon={FaTrash}
                      onClick={() => handleRemove(index)}
                    >
                      Remove Project
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsSection;