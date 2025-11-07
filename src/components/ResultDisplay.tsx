'use client';

import { useState } from 'react';
import { GeneratedResult, DownloadOptions } from '@/types';
import { formatProcessingTime } from '@/lib/utils';

interface ResultDisplayProps {
  result: GeneratedResult;
  onDownload: (options: DownloadOptions) => void;
  onGenerateAnother: () => void;
  className?: string;
}

export function ResultDisplay({
  result,
  onDownload,
  onGenerateAnother,
  className = '',
}: ResultDisplayProps) {
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpeg'>('png');
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  const imageUrl = result.imageUrl || `data:image/png;base64,${result.imageBase64}`;

  const handleDownload = () => {
    onDownload({
      format: downloadFormat,
      quality: downloadFormat === 'jpeg' ? 0.95 : undefined,
    });
    setShowDownloadOptions(false);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 ${className}`}>
      {/* Success Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Colorization Complete!
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Processed in {formatProcessingTime(result.processingTime)}
        </p>
      </div>

      {/* Colorized Image */}
      <div className="mb-6">
        <div className="relative rounded-xl overflow-hidden border-2 border-purple-200 dark:border-purple-700">
          <img
            src={imageUrl}
            alt="Colorized manga panel"
            className="w-full h-auto max-h-[600px] object-contain bg-gray-50 dark:bg-gray-900"
          />
        </div>
      </div>

      {/* Description */}
      {result.description && (
        <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold">AI Description:</span> {result.description}
          </p>
        </div>
      )}

      {/* Metadata */}
      {result.metadata && (
        <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">Model Used</p>
            <p className="font-medium text-gray-900 dark:text-white">{result.metadata.modelUsed}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">Generated At</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {result.generatedAt.toLocaleTimeString()}
            </p>
          </div>
        </div>
      )}

      {/* Download Options */}
      {showDownloadOptions && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Download Format
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="png"
                  checked={downloadFormat === 'png'}
                  onChange={(e) => setDownloadFormat(e.target.value as 'png' | 'jpeg')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">PNG (Lossless)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="jpeg"
                  checked={downloadFormat === 'jpeg'}
                  onChange={(e) => setDownloadFormat(e.target.value as 'png' | 'jpeg')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">JPEG (Smaller)</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          onClick={() => {
            if (showDownloadOptions) {
              handleDownload();
            } else {
              setShowDownloadOptions(true);
            }
          }}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {showDownloadOptions ? 'Download Now' : 'Download Image'}
          </span>
        </button>

        <button
          type="button"
          onClick={onGenerateAnother}
          className="flex-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-3 px-6 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Colorize Another
          </span>
        </button>
      </div>

      {showDownloadOptions && (
        <button
          type="button"
          onClick={() => setShowDownloadOptions(false)}
          className="mt-4 w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
