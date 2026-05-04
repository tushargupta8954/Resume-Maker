import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCurrentResume } from '../../../redux/slices/resumeSlice';
import Button from '../../common/Button';
import Input from '../../common/Input';
import { FaPlus, FaTrash } from 'react-icons/fa';

const CertificationsSection = ({ resume }) => {
  const dispatch = useDispatch();

  const certifications = resume.certifications || [];

  const handleAdd = () => {
    const newCert = {
      name: '',
      issuer: '',
      dateIssued: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
    };

    dispatch(
      updateCurrentResume({
        certifications: [...certifications, newCert],
      })
    );
  };

  const handleRemove = (index) => {
    const updated = certifications.filter((_, i) => i !== index);
    dispatch(updateCurrentResume({ certifications: updated }));
  };

  const handleChange = (index, field, value) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    dispatch(updateCurrentResume({ certifications: updated }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Certifications</h2>
          <p className="text-gray-600">Add your professional certifications</p>
        </div>
        <Button icon={FaPlus} onClick={handleAdd}>
          Add Certification
        </Button>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No certifications added yet</p>
          <Button icon={FaPlus} onClick={handleAdd}>
            Add Certification
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {certifications.map((cert, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Certification Name *"
                  value={cert.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  placeholder="AWS Certified Solutions Architect"
                />

                <Input
                  label="Issuing Organization"
                  value={cert.issuer}
                  onChange={(e) => handleChange(index, 'issuer', e.target.value)}
                  placeholder="Amazon Web Services"
                />

                <Input
                  label="Issue Date"
                  type="month"
                  value={cert.dateIssued?.substring(0, 7) || ''}
                  onChange={(e) => handleChange(index, 'dateIssued', e.target.value)}
                />

                <Input
                  label="Expiry Date (Optional)"
                  type="month"
                  value={cert.expiryDate?.substring(0, 7) || ''}
                  onChange={(e) => handleChange(index, 'expiryDate', e.target.value)}
                />

                <Input
                  label="Credential ID"
                  value={cert.credentialId}
                  onChange={(e) =>
                    handleChange(index, 'credentialId', e.target.value)
                  }
                  placeholder="ABC123XYZ"
                />

                <Input
                  label="Credential URL"
                  value={cert.credentialUrl}
                  onChange={(e) =>
                    handleChange(index, 'credentialUrl', e.target.value)
                  }
                  placeholder="https://credentials.com/verify/..."
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <Button
                  variant="danger"
                  size="small"
                  icon={FaTrash}
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificationsSection;