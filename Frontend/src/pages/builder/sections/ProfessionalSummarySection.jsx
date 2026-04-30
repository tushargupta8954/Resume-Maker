import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCurrentResume } from '../../../redux/slices/resumeSlice';
import { generateSummary } from '../../../redux/slices/aiSlice';
import Button from '../../common/Button';
import { FaMagic, FaMicrophone } from 'react-icons/fa';
import toast from 'react-hot-toast';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const ProfessionalSummarySection = ({ resume }) => {
  const dispatch = useDispatch();
  const [generating, setGenerating] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [showAIDialog, setShowAIDialog] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleChange = (value) => {
    dispatch(
      updateCurrentResume({
        professionalSummary: {
          text: value,
          aiGenerated: false,
          lastUpdated: new Date(),
        },
      })
    );
  };

  const handleGenerateSummary = async () => {
    if (!jobTitle.trim()) {
      toast.error('Please enter your job title');
      return;
    }

    setGenerating(true);
    try {
      const result = await dispatch(
        generateSummary({
          jobTitle,
          experience: resume.experience?.length || 0,
          skills: [
            ...(resume.skills?.technical || []),
            ...(resume.skills?.soft || []),
          ],
          tone: 'professional',
        })
      ).unwrap();

      dispatch(
        updateCurrentResume({
          professionalSummary: {
            text: result.summary,
            aiGenerated: true,
            lastUpdated: new Date(),
          },
        })
      );

      toast.success('Summary generated successfully!');
      setShowAIDialog(false);
    } catch (error) {
      toast.error('Failed to generate summary');
    } finally {
      setGenerating(false);
    }
  };

  const handleVoiceInput = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      handleChange(transcript);
      resetTranscript();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Professional Summary
        </h2>
        <p className="text-gray-600">
          Write a compelling summary that highlights your key strengths
        </p>
      </div>

      {/* AI Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="small"
          icon={FaMagic}
          onClick={() => setShowAIDialog(!showAIDialog)}
        >
          Generate with AI
        </Button>

        {browserSupportsSpeechRecognition && (
          <Button
            variant="outline"
            size="small"
            icon={FaMicrophone}
            onClick={handleVoiceInput}
            className={listening ? 'bg-red-50 border-red-500 text-red-600' : ''}
          >
            {listening ? 'Stop Recording' : 'Voice Input'}
          </Button>
        )}
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
              placeholder="e.g., Senior Software Engineer"
              className="input mt-1"
            />
          </label>
          <Button
            icon={FaMagic}
            onClick={handleGenerateSummary}
            isLoading={generating}
            fullWidth
          >
            Generate Summary
          </Button>
        </div>
      )}

      {/* Textarea */}
      <div>
        <textarea
          value={
            listening
              ? transcript
              : resume.professionalSummary?.text || ''
          }
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Write a brief summary about yourself, your experience, and your career goals..."
          rows={8}
          className="input resize-none"
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm text-gray-500">
            {resume.professionalSummary?.text?.length || 0} characters
            {resume.professionalSummary?.aiGenerated && (
              <span className="ml-2 text-primary-600">✨ AI Generated</span>
            )}
          </p>
          {listening && (
            <span className="text-sm text-red-600 animate-pulse">
              🎤 Listening...
            </span>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Keep it concise (3-4 sentences)</li>
          <li>Highlight your unique value proposition</li>
          <li>Use action words and quantify achievements</li>
          <li>Tailor it to your target role</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfessionalSummarySection;