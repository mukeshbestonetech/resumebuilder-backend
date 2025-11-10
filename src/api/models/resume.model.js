const mongoose = require('mongoose');

const workExperienceSchema = new mongoose.Schema({
  company: { type: String, trim: true },
  jobTitle: { type: String, trim: true },
  startDate: { type: String },
  endDate: { type: String },
  description: { type: String, trim: true },
});

const educationSchema = new mongoose.Schema({
  institution: { type: String, trim: true },
  degree: { type: String, trim: true },
  fieldOfStudy: { type: String, trim: true },
  startDate: { type: String },
  endDate: { type: String },
});

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  professionalSummary: {
    type: String,
    trim: true,
  },
  workExperience: [workExperienceSchema],
  education: [educationSchema],
  skills: [{
    type: String,
    trim: true,
  }],
  template: {
    type: String,
    default: 'modern',
  },
}, { timestamps: true });

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;

