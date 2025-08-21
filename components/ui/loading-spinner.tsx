import { Loader2, Sparkles } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
        <div className="absolute -top-1 -right-1">
          <Sparkles className="h-5 w-5 text-yellow-400 animate-bounce" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-gray-900 mb-1">Loading...</p>
        <p className="text-sm text-gray-500">Preparing your experience</p>
      </div>
    </div>
  );
}
