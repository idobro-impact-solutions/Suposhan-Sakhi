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

  const downloadCurrentPage = async () => {
    setIsDownloading(true);

    try {
      const sourceElement = isFlipped ? sakhiCardRef.current : familyCardRef.current;

      if (!sourceElement) {
        alert('Unable to capture page. Please try again.');
        setIsDownloading(false);
        return;
      }

      // create off-screen container sized to the source element
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = `${sourceElement.offsetWidth}px`;
      container.style.height = `${sourceElement.offsetHeight}px`;
      container.style.background = isFlipped ? '#FDFBF7' : 'transparent';
      container.style.overflow = 'hidden';
      container.style.margin = '0';
      container.style.padding = '0';

      // deep clone the node so we do not affect live DOM
      const clone = sourceElement.cloneNode(true);

      // Force-remove transforms from clone root and make it relative
      clone.style.transform = 'none';
      clone.style.backfaceVisibility = 'visible';
      clone.style.position = 'relative';
      clone.style.left = '0';
      clone.style.top = '0';
      clone.style.width = '100%';
      clone.style.height = '100%';

      // Remove transforms/backface from all descendant nodes (important to neutralize rotateY inheritance)
      clone.querySelectorAll('*').forEach((el) => {
        // override with inline styles so CSS classes won't reintroduce transforms
        el.style.transform = 'none';
        el.style.backfaceVisibility = 'visible';
      });

      container.appendChild(clone);
      document.body.appendChild(container);

      // wait for fonts to be ready (prevents text-shift in capture)
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      // Wait for all images in the clone to finish loading (or error)
      const images = clone.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      // slight delay to ensure browser painted after mutation
      await new Promise((resolve) => setTimeout(resolve, 250));

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,                // ask html2canvas to try CORS-enabled fetching
        backgroundColor: isFlipped ? '#FDFBF7' : null,
        logging: false,
      });

      // remove offscreen container
      document.body.removeChild(container);

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
    } catch (err) {
      console.error('Error downloading page:', err);
      alert('Error downloading page. Please try again.');
      setIsDownloading(false);
    }
  };

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
              className="rounded-xl shadow-2xl overflow-hidden border p-6 md:p-8"
            >
              <div className="h-full overflow-y-auto" data-testid={`sakhi-side-content-${currentPage + 1}`}>
                {/* Header Bar */}
                <div className="mb-4 p-2 md:p-3 rounded-lg" style={{ backgroundColor: '#C05621' }}>
                  <h3 className="text-white font-bold text-center text-sm md:text-base" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Suposhan Sakhi - Nutrition Counseling Guide | Page {currentPage + 1} of {flipbookData.length}
                  </h3>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: '#C05621', fontFamily: 'Merriweather, serif' }}>
                  {currentSpread.sakhiSide.title}
                </h2>
                <div className="w-full h-1 mb-4 rounded" style={{ backgroundColor: '#ECB939' }} />

                <div className="space-y-3 md:space-y-4">
                  <div>
                    <h3 className="text-base md:text-lg font-semibold mb-1" style={{ color: '#556B2F', fontFamily: 'Nunito, sans-serif' }}>
                      Key Information:
                    </h3>
                    <p className="leading-snug md:leading-relaxed" style={{ color: '#2D241E', fontFamily: 'Nunito, sans-serif', fontSize: '1.05rem' }}>
                      {currentSpread.sakhiSide.body}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border-l-4" style={{ backgroundColor: '#FFF8E1', borderColor: '#ECB939' }}>
                    <h3 className="text-base md:text-lg font-semibold mb-1" style={{ color: '#C05621', fontFamily: 'Nunito, sans-serif' }}>
                      Ask:
                    </h3>
                    <p className="leading-snug md:leading-relaxed" style={{ color: '#2D241E', fontFamily: 'Nunito, sans-serif' }}>
                      {currentSpread.sakhiSide.ask}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#556B2F', color: 'white' }}>
                    <h3 className="text-base md:text-lg font-semibold mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      Action:
                    </h3>
                    <p className="leading-snug md:leading-relaxed" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      {currentSpread.sakhiSide.action}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 p-2 rounded" style={{ backgroundColor: '#F5F5F0' }}>
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
