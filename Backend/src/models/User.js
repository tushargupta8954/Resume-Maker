import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    profileImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
      imageKitFileId: { type: String, default: "" },
      thumbnailUrl: { type: String, default: "" },
    },
    role: {
      type: String,
      enum: ["user", "premium", "admin"],
      default: "user",
    },
    subscription: {
      plan: {
        type: String,
        enum: ["free", "pro", "enterprise"],
        default: "free",
      },
      startDate: Date,
      endDate: Date,
      isActive: { type: Boolean, default: false },
    },
    preferences: {
      theme: { type: String, default: "light" },
      defaultTemplate: { type: String, default: "modern" },
      emailNotifications: { type: Boolean, default: true },
      language: { type: String, default: "en" },
    },
    stats: {
      resumesCreated: { type: Number, default: 0 },
      totalDownloads: { type: Number, default: 0 },
      profileViews: { type: Number, default: 0 },
      lastActive: { type: Date, default: Date.now },
    },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    passwordResetToken: String,
    passwordResetExpire: Date,
    refreshToken: String,
    isActive: { type: Boolean, default: true },
    deletedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: Full Name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual: Resumes count
userSchema.virtual("resumes", {
  ref: "Resume",
  localField: "_id",
  foreignField: "user",
  count: true,
});

// Pre-save: Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method: Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method: Update last active
userSchema.methods.updateLastActive = async function () {
  this.stats.lastActive = new Date();
  await this.save({ validateBeforeSave: false });
};

// Index for performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

const User = mongoose.model("User", userSchema);

export default User;