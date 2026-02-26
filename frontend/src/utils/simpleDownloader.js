import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { flipbookData } from '../data/flipbookContent';
import html2canvas from 'html2canvas';

// Helper function to create and render a page element off-screen
const createPageElement = (pageIndex, side) => {
  return new Promise((resolve) => {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.width = '1536px';
    container.style.height = '1024px';
    container.style.backgroundColor = side === 'family' ? 'transparent' : '#FDFBF7';
    document.body.appendChild(container);

    const spread = flipbookData[pageIndex];

    if (side === 'family') {
      // Family side - just the image with headline
      container.innerHTML = `
        <div style="position: relative; width: 100%; height: 100%; background-color: #FDFBF7;">
          <img src="${spread.familySide.imageUrl}" 
               style="width: 100%; height: 100%; object-fit: cover;" 
               crossorigin="anonymous" />
          <div style="position: absolute; top: 0; left: 0; right: 0; padding: 40px; background: linear-gradient(to bottom, rgba(0,0,0,0.6), transparent);">
            <h2 style="font-family: 'Merriweather', serif; font-size: 48px; font-weight: bold; color: white; margin-bottom: 10px;">
              ${spread.familySide.headline}
            </h2>
            ${spread.familySide.subtitle ? `<p style="font-family: 'Nunito', sans-serif; font-size: 28px; color: rgba(255,255,255,0.9);">${spread.familySide.subtitle}</p>` : ''}
          </div>
        </div>
      `;
    } else {
      // Sakhi side - formatted text content (NOT transformed/flipped)
      container.innerHTML = `
        <div style="position: relative; width: 100%; height: 100%; background-color: #FDFBF7; padding: 40px; font-family: 'Nunito', sans-serif; transform: none;">
          <div style="background-color: #C05621; padding: 15px 40px; margin: -40px -40px 30px -40px;">
            <h3 style="color: white; font-size: 18px; font-weight: bold; margin: 0;">Suposhan Sakhi - Nutrition Counseling Guide | Page ${pageIndex + 1} of ${flipbookData.length}</h3>
          </div>
          
          <h2 style="font-family: 'Merriweather', serif; font-size: 42px; font-weight: bold; color: #C05621; margin-bottom: 10px;">
            ${spread.sakhiSide.title}
          </h2>
          <div style="width: 100%; height: 3px; background-color: #ECB939; margin-bottom: 25px;"></div>
          
          <h4 style="font-size: 20px; font-weight: bold; color: #556B2F; margin-bottom: 15px;">Key Information:</h4>
          <p style="font-size: 18px; color: #2D241E; line-height: 1.6; margin-bottom: 25px;">
            ${spread.sakhiSide.body.substring(0, 600)}${spread.sakhiSide.body.length > 600 ? '...' : ''}
          </p>
          
          <div style="display: flex; gap: 20px; margin-top: 30px;">
            <div style="flex: 1; background-color: #FFF8E1; border: 2px solid #ECB939; border-radius: 8px; padding: 20px;">
              <h4 style="font-size: 20px; font-weight: bold; color: #C05621; margin-bottom: 10px;">Ask:</h4>
              <p style="font-size: 16px; color: #2D241E; line-height: 1.5;">
                ${spread.sakhiSide.ask.substring(0, 200)}${spread.sakhiSide.ask.length > 200 ? '...' : ''}
              </p>
            </div>
            
            <div style="flex: 1; background-color: #556B2F; border-radius: 8px; padding: 20px;">
              <h4 style="font-size: 20px; font-weight: bold; color: white; margin-bottom: 10px;">Action:</h4>
              <p style="font-size: 16px; color: white; line-height: 1.5;">
                ${spread.sakhiSide.action.substring(0, 200)}${spread.sakhiSide.action.length > 200 ? '...' : ''}
              </p>
            </div>
          </div>
          
          <div style="position: absolute; bottom: 20px; left: 40px; right: 40px; background-color: #F5F5F0; padding: 10px; border-radius: 4px;">
            <p style="font-size: 14px; color: #5C544E; font-style: italic; margin: 0; text-align: center;">
              Britannia Nutrition Foundation & Idobro Impact Solutions © 2026
            </p>
          </div>
        </div>
      `;
    }

    // Wait for images to load
    const img = container.querySelector('img');
    if (img) {
      img.onload = () => {
        setTimeout(() => resolve(container), 500);
      };
      img.onerror = () => {
        setTimeout(() => resolve(container), 300);
      };
    } else {
      setTimeout(() => resolve(container), 300);
    }
  });
};

// Capture page as blob
const capturePageAsBlob = async (pageIndex, side) => {
  const container = await createPageElement(pageIndex, side);
  
  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: side === 'family' ? null : '#FDFBF7',
      logging: false,
      imageTimeout: 0,
    });
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        document.body.removeChild(container);
        resolve(blob);
      }, 'image/png', 1.0);
    });
  } catch (error) {
    console.error('Error capturing page:', error);
    document.body.removeChild(container);
    return null;
  }
};

// Download Family pages (rendered images)
export const downloadFamilyPagesZip = async (onProgress) => {
  const zip = new JSZip();
  const folder = zip.folder('Suposhan_Sakhi_Family_Pages');
  
  for (let i = 0; i < flipbookData.length; i++) {
    onProgress(`Capturing Family page ${i + 1} of ${flipbookData.length}...`);
    const blob = await capturePageAsBlob(i, 'family');
    
    if (blob) {
      folder.file(`Page_${String(i + 1).padStart(2, '0')}_Family.png`, blob);
    }
  }
  
  onProgress('Creating ZIP file...');
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'Suposhan_Sakhi_Family_Pages.zip');
  onProgress('Download complete!');
};

// Download Sakhi pages (rendered content, not flipped)
export const downloadSakhiPagesZip = async (onProgress) => {
  const zip = new JSZip();
  const folder = zip.folder('Suposhan_Sakhi_Sakhi_Pages');
  
  for (let i = 0; i < flipbookData.length; i++) {
    onProgress(`Capturing Sakhi page ${i + 1} of ${flipbookData.length}...`);
    const blob = await capturePageAsBlob(i, 'sakhi');
    
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
    onProgress(`Capturing page ${i + 1} of ${flipbookData.length}...`);
    
    // Capture family side
    const familyBlob = await capturePageAsBlob(i, 'family');
    if (familyBlob) {
      folder.file(`Page_${String(i + 1).padStart(2, '0')}_A_Family.png`, familyBlob);
    }
    
    // Capture sakhi side
    const sakhiBlob = await capturePageAsBlob(i, 'sakhi');
    if (sakhiBlob) {
      folder.file(`Page_${String(i + 1).padStart(2, '0')}_B_Sakhi.png`, sakhiBlob);
    }
  }
  
  onProgress('Creating ZIP file...');
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'Suposhan_Sakhi_Complete_Flipbook.zip');
  onProgress('Download complete!');
}
