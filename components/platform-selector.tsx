'use client';

import { PLATFORMS } from '@/lib/constants';
import { Instagram, Facebook, Twitter, Music, Camera, Linkedin } from 'lucide-react';

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  onPlatformChange: (platforms: string[]) => void;
}

const iconMap = {
  Instagram,
  Facebook, 
  Twitter,
  Music,
  Camera,
  Linkedin,
};

export function PlatformSelector({ selectedPlatforms, onPlatformChange }: PlatformSelectorProps) {
  const togglePlatform = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      onPlatformChange(selectedPlatforms.filter(id => id !== platformId));
    } else {
      onPlatformChange([...selectedPlatforms, platformId]);
    }
  };

  const selectAll = () => {
    onPlatformChange(PLATFORMS.map(p => p.id));
  };

  const clearAll = () => {
    onPlatformChange([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-x-3">
          <button
            onClick={selectAll}
            className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-medium transition-colors"
          >
            ✨ Select All
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {PLATFORMS.map((platform) => {
          const IconComponent = iconMap[platform.icon as keyof typeof iconMap];
          const isSelected = selectedPlatforms.includes(platform.id);
          
          return (
            <label
              key={platform.id}
              className={`group flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                isSelected
                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md scale-[1.02]'
                  : 'border-gray-200 hover:border-blue-300 bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => togglePlatform(platform.id)}
                className="hidden"
              />
              
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 shadow-md transition-transform duration-300 group-hover:scale-110 ${platform.color}`}>
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-lg">{platform.name}</div>
                <div className="text-sm text-gray-600 mt-1">
                  📐 {platform.aspectRatios.join(', ')} • 📝 {platform.textTolerance} text tolerance
                </div>
              </div>
              
              <div className={`transition-all duration-300 ${isSelected ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </label>
          );
        })}
      </div>
      
      {selectedPlatforms.length > 0 && (
        <div className="flex items-center justify-center bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl py-3 px-6 border border-green-200">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          <span className="text-green-800 font-medium">
            {selectedPlatforms.length} platform{selectedPlatforms.length > 1 ? 's' : ''} selected for analysis
          </span>
        </div>
      )}
    </div>
  );
}
