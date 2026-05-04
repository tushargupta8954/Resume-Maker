import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { updateCurrentResume } from '../../../redux/slices/resumeSlice';
import Input from '../../common/Input';
import Button from '../../common/Button';
import { FaCamera, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const PersonalInfoSection = ({ resume }) => {
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);

  const handleChange = (field, value) => {
    dispatch(
      updateCurrentResume({
        personalInfo: {
          ...resume.personalInfo,
          [field]: value,
        },
      })
    );
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload/resume-image/${resume._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      dispatch(
        updateCurrentResume({
          personalInfo: {
            ...resume.personalInfo,
            profileImage: response.data.data,
          },
        })
      );

      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    dispatch(
      updateCurrentResume({
        personalInfo: {
          ...resume.personalInfo,
          profileImage: null,
        },
      })
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600">Add your contact details and professional links</p>
      </div>

      {/* Profile Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Image
        </label>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {resume.personalInfo?.profileImage?.url ? (
              <img
                src={resume.personalInfo.profileImage.url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaCamera className="text-3xl text-gray-400" />
            )}
          </div>
          <div className="flex gap-2">
            <label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
              <Button
                as="span"
                variant="outline"
                size="small"
                isLoading={uploading}
              >
                Upload Photo
              </Button>
            </label>
            {resume.personalInfo?.profileImage?.url && (
              <Button
                variant="danger"
                size="small"
                icon={FaTrash}
                onClick={handleRemoveImage}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Recommended: Square image, max 5MB. Background will be automatically removed.
        </p>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Full Name *"
          value={resume.personalInfo?.fullName || ''}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder="John Doe"
        />

        <Input
          label="Email *"
          type="email"
          value={resume.personalInfo?.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="john@example.com"
        />

        <Input
          label="Phone"
          type="tel"
          value={resume.personalInfo?.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+1 (555) 123-4567"
        />

        <Input
          label="Location"
          value={resume.personalInfo?.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="New York, NY"
        />

        <Input
          label="LinkedIn"
          value={resume.personalInfo?.linkedIn || ''}
          onChange={(e) => handleChange('linkedIn', e.target.value)}
          placeholder="linkedin.com/in/johndoe"
        />

        <Input
          label="GitHub"
          value={resume.personalInfo?.github || ''}
          onChange={(e) => handleChange('github', e.target.value)}
          placeholder="github.com/johndoe"
        />

        <Input
          label="Portfolio"
          value={resume.personalInfo?.portfolio || ''}
          onChange={(e) => handleChange('portfolio', e.target.value)}
          placeholder="johndoe.com"
        />

        <Input
          label="Website"
          value={resume.personalInfo?.website || ''}
          onChange={(e) => handleChange('website', e.target.value)}
          placeholder="www.johndoe.com"
        />
      </div>
    </div>
  );
};

export default PersonalInfoSection;