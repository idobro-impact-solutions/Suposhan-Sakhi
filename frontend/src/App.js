import React, { useState } from 'react';
import '@/App.css';
import { FlipbookViewer } from './components/FlipbookViewer';
import { BookOpen, Users, UserCheck } from 'lucide-react';
import { flipbookData } from './data/flipbookContent';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [showViewer, setShowViewer] = useState(false);

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
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-16" style={{ backgroundColor: '#F5F5F0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#2D241E', fontFamily: 'Merriweather, serif' }}>
              Download Individual Pages
            </h2>
            <p className="text-lg" style={{ color: '#5C544E', fontFamily: 'Nunito, sans-serif' }}>
              View the flipbook and download each page individually using the download button on each page
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="inline-flex p-4 rounded-full mb-4" style={{ backgroundColor: '#F5F5F0' }}>
              <BookOpen size={48} style={{ color: '#C05621' }} />
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: '#2D241E', fontFamily: 'Merriweather, serif' }}>
              How to Download Pages
            </h3>
            <ol className="text-left max-w-2xl mx-auto space-y-3" style={{ color: '#5C544E', fontFamily: 'Nunito, sans-serif' }}>
              <li className="flex items-start gap-3">
                <span className="font-bold" style={{ color: '#C05621' }}>1.</span>
                <span>Click "Start Viewing Flipbook" above to open the flipbook viewer</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold" style={{ color: '#C05621' }}>2.</span>
                <span>Navigate to the page you want to download using Previous/Next buttons</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold" style={{ color: '#C05621' }}>3.</span>
                <span>Use the "Flip" button to switch between Family side (visual) and Sakhi side (counseling)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold" style={{ color: '#C05621' }}>4.</span>
                <span>Click the "Download This Page" button to save the current page as a high-quality PNG image</span>
              </li>
            </ol>
            <button
              onClick={() => setShowViewer(true)}
              className="mt-6 px-8 py-3 rounded-lg font-bold transition-all duration-200 shadow-md hover:shadow-lg"
              style={{ backgroundColor: '#C05621', color: 'white' }}
            >
              Start Viewing & Downloading
            </button>
          </div>
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
