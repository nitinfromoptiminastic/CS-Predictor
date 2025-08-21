'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Upload, Image as ImageIcon, Video, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export function FileUpload({ onFileSelect, selectedFile }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      onFileSelect(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi', '.webm']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 * 1024 // 5GB
  });

  const handleRemove = () => {
    onFileSelect(null);
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      {selectedFile ? (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200 shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                {selectedFile.type.startsWith('image/') ? (
                  <ImageIcon className="h-5 w-5 text-white" />
                ) : (
                  <Video className="h-5 w-5 text-white" />
                )}
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-900 block">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-gray-600">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type.split('/')[0].toUpperCase()}
                </span>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="text-red-400 hover:text-red-600 hover:bg-red-100 p-2 rounded-full transition-all duration-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {preview && (
            <div className="mt-4 flex justify-center">
              <div className="relative overflow-hidden rounded-xl shadow-md">
                <Image 
                  src={preview} 
                  alt={`Preview of ${selectedFile.name}`}
                  width={300}
                  height={200}
                  className="max-w-full h-48 object-cover"
                />
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-center mt-4 text-green-700 bg-green-100 rounded-lg py-2 px-4">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            File uploaded successfully
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`relative group border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 hover:shadow-lg ${
            isDragActive
              ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg scale-105'
              : 'border-gray-300 hover:border-blue-400 bg-gradient-to-br from-gray-50 to-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50'
          }`}
        >
          <input {...getInputProps()} />
          
          {/* Floating elements */}
          <div className="absolute top-4 right-4 w-3 h-3 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute top-8 left-6 w-2 h-2 bg-purple-400 rounded-full opacity-40 animate-bounce"></div>
          <div className="absolute bottom-6 right-8 w-2 h-2 bg-green-400 rounded-full opacity-50 animate-pulse"></div>
          
          <div className="relative">
            <div className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
              isDragActive 
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 scale-110' 
                : 'bg-gradient-to-r from-gray-400 to-gray-500 group-hover:from-blue-500 group-hover:to-indigo-500 group-hover:scale-110'
            }`}>
              <Upload className="h-10 w-10 text-white" />
            </div>
            
            {isDragActive ? (
              <div className="space-y-2">
                <p className="text-xl font-semibold text-blue-600 animate-bounce">Drop it like it&apos;s hot! 🔥</p>
                <p className="text-blue-500">Release to upload your asset</p>
              </div>
            ) : (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
                  Upload Your Marketing Asset
                </h4>
                <p className="text-gray-600 group-hover:text-blue-700 transition-colors">
                  Drag & drop your file here, or click to browse
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">Images</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">Videos</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Up to 5GB</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
