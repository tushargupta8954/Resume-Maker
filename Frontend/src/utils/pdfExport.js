import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportToPDF = async (resume) => {
  const element = document.getElementById('resume-preview');
  if (!element) {
    throw new Error('Resume preview element not found');
  }

  // Create canvas from HTML
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  // Calculate PDF dimensions
  const imgWidth = 210; // A4 width in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // Create PDF
  const pdf = new jsPDF({
    orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const imgData = canvas.toDataURL('image/png');
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

  // Download
  pdf.save(`${resume.title || 'resume'}.pdf`);
};