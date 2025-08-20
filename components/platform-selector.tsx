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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Select Platforms</h3>
        <div className="space-x-2">
          <button
            onClick={selectAll}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Select All
          </button>
          <button
            onClick={clearAll}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {PLATFORMS.map((platform) => {
          const IconComponent = iconMap[platform.icon as keyof typeof iconMap];
          const isSelected = selectedPlatforms.includes(platform.id);
          
          return (
            <label
              key={platform.id}
              className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => togglePlatform(platform.id)}
                className="hidden"
              />
              
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${platform.color}`}>
                <IconComponent className="h-5 w-5 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="font-medium text-gray-900">{platform.name}</div>
                <div className="text-sm text-gray-500">
                  {platform.aspectRatios.join(', ')} • {platform.textTolerance} text tolerance
                </div>
              </div>
              
              {isSelected && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </label>
          );
        })}
      </div>
      
      {selectedPlatforms.length > 0 && (
        <div className="text-sm text-gray-600">
          {selectedPlatforms.length} platform{selectedPlatforms.length > 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
}
