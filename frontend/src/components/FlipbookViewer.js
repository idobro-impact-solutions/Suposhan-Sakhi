import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Download } from 'lucide-react';
import { flipbookData } from '../data/flipbookContent';
import html2canvas from 'html2canvas';

export const FlipbookViewer = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const familyCardRef = useRef(null);
  const sakhiCardRef = useRef(null);

  const currentSpread = flipbookData[currentPage];

  const handleNext = () => {
    if (currentPage < flipbookData.length - 1) {
      setCurrentPage(currentPage + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // ---------- REPLACED FUNCTION (only this changed) ----------
  const downloadCurrentPage = async () => {
    setIsDownloading(true);

    try {
      const elementToCapture = isFlipped ? sakhiCardRef.current : familyCardRef.current;
      
      if (!elementToCapture) {
        alert('Unable to capture page. Please try again.');
        setIsDownloading(false);
        return;
      }

      // Ensure fonts are loaded
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      // Find the motion wrapper (the 3D-preserve container) and temporarily remove its transform
      // We look for an ancestor that has preserve-3d in its inline style (the motion.div sets transformStyle: 'preserve-3d')
      const motionWrapper = elementToCapture.closest('[style*="preserve-3d"]');

      let originalWrapperTransform;
      if (motionWrapper) {
        originalWrapperTransform = motionWrapper.style.transform;
        motionWrapper.style.transform = 'none';
      }

      // Temporarily remove transform from the element itself (e.g., rotateY(180deg) on Sakhi)
      const originalTransform = elementToCapture.style.transform;
      elementToCapture.style.transform = 'none';

      // Wait for images to load
      const images = elementToCapture.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      // Tiny delay to ensure browser painted after removing transforms
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(elementToCapture, {
        scale: 2,
        backgroundColor: '#FDFBF7',
        useCORS: true
      });

      // Restore transforms
      elementToCapture.style.transform = originalTransform;
      if (motionWrapper) {
        motionWrapper.style.transform = originalWrapperTransform;
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const side = isFlipped ? 'Sakhi' : 'Family';
          link.download = `Suposhan_Page_${String(currentPage + 1).padStart(2, '0')}_${side}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }
        setIsDownloading(false);
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Error downloading page:', error);
      alert('Error downloading page. Please try again.');
      setIsDownloading(false);
    }
  };
  // -------------------------------------------------------------

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium" style={{ color: '#5C544E' }}>
            Page {currentPage + 1} of {flipbookData.length}
          </span>
          <span className="text-sm font-medium" style={{ color: '#5C544E' }}>
            {isFlipped ? 'Sakhi Side (Back)' : 'Family Side (Front)'}
          </span>
        </div>
        <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#F5F5F0' }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${((currentPage + 1) / flipbookData.length) * 100}%`,
              backgroundColor: '#C05621',
            }}
          />
        </div>
      </div>

      {/* Download Button for Current Page */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={downloadCurrentPage}
          disabled={isDownloading}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
          style={{ backgroundColor: '#556B2F', color: 'white' }}
          data-testid="download-current-page"
        >
          <Download size={20} />
          {isDownloading ? 'Downloading...' : `Download This ${isFlipped ? 'Sakhi' : 'Family'} Page`}
        </button>
      </div>

      {/* Flipbook Card */}
      <div className="relative" style={{ perspective: '1500px', minHeight: '600px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ rotateY: isFlipped ? 180 : 0 }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{
              transformStyle: 'preserve-3d',
              position: 'relative',
              width: '100%',
              height: '600px',
            }}
          >
            {/* Family Side (Front) */}
            <div
              ref={familyCardRef}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
              className="bg-white rounded-xl shadow-2xl overflow-hidden border"
            >
              <div className="relative w-full h-full">
                <img
                  src={currentSpread.familySide.imageUrl}
                  alt={`Page ${currentPage + 1} - Family Side`}
                  className="w-full h-full object-cover"
                  loading="eager"
                  data-testid={`family-side-image-${currentPage + 1}`}
                />
                <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/50 to-transparent">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Merriweather, serif' }}>
                    {currentSpread.familySide.headline}
                  </h2>
                  {currentSpread.familySide.subtitle && (
                    <p className="text-lg text-white/90" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      {currentSpread.familySide.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Sakhi Side (Back) */}
            <div
              ref={sakhiCardRef}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                backgroundColor: '#FDFBF7',
              }}
              className="rounded-xl shadow-2xl overflow-hidden border p-8 md:p-12"
            >
              <div className="h-full overflow-y-auto" data-testid={`sakhi-side-content-${currentPage + 1}`}>
                {/* Header Bar */}
                <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#C05621' }}>
                  <h3 className="text-white font-bold text-center" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Suposhan Sakhi - Nutrition Counseling Guide | Page {currentPage + 1} of {flipbookData.length}
                  </h3>
                </div>

                <h2 className="text-3xl font-bold mb-4" style={{ color: '#C05621', fontFamily: 'Merriweather, serif' }}>
                  {currentSpread.sakhiSide.title}
                </h2>
                <div className="w-full h-1 mb-6 rounded" style={{ backgroundColor: '#ECB939' }} />

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: '#556B2F', fontFamily: 'Nunito, sans-serif' }}>
                      Key Information:
                    </h3>
                    <p className="leading-relaxed" style={{ color: '#2D241E', fontFamily: 'Nunito, sans-serif', fontSize: '1.05rem' }}>
                      {currentSpread.sakhiSide.body}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border-l-4" style={{ backgroundColor: '#FFF8E1', borderColor: '#ECB939' }}>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: '#C05621', fontFamily: 'Nunito, sans-serif' }}>
                      Ask:
                    </h3>
                    <p className="leading-relaxed" style={{ color: '#2D241E', fontFamily: 'Nunito, sans-serif' }}>
                      {currentSpread.sakhiSide.ask}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#556B2F', color: 'white' }}>
                    <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      Action:
                    </h3>
                    <p className="leading-relaxed" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      {currentSpread.sakhiSide.action}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 p-3 rounded" style={{ backgroundColor: '#F5F5F0' }}>
                  <p className="text-xs text-center italic" style={{ color: '#5C544E', fontFamily: 'Nunito, sans-serif' }}>
                    Britannia Nutrition Foundation & Idobro Impact Solutions © 2026
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: currentPage === 0 ? '#E5E0D8' : '#C05621',
            color: 'white',
          }}
          data-testid="prev-button"
        >
          <ChevronLeft size={24} />
          Previous
        </button>

        <button
          onClick={handleFlip}
          className="flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          style={{ backgroundColor: '#ECB939', color: '#2D241E' }}
          data-testid="flip-button"
        >
          <RotateCcw size={20} />
          Flip to {isFlipped ? 'Family' : 'Sakhi'} Side
        </button>

        <button
          onClick={handleNext}
          disabled={currentPage === flipbookData.length - 1}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: currentPage === flipbookData.length - 1 ? '#E5E0D8' : '#C05621',
            color: 'white',
          }}
          data-testid="next-button"
        >
          Next
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};
