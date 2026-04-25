import Resume from '../models/Resume.js';
import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createResume = async (req, res) => {
  try {
    const resumeData = {
      ...req.body,
      user: req.user.id
    };
    
    const resume = await Resume.create(resumeData);
    res.status(201).json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort('-createdAt');
    res.json({ success: true, resumes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    
    res.json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    
    res.json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    
    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const exportToPDF = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    
    const doc = new PDFDocument();
    const filename = `resume_${resume.personalInfo.firstName}_${resume.personalInfo.lastName}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    
    doc.pipe(res);
    
    // Add content to PDF
    doc.fontSize(20).text(`${resume.personalInfo.firstName} ${resume.personalInfo.lastName}`, { align: 'center' });
    doc.fontSize(12).text(resume.personalInfo.email, { align: 'center' });
    if (resume.personalInfo.phone) {
      doc.text(resume.personalInfo.phone, { align: 'center' });
    }
    doc.moveDown();
    
    // Professional Summary
    if (resume.personalInfo.professionalSummary) {
      doc.fontSize(16).text('Professional Summary', { underline: true });
      doc.fontSize(12).text(resume.personalInfo.professionalSummary);
      doc.moveDown();
    }
    
    // Experience
    if (resume.experience.length > 0) {
      doc.fontSize(16).text('Work Experience', { underline: true });
      resume.experience.forEach(exp => {
        doc.fontSize(14).text(`${exp.title} - ${exp.company}`);
        doc.fontSize(12).text(`${exp.startDate ? new Date(exp.startDate).getFullYear() : ''} - ${exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).getFullYear() : ''}`);
        exp.description.forEach(desc => {
          doc.text(`• ${desc}`);
        });
        doc.moveDown();
      });
    }
    
    // Education
    if (resume.education.length > 0) {
      doc.fontSize(16).text('Education', { underline: true });
      resume.education.forEach(edu => {
        doc.fontSize(14).text(`${edu.degree} - ${edu.institution}`);
        doc.fontSize(12).text(`${edu.startDate ? new Date(edu.startDate).getFullYear() : ''} - ${edu.endDate ? new Date(edu.endDate).getFullYear() : ''}`);
        if (edu.grade) doc.text(`Grade: ${edu.grade}`);
        doc.moveDown();
      });
    }
    
    // Skills
    if (resume.skills.length > 0) {
      doc.fontSize(16).text('Skills', { underline: true });
      const skillsText = resume.skills.map(s => s.name).join(', ');
      doc.fontSize(12).text(skillsText);
    }
    
    doc.end();
    
    // Increment download count
    resume.downloads += 1;
    await resume.save();
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};