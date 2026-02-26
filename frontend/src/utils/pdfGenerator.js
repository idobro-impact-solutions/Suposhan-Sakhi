import jsPDF from 'jspdf';
import { flipbookData } from '../data/flipbookContent';

// Helper to load image with proper CORS handling
const loadImageWithCORS = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        resolve(dataUrl);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
};

export const generateFullFlipbookPDF = async () => {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  let isFirstPage = true;

  for (let i = 0; i < flipbookData.length; i++) {
    const spread = flipbookData[i];

    // Add Family Side (Front)
    if (!isFirstPage) pdf.addPage();
    isFirstPage = false;

    try {
      const familyImg = await loadImageWithCORS(spread.familySide.imageUrl);
      pdf.addImage(familyImg, 'JPEG', 0, 0, 297, 210);
      
      // Add semi-transparent overlay for text readability
      pdf.setFillColor(0, 0, 0);
      pdf.setGState(new pdf.GState({opacity: 0.5}));
      pdf.rect(0, 0, 297, 70, 'F');
      pdf.setGState(new pdf.GState({opacity: 1}));
      
      // Add headline text
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.setTextColor(255, 255, 255);
      const headlineLines = pdf.splitTextToSize(spread.familySide.headline, 260);
      pdf.text(headlineLines, 15, 25);
      
      // Add page number at bottom
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text(`Page ${i + 1} - Family Side`, 15, 200);
    } catch (error) {
      console.error(`Error loading image for page ${i + 1}:`, error);
      // Fallback if image fails
      pdf.setFillColor(253, 251, 247);
      pdf.rect(0, 0, 297, 210, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.setTextColor(192, 86, 33);
      pdf.text(`Page ${i + 1} - Family Side`, 15, 30);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(14);
      pdf.setTextColor(45, 36, 30);
      const headlineLines = pdf.splitTextToSize(spread.familySide.headline, 260);
      pdf.text(headlineLines, 15, 50);
    }

    // Add Sakhi Side (Back) - Improved formatting
    pdf.addPage();
    
    // Background with subtle pattern
    pdf.setFillColor(253, 251, 247);
    pdf.rect(0, 0, 297, 210, 'F');
    
    // Header bar
    pdf.setFillColor(192, 86, 33);
    pdf.rect(0, 0, 297, 15, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(255, 255, 255);
    pdf.text('Suposhan Sakhi - Nutrition Counseling Guide', 15, 10);
    pdf.text(`Page ${i + 1} of ${flipbookData.length}`, 250, 10);
    
    // Title section with underline
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.setTextColor(192, 86, 33);
    const titleLines = pdf.splitTextToSize(spread.sakhiSide.title, 260);
    pdf.text(titleLines, 15, 28);
    const titleHeight = titleLines.length * 7;
    pdf.setDrawColor(236, 185, 57);
    pdf.setLineWidth(1);
    pdf.line(15, 28 + titleHeight, 280, 28 + titleHeight);
    
    // Key Information label
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(85, 107, 47);
    pdf.text('Key Information:', 15, 28 + titleHeight + 10);
    
    // Body text with better spacing
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(45, 36, 30);
    const bodyLines = pdf.splitTextToSize(spread.sakhiSide.body, 260);
    const maxBodyLines = Math.min(bodyLines.length, 20); // Limit to prevent overflow
    pdf.text(bodyLines.slice(0, maxBodyLines), 15, 28 + titleHeight + 18);
    
    // Ask section with icon-style design
    const askY = Math.min(28 + titleHeight + 18 + (maxBodyLines * 5), 130);
    
    // Ask box with border
    pdf.setFillColor(255, 250, 240);
    pdf.setDrawColor(236, 185, 57);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(15, askY, 130, 35, 2, 2, 'FD');
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(192, 86, 33);
    pdf.text('💬 Ask:', 20, askY + 7);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(45, 36, 30);
    const askLines = pdf.splitTextToSize(spread.sakhiSide.ask, 115);
    pdf.text(askLines.slice(0, 5), 20, askY + 14);
    
    // Action section with icon-style design
    pdf.setFillColor(85, 107, 47);
    pdf.setDrawColor(85, 107, 47);
    pdf.roundedRect(150, askY, 130, 35, 2, 2, 'FD');
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(255, 255, 255);
    pdf.text('✓ Action:', 155, askY + 7);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    const actionLines = pdf.splitTextToSize(spread.sakhiSide.action, 115);
    pdf.text(actionLines.slice(0, 5), 155, askY + 14);
    
    // Footer
    pdf.setFillColor(245, 245, 240);
    pdf.rect(0, 195, 297, 15, 'F');
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(8);
    pdf.setTextColor(92, 84, 78);
    pdf.text('Britannia Nutrition Foundation & Idobro Impact Solutions © 2026', 15, 203);
  }

  pdf.save('Suposhan_Sakhi_Full_Flipbook.pdf');
};

export const generateSakhiPagesPDF = async () => {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  let isFirstPage = true;

  for (let i = 0; i < flipbookData.length; i++) {
    const spread = flipbookData[i];

    if (!isFirstPage) pdf.addPage();
    isFirstPage = false;
    
    // Background
    pdf.setFillColor(253, 251, 247);
    pdf.rect(0, 0, 297, 210, 'F');
    
    // Header bar
    pdf.setFillColor(192, 86, 33);
    pdf.rect(0, 0, 297, 15, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(255, 255, 255);
    pdf.text('Suposhan Sakhi - Nutrition Counseling Guide', 15, 10);
    pdf.text(`Page ${i + 1} of ${flipbookData.length}`, 250, 10);
    
    // Title section with underline
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.setTextColor(192, 86, 33);
    const titleLines = pdf.splitTextToSize(spread.sakhiSide.title, 260);
    pdf.text(titleLines, 15, 28);
    const titleHeight = titleLines.length * 7;
    pdf.setDrawColor(236, 185, 57);
    pdf.setLineWidth(1);
    pdf.line(15, 28 + titleHeight, 280, 28 + titleHeight);
    
    // Key Information label
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(85, 107, 47);
    pdf.text('Key Information:', 15, 28 + titleHeight + 10);
    
    // Body text with better spacing
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(45, 36, 30);
    const bodyLines = pdf.splitTextToSize(spread.sakhiSide.body, 260);
    const maxBodyLines = Math.min(bodyLines.length, 20);
    pdf.text(bodyLines.slice(0, maxBodyLines), 15, 28 + titleHeight + 18);
    
    // Ask section with icon-style design
    const askY = Math.min(28 + titleHeight + 18 + (maxBodyLines * 5), 130);
    
    // Ask box with border
    pdf.setFillColor(255, 250, 240);
    pdf.setDrawColor(236, 185, 57);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(15, askY, 130, 35, 2, 2, 'FD');
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(192, 86, 33);
    pdf.text('💬 Ask:', 20, askY + 7);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(45, 36, 30);
    const askLines = pdf.splitTextToSize(spread.sakhiSide.ask, 115);
    pdf.text(askLines.slice(0, 5), 20, askY + 14);
    
    // Action section with icon-style design
    pdf.setFillColor(85, 107, 47);
    pdf.setDrawColor(85, 107, 47);
    pdf.roundedRect(150, askY, 130, 35, 2, 2, 'FD');
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(255, 255, 255);
    pdf.text('✓ Action:', 155, askY + 7);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    const actionLines = pdf.splitTextToSize(spread.sakhiSide.action, 115);
    pdf.text(actionLines.slice(0, 5), 155, askY + 14);
    
    // Footer
    pdf.setFillColor(245, 245, 240);
    pdf.rect(0, 195, 297, 15, 'F');
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(8);
    pdf.setTextColor(92, 84, 78);
    pdf.text('Britannia Nutrition Foundation & Idobro Impact Solutions © 2026', 15, 203);
  }

  pdf.save('Suposhan_Sakhi_Sakhi_Pages.pdf');
};

export const generateFamilyPagesPDF = async () => {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  let isFirstPage = true;

  for (let i = 0; i < flipbookData.length; i++) {
    const spread = flipbookData[i];

    if (!isFirstPage) pdf.addPage();
    isFirstPage = false;

    try {
      const familyImg = await loadImage(spread.familySide.imageUrl);
      pdf.addImage(familyImg, 'PNG', 0, 0, 297, 210);
      
      // Add text overlay
      pdf.setFontSize(20);
      pdf.setTextColor(255, 255, 255);
      pdf.text(spread.familySide.headline, 15, 30, { maxWidth: 260 });
      
      // Add page number
      pdf.setFontSize(10);
      pdf.text(`Page ${i + 1} - Family Side`, 15, 200);
    } catch (error) {
      console.error(`Error loading image for page ${i + 1}:`, error);
      pdf.setFillColor(253, 251, 247);
      pdf.rect(0, 0, 297, 210, 'F');
      pdf.setFontSize(16);
      pdf.setTextColor(192, 86, 33);
      pdf.text(`Page ${i + 1} - Family Side`, 15, 30);
      pdf.setFontSize(14);
      pdf.setTextColor(45, 36, 30);
      pdf.text(spread.familySide.headline, 15, 50, { maxWidth: 260 });
    }
  }

  pdf.save('Suposhan_Sakhi_Family_Pages.pdf');
};

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = url;
  });
};
