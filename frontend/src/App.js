import React, { useState } from 'react';
import '@/App.css';
import { FlipbookViewer } from './components/FlipbookViewer';
import { DownloadCard } from './components/DownloadCard';
import { BookOpen, Users, UserCheck } from 'lucide-react';
import { flipbookData } from './data/flipbookContent';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [showViewer, setShowViewer] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');

  // Capture a single page as image blob
  const capturePageAsImage = async (pageIndex, side) => {
    return new Promise((resolve) => {
      // Create temporary container
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.width = '1536px';
      container.style.height = '1024px';
      container.style.backgroundColor = '#FDFBF7';
      document.body.appendChild(container);

      const spread = flipbookData[pageIndex];

      if (side === 'family') {
        // Create Family side element
        container.innerHTML = `
          <div style="position: relative; width: 100%; height: 100%; background-color: #FDFBF7;">
            <img src="${spread.familySide.imageUrl}" style="width: 100%; height: 100%; object-fit: cover;" crossorigin="anonymous" />
            <div style="position: absolute; top: 0; left: 0; right: 0; padding: 40px; background: linear-gradient(to bottom, rgba(0,0,0,0.6), transparent);">
              <h2 style="font-family: 'Merriweather', serif; font-size: 48px; font-weight: bold; color: white; margin-bottom: 10px;">
                ${spread.familySide.headline}
              </h2>
              ${spread.familySide.subtitle ? `<p style="font-family: 'Nunito', sans-serif; font-size: 28px; color: rgba(255,255,255,0.9);">${spread.familySide.subtitle}</p>` : ''}
            </div>
          </div>
        `;
      } else {
        // Create Sakhi side element
        container.innerHTML = `
          <div style="position: relative; width: 100%; height: 100%; background-color: #FDFBF7; padding: 40px; font-family: 'Nunito', sans-serif;">
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
          setTimeout(async () => {
            try {
              const canvas = await html2canvas(container, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#FDFBF7',
                logging: false
              });
              
              canvas.toBlob((blob) => {
                document.body.removeChild(container);
                resolve(blob);
              }, 'image/png', 1.0);
            } catch (error) {
              console.error('Error capturing:', error);
              document.body.removeChild(container);
              resolve(null);
            }
          }, 500);
        };
        img.onerror = () => {
          document.body.removeChild(container);
          resolve(null);
        };
      } else {
        setTimeout(async () => {
          try {
            const canvas = await html2canvas(container, {
              scale: 2,
              backgroundColor: '#FDFBF7',
              logging: false
            });
            
            canvas.toBlob((blob) => {
              document.body.removeChild(container);
              resolve(blob);
            }, 'image/png', 1.0);
          } catch (error) {
            console.error('Error capturing:', error);
            document.body.removeChild(container);
            resolve(null);
          }
        }, 300);
      }
    });
  };

  const handleDownload = async (type) => {
    setIsGenerating(true);
    setProgress('Preparing download...');
    
    try {
      const zip = new JSZip();
      let folder;
      
      if (type === 'full') {
        folder = zip.folder('Suposhan_Sakhi_Complete_Flipbook');
        setProgress('Generating all pages...');
        
        for (let i = 0; i < flipbookData.length; i++) {
          setProgress(`Capturing page ${i + 1} of ${flipbookData.length}...`);
          
          const familyBlob = await capturePageAsImage(i, 'family');
          if (familyBlob) {
            folder.file(`Page_${String(i + 1).padStart(2, '0')}_A_Family.png`, familyBlob);
          }
          
          const sakhiBlob = await capturePageAsImage(i, 'sakhi');
          if (sakhiBlob) {
            folder.file(`Page_${String(i + 1).padStart(2, '0')}_B_Sakhi.png`, sakhiBlob);
          }
        }
        
        setProgress('Creating ZIP file...');
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, 'Suposhan_Sakhi_Complete_Flipbook.zip');
        
      } else if (type === 'sakhi') {
        folder = zip.folder('Suposhan_Sakhi_Sakhi_Pages');
        setProgress('Generating Sakhi pages...');
        
        for (let i = 0; i < flipbookData.length; i++) {
          setProgress(`Capturing Sakhi page ${i + 1} of ${flipbookData.length}...`);
          const blob = await capturePageAsImage(i, 'sakhi');
          if (blob) {
            folder.file(`Page_${String(i + 1).padStart(2, '0')}_Sakhi.png`, blob);
          }
        }
        
        setProgress('Creating ZIP file...');
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, 'Suposhan_Sakhi_Sakhi_Pages.zip');
        
      } else if (type === 'family') {
        folder = zip.folder('Suposhan_Sakhi_Family_Pages');
        setProgress('Generating Family pages...');
        
        for (let i = 0; i < flipbookData.length; i++) {
          setProgress(`Capturing Family page ${i + 1} of ${flipbookData.length}...`);
          const blob = await capturePageAsImage(i, 'family');
          if (blob) {
            folder.file(`Page_${String(i + 1).padStart(2, '0')}_Family.png`, blob);
          }
        }
        
        setProgress('Creating ZIP file...');
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, 'Suposhan_Sakhi_Family_Pages.zip');
      }
      
      setProgress('Download complete!');
      setTimeout(() => setProgress(''), 2000);
      
    } catch (error) {
      console.error('Error generating download:', error);
      alert('Error generating download. Please try again.');
      setProgress('');
    } finally {
      setIsGenerating(false);
    }
  };

  if (showViewer) {
    return (
      <div style={{ backgroundColor: '#FDFBF7', minHeight: '100vh' }}>
        <nav className="border-b" style={{ backgroundColor: 'white', borderColor: '#E5E0D8' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowViewer(false)}
                className="flex items-center gap-3"
                style={{ color: '#C05621' }}
                data-testid="back-to-home-button"
              >
                <BookOpen size={32} />
                <div>
                  <h1 className="text-2xl font-bold" style={{ fontFamily: 'Merriweather, serif', color: '#2D241E' }}>
                    Suposhan Sakhi
                  </h1>
                  <p className="text-sm" style={{ color: '#5C544E', fontFamily: 'Nunito, sans-serif' }}>
                    Nutrition Counseling Flipbook
                  </p>
                </div>
              </button>
            </div>
          </div>
        </nav>

        <FlipbookViewer />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FDFBF7', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #C05621 0%, #D97706 100%)', color: 'white' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                <BookOpen size={64} />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'Merriweather, serif' }}>
              Suposhan Sakhi
            </h1>
            <p className="text-2xl md:text-3xl mb-4" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Digital Flipbook for Nutrition Counseling
            </p>
            <p className="text-lg md:text-xl mb-8 opacity-90" style={{ fontFamily: 'Nunito, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
              A comprehensive nutrition counseling guide for community health workers serving rural Maharashtra families.
            </p>
            <button
              onClick={() => setShowViewer(true)}
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-2xl transform hover:scale-105"
              style={{ backgroundColor: '#ECB939', color: '#2D241E' }}
              data-testid="start-viewing-button"
            >
              Start Viewing Flipbook
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: '#2D241E', fontFamily: 'Merriweather, serif' }}>
            What's Inside
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6">
              <div className="inline-flex p-4 rounded-full mb-4" style={{ backgroundColor: '#F5F5F0' }}>
                <BookOpen size={48} style={{ color: '#C05621' }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2D241E', fontFamily: 'Merriweather, serif' }}>
                24 Interactive Pages
              </h3>
              <p style={{ color: '#5C544E', fontFamily: 'Nunito, sans-serif' }}>
                Comprehensive coverage of maternal and child nutrition topics with visual guidance.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex p-4 rounded-full mb-4" style={{ backgroundColor: '#F5F5F0' }}>
                <Users size={48} style={{ color: '#556B2F' }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2D241E', fontFamily: 'Merriweather, serif' }}>
                Family-Friendly Visuals
              </h3>
              <p style={{ color: '#5C544E', fontFamily: 'Nunito, sans-serif' }}>
                Culturally authentic illustrations designed for rural Maharashtra families.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex p-4 rounded-full mb-4" style={{ backgroundColor: '#F5F5F0' }}>
                <UserCheck size={48} style={{ color: '#ECB939' }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#2D241E', fontFamily: 'Merriweather, serif' }}>
                Sakhi Counseling Guide
              </h3>
              <p style={{ color: '#5C544E', fontFamily: 'Nunito, sans-serif' }}>
                Practical counseling prompts with Ask & Action boxes for effective conversations.
              </p>
            </div>
          </div>

          {/* Topics Covered */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-16" style={{ borderTop: '6px solid #C05621' }}>
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#C05621', fontFamily: 'Merriweather, serif' }}>
              Topics Covered
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Exclusive Breastfeeding (6 spreads)',
                'Complementary Feeding (5 spreads)',
                'MUAC Measurement & Malnutrition (4 spreads)',
                'Maternal Nutrition & Anemia (4 spreads)',
                'Hygiene & Health Practices (3 spreads)',
                'Deworming & Immunization',
              ].map((topic, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F5F5F0' }}>
                  <div className="mt-1" style={{ color: '#556B2F' }}>✓</div>
                  <span style={{ color: '#2D241E', fontFamily: 'Nunito, sans-serif', fontWeight: '500' }}>{topic}</span>
                </div>
              ))}</div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-16" style={{ backgroundColor: '#F5F5F0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#2D241E', fontFamily: 'Merriweather, serif' }}>
              Download High-Quality Images
            </h2>
            <p className="text-lg" style={{ color: '#5C544E', fontFamily: 'Nunito, sans-serif' }}>
              Download all pages as high-quality PNG images (ZIP format)
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <DownloadCard
              title="Full Flipbook"
              description="Complete flipbook with both Family-facing images and Sakhi counseling pages as high-quality images."
              pageCount="48 images"
              onDownload={() => handleDownload('full')}
              icon={BookOpen}
            />
            <DownloadCard
              title="Sakhi Pages Only"
              description="Counseling guide pages with Ask & Action prompts - perfect for training community health workers."
              pageCount="24 images"
              onDownload={() => handleDownload('sakhi')}
              icon={UserCheck}
            />
            <DownloadCard
              title="Family Pages Only"
              description="Family-facing illustration pages with key nutrition messages - ideal for printing and distribution."
              pageCount="24 images"
              onDownload={() => handleDownload('family')}
              icon={Users}
            />
          </div>

          {isGenerating && (
            <div className="text-center mt-8">
              <div className="inline-block p-6 rounded-lg shadow-lg" style={{ backgroundColor: 'white' }}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 mx-auto mb-4" style={{ borderColor: '#C05621' }}></div>
                <p className="text-lg font-semibold mb-2" style={{ color: '#C05621', fontFamily: 'Nunito, sans-serif' }}>
                  {progress}
                </p>
                <p className="text-sm" style={{ color: '#5C544E', fontFamily: 'Nunito, sans-serif' }}>
                  This may take a few moments...
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t" style={{ backgroundColor: 'white', borderColor: '#E5E0D8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p style={{ color: '#5C544E', fontFamily: 'Nunito, sans-serif' }}>
            Developed by Britannia Nutrition Foundation & Idobro Impact Solutions | Version 2.0 | 2026
          </p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;
