import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { flipbookData } from '../data/flipbookContent';

export const FlipbookViewer = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

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
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#C05621', fontFamily: 'Merriweather, serif' }}>
                  {currentSpread.sakhiSide.title}
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: '#556B2F', fontFamily: 'Nunito, sans-serif' }}>
                      Key Information
                    </h3>
                    <p className="leading-relaxed" style={{ color: '#2D241E', fontFamily: 'Nunito, sans-serif', fontSize: '1.05rem' }}>
                      {currentSpread.sakhiSide.body}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#F5F5F0', borderLeft: '4px solid #ECB939' }}>
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
