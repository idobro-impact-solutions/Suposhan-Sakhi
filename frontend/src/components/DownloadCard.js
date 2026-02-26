import React from 'react';
import { Download, FileText } from 'lucide-react';

export const DownloadCard = ({ title, description, pageCount, onDownload, icon: Icon = FileText }) => {
  return (
    <div
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
      style={{ borderTop: '4px solid #C05621' }}
      onClick={onDownload}
      data-testid={`download-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg" style={{ backgroundColor: '#F5F5F0' }}>
          <Icon size={32} style={{ color: '#C05621' }} />
        </div>
        <div className="p-2 rounded-full" style={{ backgroundColor: '#ECB939' }}>
          <Download size={20} style={{ color: '#2D241E' }} />
        </div>
      </div>

      <h3 className="text-xl font-bold mb-2" style={{ color: '#2D241E', fontFamily: 'Merriweather, serif' }}>
        {title}
      </h3>

      <p className="text-sm mb-4" style={{ color: '#5C544E', fontFamily: 'Nunito, sans-serif' }}>
        {description}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: '#F5F5F0', color: '#556B2F' }}>
          {pageCount}
        </span>
        <button
          className="text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
          style={{ backgroundColor: '#556B2F', color: 'white' }}
          data-testid={`download-button-${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          Download ZIP
        </button>
      </div>
    </div>
  );
};
