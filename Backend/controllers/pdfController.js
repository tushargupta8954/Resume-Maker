import { generatePDF } from '../utils/pdfGenerator.js';
import Resume from '../models/Resume.js';
import Analytics from '../models/Analytics.js';

// @desc    Download resume as PDF
// @route   GET /api/resumes/:id/download
// @access  Private
export const downloadResumePDF = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // Check ownership
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Generate PDF
    const pdfBuffer = await generatePDF(resume.toObject());

    // Track download
    resume.downloadCount += 1;
    await resume.save();

    // Track analytics
    const analytics = await Analytics.findOne({ resume: resume._id });
    if (analytics) {
      analytics.events.push({
        eventType: 'download',
        timestamp: new Date(),
      });
      analytics.updateMetrics();
      await analytics.save();
    }

    // Send PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${resume.title || 'resume'}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF Download Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF',
      error: error.message,
    });
  }
};