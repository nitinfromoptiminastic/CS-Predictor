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
      <h3 className="text-lg font-medium text-gray-900">Upload Asset</h3>
      
      {selectedFile ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              {selectedFile.type.startsWith('image/') ? (
                <ImageIcon className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <Video className="h-5 w-5 text-green-600 mr-2" />
              )}
              <span className="text-sm font-medium text-gray-900">
                {selectedFile.name}
              </span>
            </div>
            <button
              onClick={handleRemove}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {preview && (
            <div className="mt-4">
              <Image 
                src={preview} 
                alt={`Preview of ${selectedFile.name}`}
                width={200}
                height={128}
                className="max-w-full h-32 object-contain rounded"
              />
            </div>
          )}
          
          <div className="text-xs text-gray-500 mt-2">
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          {isDragActive ? (
            <p className="text-blue-600">Drop the file here...</p>
          ) : (
            <>
              <p className="text-gray-600 mb-2">
                Drag & drop your asset here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Images and videos up to 5GB
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
