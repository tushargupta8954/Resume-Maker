import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Award, ExternalLink } from "lucide-react";
import {
  addCertification, removeCertification, updateCertification,
  selectActiveResumeData,
} from "../../../features/resume/resumeSlice.js";
import { createEmptyCertification } from "../../../utils/helpers.js";
import Button from "../../common/Button.jsx";
import Input from "../../common/Input.jsx";

const CertificationsSection = () => {
  const dispatch = useDispatch();
  const resumeData = useSelector(selectActiveResumeData);
  const certifications = resumeData?.certifications || [];

  const handleChange = (id, field) => (e) =>
    dispatch(updateCertification({ id, data: { [field]: e.target.value } }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-800">Certifications</h3>
          <p className="text-sm text-slate-500 mt-0.5">Professional certificates and licenses</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => dispatch(addCertification(createEmptyCertification()))}
        >
          Add Cert
        </Button>
      </div>

      {certifications.length === 0 ? (
        <div
          onClick={() => dispatch(addCertification(createEmptyCertification()))}
          className="border-2 border-dashed border-slate-200 hover:border-amber-300 rounded-2xl p-8 text-center cursor-pointer transition-colors group"
        >
          <Award className="w-10 h-10 text-slate-300 group-hover:text-amber-400 mx-auto mb-3 transition-colors" />
          <p className="font-medium text-slate-600 group-hover:text-amber-600 transition-colors">
            Add a Certification
          </p>
          <p className="text-xs text-slate-400 mt-1">AWS, Google, Microsoft, Coursera...</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {certifications.map((cert) => (
              <motion.div
                key={cert.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-white rounded-2xl border-2 border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
                      <Award className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">
                      {cert.name || "Certificate Name"}
                    </span>
                  </div>
                  <button
                    onClick={() => dispatch(removeCertification(cert.id))}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Certificate Name"
                    placeholder="AWS Solutions Architect"
                    value={cert.name || ""}
                    onChange={handleChange(cert.id, "name")}
                    required
                  />
                  <Input
                    label="Issuing Organization"
                    placeholder="Amazon Web Services"
                    value={cert.issuer || ""}
                    onChange={handleChange(cert.id, "issuer")}
                  />
                  <Input
                    label="Issue Date"
                    type="month"
                    value={cert.date || ""}
                    onChange={handleChange(cert.id, "date")}
                  />
                  <Input
                    label="Expiry Date (optional)"
                    type="month"
                    value={cert.expiryDate || ""}
                    onChange={handleChange(cert.id, "expiryDate")}
                  />
                  <Input
                    label="Credential ID"
                    placeholder="ABC123XYZ"
                    value={cert.credentialId || ""}
                    onChange={handleChange(cert.id, "credentialId")}
                  />
                  <Input
                    label="Certificate URL"
                    placeholder="https://verify.example.com/cert"
                    value={cert.url || ""}
                    onChange={handleChange(cert.id, "url")}
                    icon={ExternalLink}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default CertificationsSection;