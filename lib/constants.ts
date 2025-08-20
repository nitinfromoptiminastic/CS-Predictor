import { PlatformConfig } from '@/types';

export const PLATFORMS: PlatformConfig[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'Instagram',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    aspectRatios: ['1:1', '4:5', '9:16'],
    textTolerance: 'medium',
    visualTone: ['aesthetic', 'lifestyle', 'authentic', 'vibrant']
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'Facebook',
    color: 'bg-blue-600',
    aspectRatios: ['16:9', '1:1', '4:5'],
    textTolerance: 'high',
    visualTone: ['informative', 'community', 'relatable', 'trustworthy']
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: 'Twitter',
    color: 'bg-black',
    aspectRatios: ['16:9', '2:1'],
    textTolerance: 'low',
    visualTone: ['concise', 'trending', 'conversational', 'bold']
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: 'Music',
    color: 'bg-black',
    aspectRatios: ['9:16'],
    textTolerance: 'low',
    visualTone: ['dynamic', 'trendy', 'entertaining', 'youthful']
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    icon: 'Camera',
    color: 'bg-yellow-400',
    aspectRatios: ['9:16'],
    textTolerance: 'low',
    visualTone: ['casual', 'fun', 'ephemeral', 'personal']
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'Linkedin',
    color: 'bg-blue-700',
    aspectRatios: ['16:9', '1:1'],
    textTolerance: 'high',
    visualTone: ['professional', 'authoritative', 'educational', 'corporate']
  }
];
