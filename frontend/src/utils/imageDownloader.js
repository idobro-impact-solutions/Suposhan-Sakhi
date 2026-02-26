import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Capture a single page as image
export const capturePage = async (element, filename) => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FDFBF7',
      logging: false,
      imageTimeout: 0,
      removeContainer: true
    });
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve({ blob, filename });
      }, 'image/png', 1.0);
    });
  } catch (error) {
    console.error('Error capturing page:', error);
    return null;
  }
};

// Download single image
export const downloadSingleImage = async (element, filename) => {
  const result = await capturePage(element, filename);
  if (result) {
    saveAs(result.blob, filename);
  }
};

// Download all Family pages as ZIP
export const downloadFamilyPagesZip = async (capturePageFunc, totalPages) => {
  const zip = new JSZip();
  const images = zip.folder('Suposhan_Sakhi_Family_Pages');
  
  for (let i = 0; i < totalPages; i++) {
    const result = await capturePageFunc(i, 'family');
    if (result) {
      images.file(`Page_${String(i + 1).padStart(2, '0')}_Family.png`, result.blob);
    }
  }
  
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'Suposhan_Sakhi_Family_Pages.zip');
};

// Download all Sakhi pages as ZIP
export const downloadSakhiPagesZip = async (capturePageFunc, totalPages) => {
  const zip = new JSZip();
  const images = zip.folder('Suposhan_Sakhi_Sakhi_Pages');
  
  for (let i = 0; i < totalPages; i++) {
    const result = await capturePageFunc(i, 'sakhi');
    if (result) {
      images.file(`Page_${String(i + 1).padStart(2, '0')}_Sakhi.png`, result.blob);
    }
  }
  
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'Suposhan_Sakhi_Sakhi_Pages.zip');
};

// Download complete flipbook as ZIP
export const downloadCompleteFlipbookZip = async (capturePageFunc, totalPages) => {
  const zip = new JSZip();
  const images = zip.folder('Suposhan_Sakhi_Complete_Flipbook');
  
  for (let i = 0; i < totalPages; i++) {
    // Capture Family side
    const familyResult = await capturePageFunc(i, 'family');
    if (familyResult) {
      images.file(`Page_${String(i + 1).padStart(2, '0')}_A_Family.png`, familyResult.blob);
    }
    
    // Capture Sakhi side
    const sakhiResult = await capturePageFunc(i, 'sakhi');
    if (sakhiResult) {
      images.file(`Page_${String(i + 1).padStart(2, '0')}_B_Sakhi.png`, sakhiResult.blob);
    }
  }
  
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'Suposhan_Sakhi_Complete_Flipbook.zip');
};
