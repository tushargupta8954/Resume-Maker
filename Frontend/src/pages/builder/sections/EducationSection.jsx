import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCurrentResume } from '../../../redux/slices/resumeSlice';
import Button from '../../common/Button';
import Input from '../../common/Input';
import { FaPlus, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const EducationSection = ({ resume }) => {
  const dispatch = useDispatch();
  const [expandedIndex, setExpandedIndex] = useState(0);

  const education = resume.education || [];

  const handleAdd = () => {
    const newEducation = {
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      achievements: [],
    };

    dispatch(
      updateCurrentResume({
        education: [...education, newEducation],
      })
    );
    setExpandedIndex(education.length);
  };

  const handleRemove = (index) => {
    const updated = education.filter((_, i) => i !== index);
    dispatch(updateCurrentResume({ education: updated }));
  };

  const handleChange = (index, field, value) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    dispatch(updateCurrentResume({ education: updated }));
  };

  const handleAddAchievement = (index) => {
    const updated = [...education];
    updated[index].achievements = [...(updated[index].achievements || []), ''];
    dispatch(updateCurrentResume({ education: updated }));
  };

  const handleAchievementChange = (eduIndex, achIndex, value) => {
    const updated = [...education];
    updated[eduIndex].achievements[achIndex] = value;
    dispatch(updateCurrentResume({ education: updated }));
  };

  const handleRemoveAchievement = (eduIndex, achIndex) => {
    const updated = [...education];
    updated[eduIndex].achievements = updated[eduIndex].achievements.filter(
      (_, i) => i !== achIndex
    );
    dispatch(updateCurrentResume({ education: updated }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Education</h2>
          <p className="text-gray-600">Add your educational background</p>
        </div>
        <Button icon={FaPlus} onClick={handleAdd}>
          Add Education
        </Button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No education added yet</p>
          <Button icon={FaPlus} onClick={handleAdd}>
            Add Your Education
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((edu, index) => (
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
                    {edu.degree || 'Degree'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {edu.institution || 'Institution'}
                  </p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded">
                  {expandedIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </div>

              {/* Content */}
              {expandedIndex === index && (
                <div className="p-4 border-t border-gray-200 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Degree *"
                      value={edu.degree}
                      onChange={(e) => handleChange(index, 'degree', e.target.value)}
                      placeholder="Bachelor of Science in Computer Science"
                    />

                    <Input
                      label="Institution *"
                      value={edu.institution}
                      onChange={(e) =>
                        handleChange(index, 'institution', e.target.value)
                      }
                      placeholder="Stanford University"
                    />

                    <Input
                      label="Location"
                      value={edu.location}
                      onChange={(e) => handleChange(index, 'location', e.target.value)}
                      placeholder="Stanford, CA"
                    />

                    <Input
                      label="GPA (Optional)"
                      value={edu.gpa}
                      onChange={(e) => handleChange(index, 'gpa', e.target.value)}
                      placeholder="3.8/4.0"
                    />

                    <Input
                      label="Start Date"
                      type="month"
                      value={edu.startDate?.substring(0, 7) || ''}
                      onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                    />

                    <Input
                      label="End Date"
                      type="month"
                      value={edu.endDate?.substring(0, 7) || ''}
                      onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                    />
                  </div>

                  {/* Achievements */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Achievements (Optional)
                      </label>
                      <Button
                        variant="outline"
                        size="small"
                        icon={FaPlus}
                        onClick={() => handleAddAchievement(index)}
                      >
                        Add
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {(edu.achievements || []).map((achievement, achIndex) => (
                        <div key={achIndex} className="flex gap-2">
                          <input
                            type="text"
                            value={achievement}
                            onChange={(e) =>
                              handleAchievementChange(index, achIndex, e.target.value)
                            }
                            placeholder="e.g., Dean's List, Cum Laude"
                            className="input flex-1"
                          />
                          <Button
                            variant="danger"
                            size="small"
                            icon={FaTrash}
                            onClick={() => handleRemoveAchievement(index, achIndex)}
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
                      Remove Education
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

export default EducationSection;