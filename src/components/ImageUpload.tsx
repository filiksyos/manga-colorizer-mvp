'use client';

import { useCallback, useState } from 'react';
import { ImageUploadProps, UploadedImage, FileValidationError } from '@/types';
import { validateImageFile, formatFileSize } from '@/lib/utils';

export function ImageUpload({
  label,
  onImageSelect,
  accept = 'image/jpeg,image/jpg,image/png,image/webp',
  maxSize = 5 * 1024 * 1024, // 5MB default
  className = '',
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedImage | null>(null);

  const getErrorMessage = (errorType: FileValidationError): string => {
    switch (errorType) {
      case 'invalid-file-type':
        return 'Invalid file type. Please upload a JPEG, PNG, or WebP image.';
      case 'file-too-large':
        return `File is too large. Maximum size is ${formatFileSize(maxSize)}.`;
      case 'no-file-selected':
        return 'Please select a file to upload.';
      case 'upload-failed':
        return 'Upload failed. Please try again.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  const handleFile = useCallback(
    (file: File) => {
      // Reset error
      setError(null);

      // Validate file
      const validation = validateImageFile(file);
      if (!validation.isValid && validation.error) {
        setError(getErrorMessage(validation.error));
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Create uploaded image object
      const uploadedImage: UploadedImage = {
        file,
        previewUrl,
        name: file.name,
        size: file.size,
        type: file.type,
      };

      setUploadedFile(uploadedImage);
      onImageSelect(uploadedImage);
    },
    [onImageSelect, maxSize]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setUploadedFile(null);
    setError(null);
    onImageSelect(null);
  }, [preview, onImageSelect]);

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>

      {/* Upload Area */}
      {!preview ? (
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            dragActive
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label={label}
          />

          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>

            <div>
              <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                {dragActive ? 'Drop your image here' : 'Drag & drop or click to upload'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Supports: JPEG, PNG, WebP (max {formatFileSize(maxSize)})
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Preview Area */
        <div className="relative rounded-xl overflow-hidden border-2 border-purple-200 dark:border-purple-700">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-contain bg-gray-50 dark:bg-gray-800"
          />

          {/* File Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="text-white text-sm font-medium truncate">{uploadedFile?.name}</p>
            <p className="text-white/80 text-xs">{uploadedFile && formatFileSize(uploadedFile.size)}</p>
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors duration-200"
            aria-label="Remove image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        </div>
      )}
    </div>
  );
}
