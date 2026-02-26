import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { flipbookData } from '../data/flipbookContent';

// Convert image URL to blob
const urlToBlob = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
};

// Download Family pages (original images)
export const downloadFamilyPagesZip = async (onProgress) => {
  const zip = new JSZip();
  const folder = zip.folder('Suposhan_Sakhi_Family_Pages');
  
  for (let i = 0; i < flipbookData.length; i++) {
    onProgress(`Downloading Family page ${i + 1} of ${flipbookData.length}...`);
    const imageUrl = flipbookData[i].familySide.imageUrl;
    const blob = await urlToBlob(imageUrl);
    
    if (blob) {
      folder.file(`Page_${String(i + 1).padStart(2, '0')}_Family.png`, blob);
    }
  }
  
  onProgress('Creating ZIP file...');
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'Suposhan_Sakhi_Family_Pages.zip');
  onProgress('Download complete!');
};

// Download Sakhi pages  (original images)
export const downloadSakhiPagesZip = async (onProgress) => {
  const zip = new JSZip();
  const folder = zip.folder('Suposhan_Sakhi_Sakhi_Pages');
  
  for (let i = 0; i < flipbookData.length; i++) {
    onProgress(`Downloading Sakhi page ${i + 1} of ${flipbookData.length}...`);
    const imageUrl = flipbookData[i].familySide.imageUrl;
    const blob = await urlToBlob(imageUrl);
    
    if (blob) {
      folder.file(`Page_${String(i + 1).padStart(2, '0')}_Sakhi.png`, blob);
    }
  }
  
  onProgress('Creating ZIP file...');
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'Suposhan_Sakhi_Sakhi_Pages.zip');
  onProgress('Download complete!');
};

// Download complete flipbook (both sides)
export const downloadCompleteFlipbookZip = async (onProgress) => {
  const zip = new JSZip();
  const folder = zip.folder('Suposhan_Sakhi_Complete_Flipbook');
  
  for (let i = 0; i < flipbookData.length; i++) {
    onProgress(`Downloading page ${i + 1} of ${flipbookData.length}...`);
    const imageUrl = flipbookData[i].familySide.imageUrl;
    
    // Download family side
    const familyBlob = await urlToBlob(imageUrl);
    if (familyBlob) {
      folder.file(`Page_${String(i + 1).padStart(2, '0')}_A_Family.png`, familyBlob);
    }
    
    // For Sakhi side, use same image (you'll need to create Sakhi images separately)
    const sakhiBlob = await urlToBlob(imageUrl);
    if (sakhiBlob) {
      folder.file(`Page_${String(i + 1).padStart(2, '0')}_B_Sakhi.png`, sakhiBlob);
    }
  }
  
  onProgress('Creating ZIP file...');
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'Suposhan_Sakhi_Complete_Flipbook.zip');
  onProgress('Download complete!');
};
