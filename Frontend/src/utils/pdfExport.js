// utils/pdfExport.js
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Helper to sanitize colors before rendering
const sanitizeElementForExport = (element) => {
  if (!element) return null;
  
  const problematicStyles = [];
  
  // Recursively process all elements
  const processElement = (el) => {
    if (!el || !el.style) return;
    
    const computedStyle = window.getComputedStyle(el);
    const originalStyles = {};
    
    // Check for problematic color formats
    const colorProps = ['color', 'backgroundColor', 'borderColor', 'outlineColor', 'boxShadow'];
    
    colorProps.forEach(prop => {
      const value = computedStyle[prop];
      if (value && (value.includes('oklab') || value.includes('oklch') || value.includes('lab('))) {
        // Store original style
        originalStyles[prop] = el.style[prop];
        // Replace with safe fallback
        if (prop === 'color') el.style[prop] = '#1e293b';
        else if (prop === 'backgroundColor') el.style[prop] = '#ffffff';
        else if (prop === 'borderColor') el.style[prop] = '#e2e8f0';
        else el.style[prop] = 'none';
        
        problematicStyles.push({ el, prop, original: originalStyles[prop] });
      }
    });
    
    // Recursively process children
    if (el.children) {
      Array.from(el.children).forEach(child => processElement(child));
    }
  };
  
  processElement(element);
  
  // Return cleanup function
  return () => {
    problematicStyles.forEach(({ el, prop, original }) => {
      if (original !== undefined) el.style[prop] = original;
      else el.style.removeProperty(prop);
    });
  };
};

export const exportToPDF = async (elementId, filename = "resume.pdf") => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Resume element not found");
  }

  // Show loading indicator
  const loadingToast = showLoadingToast();
  
  try {
    // Clone the element to avoid modifying the original
    const cloneContainer = document.createElement('div');
    cloneContainer.style.position = 'absolute';
    cloneContainer.style.left = '-9999px';
    cloneContainer.style.top = '0';
    cloneContainer.style.backgroundColor = '#ffffff';
    
    const clone = element.cloneNode(true);
    cloneContainer.appendChild(clone);
    document.body.appendChild(cloneContainer);
    
    // Sanitize the clone to remove problematic colors
    const cleanup = sanitizeElementForExport(clone);
    
    // Add safe styles to the clone
    const safeStyles = document.createElement('style');
    safeStyles.textContent = `
      * {
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      [style*="oklab"], [style*="oklch"] {
        color: #1e293b !important;
        background-color: #ffffff !important;
        border-color: #e2e8f0 !important;
      }
      .gradient-bg, [class*="gradient"] {
        background: linear-gradient(135deg, #4f46e5, #818cf8) !important;
      }
    `;
    clone.appendChild(safeStyles);
    
    // Wait for any fonts or images to load
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const canvas = await html2canvas(clone, {
      scale: 2.5,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: false,
      windowWidth: clone.scrollWidth,
      windowHeight: clone.scrollHeight,
      onclone: (clonedDoc, element) => {
        const clonedElements = clonedDoc.querySelectorAll('*');
        clonedElements.forEach(el => {
          if (el.style) {
            const color = el.style.color;
            const bgColor = el.style.backgroundColor;
            
            if (color && (color.includes('oklab') || color.includes('oklch'))) {
              el.style.color = '#1e293b';
            }
            if (bgColor && (bgColor.includes('oklab') || bgColor.includes('oklch'))) {
              el.style.backgroundColor = '#ffffff';
            }
          }
        });
      }
    });
    
    // Clean up
    cleanup();
    document.body.removeChild(cloneContainer);
    
    // A4 dimensions in mm
    const pdfWidth = 210;
    const pdfHeight = 297;
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgWidth / imgHeight;
    
    let finalWidth = pdfWidth;
    let finalHeight = pdfWidth / ratio;
    
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });
    
    // Handle multi-page resumes
    if (finalHeight > pdfHeight) {
      let yPosition = 0;
      let pageNumber = 0;
      
      while (yPosition < finalHeight) {
        if (pageNumber > 0) {
          pdf.addPage();
        }
        
        const sourceY = (yPosition / finalHeight) * imgHeight;
        const sourceHeight = Math.min((pdfHeight / finalHeight) * imgHeight, imgHeight - sourceY);
        
        // Create a temporary canvas for this page
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = imgWidth;
        pageCanvas.height = sourceHeight;
        
        const ctx = pageCanvas.getContext("2d");
        ctx.drawImage(
          canvas,
          0,
          sourceY,
          imgWidth,
          sourceHeight,
          0,
          0,
          imgWidth,
          sourceHeight
        );
        
        const pageImgData = pageCanvas.toDataURL("image/jpeg", 1.0);
        pdf.addImage(pageImgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
        
        yPosition += pdfHeight;
        pageNumber++;
        
        // Clean up page canvas
        pageCanvas.remove();
      }
    } else {
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      // Center the content on the page if it's smaller
      const yOffset = (pdfHeight - finalHeight) / 2;
      pdf.addImage(imgData, "JPEG", 0, yOffset > 0 ? yOffset : 0, finalWidth, finalHeight);
    }
    
    pdf.save(filename);
    hideLoadingToast(loadingToast);
    return true;
  } catch (error) {
    console.error("PDF export error:", error);
    hideLoadingToast(loadingToast);
    
    // Try fallback method
    return await fallbackExport(element, filename);
  }
};

// Fallback export method
const fallbackExport = async (element, filename) => {
  try {
    // Create a simple print-friendly version
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error("Pop-up blocked. Please allow pop-ups for this site.");
    }
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: Arial, sans-serif;
            }
            #resume-content {
              max-width: 800px;
              margin: 0 auto;
            }
            * {
              color: #000 !important;
              background: #fff !important;
              border-color: #ccc !important;
            }
            .gradient-bg, [class*="gradient"] {
              background: #4f46e5 !important;
            }
            .gradient-text {
              color: #4f46e5 !important;
              background: none !important;
            }
            [style*="box-shadow"], [class*="shadow"] {
              box-shadow: none !important;
            }
          </style>
        </head>
        <body>
          <div id="resume-content">
            ${element.cloneNode(true).outerHTML}
          </div>
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
                setTimeout(() => window.close(), 1000);
              }, 500);
            };
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
    return true;
  } catch (error) {
    console.error("Fallback export failed:", error);
    throw new Error("Unable to export PDF. Please try again.");
  }
};

// Helper functions for loading toast
const showLoadingToast = () => {
  const toastId = setTimeout(() => {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    toast.textContent = 'Generating PDF...';
    document.body.appendChild(toast);
    window.__pdfToast = toast;
  }, 100);
  return toastId;
};

const hideLoadingToast = (toastId) => {
  clearTimeout(toastId);
  if (window.__pdfToast) {
    window.__pdfToast.remove();
    delete window.__pdfToast;
  }
};

export const getResumeFilename = (resume) => {
  try {
    let name = "resume";
    
    if (resume?.personalInfo) {
      const firstName = resume.personalInfo.firstName || "";
      const lastName = resume.personalInfo.lastName || "";
      name = `${firstName}_${lastName}`.trim();
    } else if (resume?.title) {
      name = resume.title;
    }
    
    const cleanName = name.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "resume";
    const date = new Date().toISOString().split("T")[0];
    return `${cleanName}_resume_${date}.pdf`;
  } catch (error) {
    return `resume_${Date.now()}.pdf`;
  }
};