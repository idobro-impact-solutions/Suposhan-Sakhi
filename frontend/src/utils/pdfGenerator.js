import jsPDF from 'jspdf';
import { flipbookData } from '../data/flipbookContent';

export const generateFullFlipbookPDF = async () => {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  let isFirstPage = true;

  for (let i = 0; i < flipbookData.length; i++) {
    const spread = flipbookData[i];

    // Add Family Side (Front)
    if (!isFirstPage) pdf.addPage();
    isFirstPage = false;

    try {
      const familyImg = await loadImage(spread.familySide.imageUrl);
      pdf.addImage(familyImg, 'PNG', 0, 0, 297, 210);
      
      // Add text overlay
      pdf.setFontSize(20);
      pdf.setTextColor(255, 255, 255);
      pdf.text(spread.familySide.headline, 15, 30, { maxWidth: 260 });
    } catch (error) {
      console.error(`Error loading image for page ${i + 1}:`, error);
      pdf.setFontSize(16);
      pdf.text(`Page ${i + 1} - Family Side`, 15, 30);
    }

    // Add Sakhi Side (Back)
    pdf.addPage();
    
    // Background
    pdf.setFillColor(253, 251, 247);
    pdf.rect(0, 0, 297, 210, 'F');
    
    // Title
    pdf.setFontSize(18);
    pdf.setTextColor(192, 86, 33);
    pdf.text(spread.sakhiSide.title, 15, 25, { maxWidth: 260 });
    
    // Body
    pdf.setFontSize(11);
    pdf.setTextColor(45, 36, 30);
    const bodyLines = pdf.splitTextToSize(spread.sakhiSide.body, 260);
    pdf.text(bodyLines, 15, 45);
    
    // Ask section
    const askY = 45 + (bodyLines.length * 6);
    pdf.setFillColor(245, 245, 240);
    pdf.rect(15, askY, 267, 25, 'F');
    pdf.setFontSize(12);
    pdf.setTextColor(192, 86, 33);
    pdf.text('Ask:', 20, askY + 8);
    pdf.setFontSize(10);
    pdf.setTextColor(45, 36, 30);
    const askLines = pdf.splitTextToSize(spread.sakhiSide.ask, 250);
    pdf.text(askLines, 20, askY + 15);
    
    // Action section
    const actionY = askY + 30;
    pdf.setFillColor(85, 107, 47);
    pdf.rect(15, actionY, 267, 25, 'F');
    pdf.setFontSize(12);
    pdf.setTextColor(255, 255, 255);
    pdf.text('Action:', 20, actionY + 8);
    pdf.setFontSize(10);
    const actionLines = pdf.splitTextToSize(spread.sakhiSide.action, 250);
    pdf.text(actionLines, 20, actionY + 15);
  }

  pdf.save('Suposhan_Sakhi_Full_Flipbook.pdf');
};

export const generateSakhiPagesPDF = async () => {
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
    
    // Background
    pdf.setFillColor(253, 251, 247);
    pdf.rect(0, 0, 297, 210, 'F');
    
    // Title
    pdf.setFontSize(18);
    pdf.setTextColor(192, 86, 33);
    pdf.text(spread.sakhiSide.title, 15, 25, { maxWidth: 260 });
    
    // Body
    pdf.setFontSize(11);
    pdf.setTextColor(45, 36, 30);
    const bodyLines = pdf.splitTextToSize(spread.sakhiSide.body, 260);
    pdf.text(bodyLines, 15, 45);
    
    // Ask section
    const askY = 45 + (bodyLines.length * 6);
    pdf.setFillColor(245, 245, 240);
    pdf.rect(15, askY, 267, 25, 'F');
    pdf.setFontSize(12);
    pdf.setTextColor(192, 86, 33);
    pdf.text('Ask:', 20, askY + 8);
    pdf.setFontSize(10);
    pdf.setTextColor(45, 36, 30);
    const askLines = pdf.splitTextToSize(spread.sakhiSide.ask, 250);
    pdf.text(askLines, 20, askY + 15);
    
    // Action section
    const actionY = askY + 30;
    pdf.setFillColor(85, 107, 47);
    pdf.rect(15, actionY, 267, 25, 'F');
    pdf.setFontSize(12);
    pdf.setTextColor(255, 255, 255);
    pdf.text('Action:', 20, actionY + 8);
    pdf.setFontSize(10);
    const actionLines = pdf.splitTextToSize(spread.sakhiSide.action, 250);
    pdf.text(actionLines, 20, actionY + 15);
    
    // Page number
    pdf.setFontSize(8);
    pdf.setTextColor(92, 84, 78);
    pdf.text(`Page ${i + 1} - Sakhi Side`, 15, 200);
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
