import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCurrentResume } from '../../../redux/slices/resumeSlice';
import { suggestSkills } from '../../../redux/slices/aiSlice';
import Button from '../../common/Button';
import Input from '../../common/Input';
import { FaPlus, FaTimes, FaMagic } from 'react-icons/fa';
import toast from 'react-hot-toast';

const SkillsSection = ({ resume }) => {
  const dispatch = useDispatch();
  const [technicalInput, setTechnicalInput] = useState('');
  const [softInput, setSoftInput] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [generating, setGenerating] = useState(false);

  const skills = resume.skills || { technical: [], soft: [], languages: [] };

  const handleAddSkill = (type, value) => {
    if (!value.trim()) return;

    const updated = { ...skills };
    if (!updated[type].includes(value.trim())) {
      updated[type] = [...updated[type], value.trim()];
      dispatch(updateCurrentResume({ skills: updated }));
    }

    if (type === 'technical') setTechnicalInput('');
    if (type === 'soft') setSoftInput('');
  };

  const handleRemoveSkill = (type, index) => {
    const updated = { ...skills };
    updated[type] = updated[type].filter((_, i) => i !== index);
    dispatch(updateCurrentResume({ skills: updated }));
  };

  const handleKeyPress = (e, type, value) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill(type, value);
    }
  };

  const handleGenerateSkills = async () => {
    if (!jobTitle.trim()) {
      toast.error('Please enter a job title');
      return;
    }

    setGenerating(true);
    try {
      const result = await dispatch(
        suggestSkills({
          jobTitle,
          industry: 'tech',
          experienceLevel: 'mid',
        })
      ).unwrap();

      dispatch(
        updateCurrentResume({
          skills: {
            technical: result.technical || [],
            soft: result.soft || [],
            languages: skills.languages || [],
            aiSuggested: [...result.technical, ...result.soft],
          },
        })
      );

      toast.success('Skills generated successfully!');
      setShowAIDialog(false);
    } catch (error) {
      toast.error('Failed to generate skills');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
          <p className="text-gray-600">Add your professional skills</p>
        </div>
        <Button
          variant="outline"
          icon={FaMagic}
          onClick={() => setShowAIDialog(!showAIDialog)}
        >
          Generate with AI
        </Button>
      </div>

      {/* AI Dialog */}
      {showAIDialog && (
        <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg space-y-3">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">
              What's your target job title?
            </span>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Full Stack Developer"
              className="input mt-1"
            />
          </label>
          <Button
            icon={FaMagic}
            onClick={handleGenerateSkills}
            isLoading={generating}
            fullWidth
          >
            Generate Skills
          </Button>
        </div>
      )}

      {/* Technical Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Technical Skills
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={technicalInput}
            onChange={(e) => setTechnicalInput(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, 'technical', technicalInput)}
            placeholder="Type a skill and press Enter"
            className="input flex-1"
          />
          <Button
            icon={FaPlus}
            onClick={() => handleAddSkill('technical', technicalInput)}
          >
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.technical.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg"
            >
              {skill}
              <button
                onClick={() => handleRemoveSkill('technical', index)}
                className="hover:text-primary-900"
              >
                <FaTimes />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Soft Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Soft Skills
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={softInput}
            onChange={(e) => setSoftInput(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, 'soft', softInput)}
            placeholder="Type a skill and press Enter"
            className="input flex-1"
          />
          <Button icon={FaPlus} onClick={() => handleAddSkill('soft', softInput)}>
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.soft.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg"
            >
              {skill}
              <button
                onClick={() => handleRemoveSkill('soft', index)}
                className="hover:text-green-900"
              >
                <FaTimes />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Popular Skills */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">💡 Popular Skills</h4>
        <div className="flex flex-wrap gap-2">
          {[
            'JavaScript',
            'React',
            'Node.js',
            'Python',
            'AWS',
            'Docker',
            'Git',
            'Agile',
            'Communication',
            'Leadership',
            'Problem Solving',
            'Teamwork',
          ].map((skill) => (
            <button
              key={skill}
              onClick={() => {
                const type = [
                  'Communication',
                  'Leadership',
                  'Problem Solving',
                  'Teamwork',
                ].includes(skill)
                  ? 'soft'
                  : 'technical';
                handleAddSkill(type, skill);
              }}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-sm"
            >
              + {skill}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;