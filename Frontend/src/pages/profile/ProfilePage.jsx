import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, Upload, Trash2, User, Mail, Lock,
  Bell, Palette, Globe, Shield, Save,
  CheckCircle, AlertCircle, Sparkles, Eye, EyeOff,
} from "lucide-react";
import { useDropzone } from "react-dropzone";

import { selectUser, updateUserProfile, changeUserPassword, updateUserImage } from "../../features/auth/authSlice.js";
import { imageService } from "../../services/imageService.js";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import Card from "../../components/common/Card.jsx";
import Avatar from "../../components/common/Avatar.jsx";
import Badge from "../../components/common/Badge.jsx";
import Modal from "../../components/common/Modal.jsx";
import toast from "react-hot-toast";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "preferences", label: "Preferences", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
];

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [activeTab, setActiveTab] = useState("profile");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [removeBackground, setRemoveBackground] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showDeleteImageModal, setShowDeleteImageModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    preferences: user?.preferences || {},
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDrop: (accepted, rejected) => {
      if (rejected.length > 0) {
        toast.error("File too large or invalid type. Max 5MB.");
        return;
      }
      if (accepted.length > 0) {
        const file = accepted[0];
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
      }
    },
  });

  const handleUploadImage = async () => {
    if (!imageFile) return;
    setIsUploadingImage(true);
    const toastId = toast.loading(
      removeBackground ? "Removing background & uploading..." : "Uploading image..."
    );
    try {
      const result = await imageService.uploadProfileImage(imageFile, removeBackground);
      dispatch(updateUserImage(result.data.profileImage));
      setImagePreview(null);
      setImageFile(null);
      toast.success("Profile image updated! 🖼️", { id: toastId });
    } catch (error) {
      toast.error("Upload failed. Please try again.", { id: toastId });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      await imageService.deleteProfileImage();
      dispatch(updateUserImage({ url: "", publicId: "", imageKitFileId: "", thumbnailUrl: "" }));
      setShowDeleteImageModal(false);
      toast.success("Profile image removed.");
    } catch {
      toast.error("Failed to delete image.");
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await dispatch(updateUserProfile(profileForm));
    setIsSaving(false);
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordForm.currentPassword) errors.currentPassword = "Required";
    if (!passwordForm.newPassword) errors.newPassword = "Required";
    else if (passwordForm.newPassword.length < 8) errors.newPassword = "Min 8 characters";
    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      errors.confirmPassword = "Passwords don't match";
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;
    setIsSaving(true);
    await dispatch(changeUserPassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    }));
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setIsSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-800 font-display">Profile Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account and preferences</p>
      </motion.div>

      {/* Profile Hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="relative overflow-hidden">
          {/* Gradient banner */}
          <div className="h-28 -mx-6 -mt-6 mb-0 gradient-bg-hero rounded-t-2xl relative">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: "radial-gradient(circle at 30% 50%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-14 px-2">
            {/* Avatar with upload */}
            <div className="relative flex-shrink-0">
              <div className="relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <Avatar
                    src={user?.profileImage?.url}
                    firstName={user?.firstName}
                    lastName={user?.lastName}
                    size="2xl"
                    className="border-4 border-white bg-gray-300 rounded-full shadow-lg mt-14"
                  />
                )}
                <label
                  {...getRootProps()}
                  className={`absolute inset-0 rounded-full mt-14 flex items-center justify-center cursor-pointer transition-all ${
                    isDragActive ? "bg-indigo-500/70" : "bg-black/0 hover:bg-black/40"
                  } group`}
                >
                  <input {...getInputProps()} />
                  <Camera className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </label>
              </div>

              {/* Remove image button */}
              {user?.profileImage?.url && !imagePreview && (
                <button
                  onClick={() => setShowDeleteImageModal(true)}
                  className="absolute -top-2 -right-2 w-6 h-6 mt-14 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex-1 pb-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 font-display">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-slate-500 text-sm">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="primary" size="sm" dot>
                      {user?.subscription?.plan || "Free"} Plan
                    </Badge>
                    <Badge variant="success" size="sm">
                      {user?.stats?.resumesCreated || 0} Resumes
                    </Badge>
                  </div>
                </div>

                {/* Image upload controls */}
                <AnimatePresence>
                  {imagePreview && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-col gap-2"
                    >
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={removeBackground}
                          onChange={(e) => setRemoveBackground(e.target.checked)}
                          className="w-4 h-4 text-indigo-600 rounded"
                        />
                        <span className="text-xs font-medium text-slate-700 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-violet-500" />
                          Remove Background (AI)
                        </span>
                      </label>
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          icon={Upload}
                          isLoading={isUploadingImage}
                          onClick={handleUploadImage}
                        >
                          {isUploadingImage ? "Processing..." : "Upload"}
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => { setImagePreview(null); setImageFile(null); }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Drag & Drop hint */}
          <AnimatePresence>
            {isDragActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-indigo-500/20 backdrop-blur-sm flex items-center justify-center rounded-2xl border-2 border-dashed border-indigo-400"
              >
                <div className="text-center">
                  <Upload className="w-10 h-10 text-indigo-600 mx-auto mb-2" />
                  <p className="font-semibold text-indigo-700">Drop your photo here</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Tabs + Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Tab navigation */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl mb-5">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === id
                  ? "bg-white text-slate-800 shadow-soft"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab panels */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <Card>
                <h3 className="font-semibold  text-slate-800 mb-5">Personal Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 mt-5 gap-4">
                    <Input
                      label="First Name"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      icon={User}
                    />
                    <Input
                      label="Last Name"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                    />
                  </div>
                  <Input
                    label="Email Address"
                    value={user?.email || ""}
                    icon={Mail}
                    disabled
                    hint="Email cannot be changed. Contact support if needed."
                  />
                  <div className="flex items-center gap-4 pt-2">
                    <Button
                      variant="primary"
                      icon={Save}
                      isLoading={isSaving}
                      onClick={handleSaveProfile}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <Card>
                <h3 className="font-semibold text-slate-800 mb-5">Change Password</h3>
                <div className="space-y-4 max-w-md">
                  <Input
                    label="Current Password"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    error={passwordErrors.currentPassword}
                    icon={Lock}
                  />
                  <Input
                    label="New Password"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    error={passwordErrors.newPassword}
                    hint="Minimum 8 characters with uppercase, lowercase and number"
                    icon={Lock}
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    error={passwordErrors.confirmPassword}
                    success={
                      passwordForm.confirmPassword &&
                      passwordForm.newPassword === passwordForm.confirmPassword
                        ? "Passwords match!"
                        : ""
                    }
                    icon={Lock}
                  />
                  <Button
                    variant="primary"
                    icon={Shield}
                    isLoading={isSaving}
                    onClick={handleChangePassword}
                  >
                    Update Password
                  </Button>
                </div>
              </Card>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <Card>
                <h3 className="font-semibold text-slate-800 mb-5">Preferences</h3>
                <div className="space-y-5">
                  {[
                    { key: "defaultTemplate", label: "Default Template", options: ["modern", "classic", "minimal", "creative", "executive", "tech", "elegant"] },
                    { key: "language", label: "Language", options: ["en", "es", "fr", "de", "pt"] },
                    { key: "theme", label: "Theme", options: ["light", "dark", "system"] },
                  ].map(({ key, label, options }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                      <select
                        value={profileForm.preferences?.[key] || options[0]}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          preferences: { ...profileForm.preferences, [key]: e.target.value },
                        })}
                        className="input-base w-full max-w-xs capitalize"
                      >
                        {options.map((opt) => (
                          <option key={opt} value={opt} className="capitalize">{opt}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                  <Button
                    variant="primary"
                    icon={Save}
                    isLoading={isSaving}
                    onClick={handleSaveProfile}
                  >
                    Save Preferences
                  </Button>
                </div>
              </Card>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <Card>
                <h3 className="font-semibold text-slate-800 mb-5">Notification Settings</h3>
                <div className="space-y-4">
                  {[
                    { key: "emailNotifications", label: "Email Notifications", desc: "Receive updates and tips via email" },
                    { key: "resumeTips", label: "Resume Tips", desc: "Weekly AI-powered resume improvement tips" },
                    { key: "analyticsReports", label: "Analytics Reports", desc: "Monthly performance summary" },
                    { key: "marketingEmails", label: "Product Updates", desc: "News about new features and templates" },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-start justify-between py-3 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                      </div>
                      <button
                        onClick={() => setProfileForm({
                          ...profileForm,
                          preferences: {
                            ...profileForm.preferences,
                            [key]: !profileForm.preferences?.[key],
                          },
                        })}
                        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                          profileForm.preferences?.[key] ? "bg-indigo-500" : "bg-slate-200"
                        }`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                          profileForm.preferences?.[key] ? "translate-x-5" : "translate-x-0"
                        }`} />
                      </button>
                    </div>
                  ))}
                  <Button variant="primary" icon={Save} isLoading={isSaving} onClick={handleSaveProfile}>
                    Save Notifications
                  </Button>
                </div>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Delete image confirm */}
      <Modal isOpen={showDeleteImageModal} onClose={() => setShowDeleteImageModal(false)} title="Remove Profile Image" size="sm">
        <div className="p-6 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-sm text-slate-600 mb-5">Are you sure you want to remove your profile image?</p>
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => setShowDeleteImageModal(false)}>Cancel</Button>
            <Button variant="danger" fullWidth onClick={handleDeleteImage}>Remove</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;