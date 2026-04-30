import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCurrentResume } from '../../../redux/slices/resumeSlice';
import { enhanceExperience } from '../../../redux/slices/aiSlice';
import Button from '../../common/Button';
import Input from '../../common/Input';
import { FaPlus, FaTrash, FaMagic, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ExperienceSection = ({ resume }) => {
  const dispatch = useDispatch();
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [enhancing, setEnhancing] = useState(null);

  const experiences = resume.experience || [];

  const handleAdd = () => {
    const newExperience = {
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrentlyWorking: false,
      description: '',
      achievements: [],
      aiEnhanced: false,
    };

    dispatch(
      updateCurrentResume({
        experience: [...experiences, newExperience],
      })
    );
    setExpandedIndex(experiences.length);
  };

  const handleRemove = (index) => {
    const updated = experiences.filter((_, i) => i !== index);
    dispatch(updateCurrentResume({ experience: updated }));
    if (expandedIndex >= updated.length) {
      setExpandedIndex(Math.max(0, updated.length - 1));
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    dispatch(updateCurrentResume({ experience: updated }));
  };

  const handleAddAchievement = (index) => {
    const updated = [...experiences];
    updated[index].achievements = [...(updated[index].achievements || []), ''];
    dispatch(updateCurrentResume({ experience: updated }));
  };

  const handleAchievementChange = (expIndex, achIndex, value) => {
    const updated = [...experiences];
    updated[expIndex].achievements[achIndex] = value;
    dispatch(updateCurrentResume({ experience: updated }));
  };

  const handleRemoveAchievement = (expIndex, achIndex) => {
    const updated = [...experiences];
    updated[expIndex].achievements = updated[expIndex].achievements.filter(
      (_, i) => i !== achIndex
    );
    dispatch(updateCurrentResume({ experience: updated }));
  };

  const handleEnhance = async (index) => {
    const exp = experiences[index];
    if (!exp.jobTitle || !exp.description) {
      toast.error('Please fill in job title and description first');
      return;
    }

    setEnhancing(index);
    try {
      const result = await dispatch(
        enhanceExperience({
          jobTitle: exp.jobTitle,
          company: exp.company,
          description: exp.description,
          achievements: exp.achievements,
        })
      ).unwrap();

      const updated = [...experiences];
      updated[index].achievements = result.enhanced;
      updated[index].aiEnhanced = true;

      dispatch(updateCurrentResume({ experience: updated }));
      toast.success('Experience enhanced with AI!');
    } catch (error) {
      toast.error('Failed to enhance experience');
    } finally {
      setEnhancing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
          <p className="text-gray-600">Add your professional experience</p>
        </div>
        <Button icon={FaPlus} onClick={handleAdd}>
          Add Experience
        </Button>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No experience added yet</p>
          <Button icon={FaPlus} onClick={handleAdd}>
            Add Your First Experience
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              {/* Header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? -1 : index)
                }
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {exp.jobTitle || 'Untitled Position'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {exp.company || 'Company Name'}
                    {exp.location && ` • ${exp.location}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {exp.aiEnhanced && (
                    <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded">
                      ✨ AI Enhanced
                    </span>
                  )}
                  <button className="p-2 hover:bg-gray-100 rounded">
                    {expandedIndex === index ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </button>
                </div>
              </div>

              {/* Content */}
              {expandedIndex === index && (
                <div className="p-4 border-t border-gray-200 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Job Title *"
                      value={exp.jobTitle}
                      onChange={(e) =>
                        handleChange(index, 'jobTitle', e.target.value)
                      }
                      placeholder="Senior Software Engineer"
                    />

                    <Input
                      label="Company *"
                      value={exp.company}
                      onChange={(e) =>
                        handleChange(index, 'company', e.target.value)
                      }
                      placeholder="Google"
                    />

                    <Input
                      label="Location"
                      value={exp.location}
                      onChange={(e) =>
                        handleChange(index, 'location', e.target.value)
                      }
                      placeholder="San Francisco, CA"
                    />

                    <Input
                      label="Start Date"
                      type="month"
                      value={exp.startDate?.substring(0, 7) || ''}
                      onChange={(e) =>
                        handleChange(index, 'startDate', e.target.value)
                      }
                    />

                    <div className="col-span-2 flex items-center gap-4">
                      <Input
                        label="End Date"
                        type="month"
                        value={exp.endDate?.substring(0, 7) || ''}
                        onChange={(e) =>
                          handleChange(index, 'endDate', e.target.value)
                        }
                        disabled={exp.isCurrentlyWorking}
                      />

                      <label className="flex items-center gap-2 mt-6">
                        <input
                          type="checkbox"
                          checked={exp.isCurrentlyWorking}
                          onChange={(e) =>
                            handleChange(
                              index,
                              'isCurrentlyWorking',
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 text-primary-600 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          Currently working here
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={exp.description}
                      onChange={(e) =>
                        handleChange(index, 'description', e.target.value)
                      }
                      placeholder="Describe your role and responsibilities..."
                      rows={4}
                      className="input resize-none"
                    />
                  </div>

                  {/* Achievements */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Key Achievements
                      </label>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="small"
                          icon={FaMagic}
                          onClick={() => handleEnhance(index)}
                          isLoading={enhancing === index}
                        >
                          Enhance with AI
                        </Button>
                        <Button
                          variant="outline"
                          size="small"
                          icon={FaPlus}
                          onClick={() => handleAddAchievement(index)}
                        >
                          Add
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {(exp.achievements || []).map((achievement, achIndex) => (
                        <div key={achIndex} className="flex gap-2">
                          <input
                            type="text"
                            value={achievement}
                            onChange={(e) =>
                              handleAchievementChange(
                                index,
                                achIndex,
                                e.target.value
                              )
                            }
                            placeholder="e.g., Increased sales by 50%"
                            className="input flex-1"
                          />
                          <Button
                            variant="danger"
                            size="small"
                            icon={FaTrash}
                            onClick={() =>
                              handleRemoveAchievement(index, achIndex)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-200">
                    <Button
                      variant="danger"
                      size="small"
                      icon={FaTrash}
                      onClick={() => handleRemove(index)}
                    >
                      Remove Experience
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

export default ExperienceSection;