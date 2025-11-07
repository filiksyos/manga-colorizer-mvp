'use client';

import { useEffect, useState } from 'react';

interface LoadingDisplayProps {
  stage: 'preparing' | 'uploading' | 'processing' | 'generating' | 'finishing';
  estimatedTime?: number; // in seconds
  onCancel?: () => void;
  showCancel?: boolean;
  className?: string;
}

export function LoadingDisplay({
  stage,
  estimatedTime = 30,
  onCancel,
  showCancel = false,
  className = '',
}: LoadingDisplayProps) {
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const stageMessages = {
    preparing: 'Preparing your manga panel...',
    uploading: 'Uploading image to AI server...',
    processing: 'Analyzing manga panel...',
    generating: 'AI is colorizing your manga...',
    finishing: 'Finalizing colorized image...',
  };

  const stageProgress = {
    preparing: 10,
    uploading: 25,
    processing: 40,
    generating: 75,
    finishing: 95,
  };

  useEffect(() => {
    // Update progress based on stage
    const targetProgress = stageProgress[stage];
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < targetProgress) {
          return Math.min(prev + 1, targetProgress);
        }
        return prev;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [stage]);

  useEffect(() => {
    // Track elapsed time
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const remainingTime = Math.max(0, estimatedTime - elapsedTime);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 ${className}`}>
      {/* Loading Animation */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-800 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-purple-600 dark:border-purple-400 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Colorizing Your Manga
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {stageMessages[stage]}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Time Estimate */}
      <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-700 dark:text-gray-300">Elapsed time:</span>
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">{elapsedTime}s</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-gray-700 dark:text-gray-300">Estimated remaining:</span>
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">{remainingTime}s</span>
        </div>
      </div>

      {/* Stage Indicators */}
      <div className="mb-6 space-y-2">
        {(['preparing', 'uploading', 'processing', 'generating', 'finishing'] as const).map((s) => {
          const isComplete = stageProgress[s] < stageProgress[stage] || s === stage;
          const isCurrent = s === stage;
          
          return (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isComplete
                    ? 'bg-purple-600 dark:bg-purple-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                {isComplete && !isCurrent && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {isCurrent && (
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                )}
              </div>
              <span
                className={`text-sm transition-colors duration-300 ${
                  isComplete
                    ? 'text-gray-900 dark:text-white font-medium'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {stageMessages[s]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Cancel Button */}
      {showCancel && onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-3 px-6 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-red-400 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
