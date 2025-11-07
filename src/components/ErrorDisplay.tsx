'use client';

import { ErrorState } from '@/types';

interface ErrorDisplayProps {
  error: ErrorState;
  onRetry?: () => void;
  onDismiss?: () => void;
  dismissible?: boolean;
  showDetails?: boolean;
  className?: string;
}

export function ErrorDisplay({
  error,
  onRetry,
  onDismiss,
  dismissible = true,
  showDetails = false,
  className = '',
}: ErrorDisplayProps) {
  const getErrorIcon = () => {
    if (error.code === 'RATE_LIMIT_EXCEEDED') {
      return (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      );
    }
    return (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    );
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 ${className}`}>
      {/* Error Icon */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full mb-4">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {getErrorIcon()}
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Oops! Something went wrong
        </h2>
      </div>

      {/* Error Message */}
      <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-sm font-medium text-red-800 dark:text-red-300">
          {error.message}
        </p>
      </div>

      {/* Error Details */}
      {showDetails && error.details && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-xs font-mono text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Error Code:</span> {error.code}
          </p>
          <p className="text-xs font-mono text-gray-600 dark:text-gray-400 mt-2">
            <span className="font-semibold">Details:</span> {error.details}
          </p>
          <p className="text-xs font-mono text-gray-600 dark:text-gray-400 mt-2">
            <span className="font-semibold">Time:</span> {error.timestamp.toLocaleString()}
          </p>
        </div>
      )}

      {/* Helpful Suggestions */}
      <div className="mb-6 space-y-2">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">What you can do:</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
          {error.code === 'INVALID_API_KEY' && (
            <>
              <li>Check that your OpenRouter API key is correctly set in environment variables</li>
              <li>Verify your API key is active and has the correct permissions</li>
            </>
          )}
          {error.code === 'RATE_LIMIT_EXCEEDED' && (
            <>
              <li>Wait a few minutes before trying again</li>
              <li>Consider upgrading your OpenRouter plan for higher limits</li>
            </>
          )}
          {error.code === 'INSUFFICIENT_CREDITS' && (
            <>
              <li>Add credits to your OpenRouter account</li>
              <li>Check your current credit balance</li>
            </>
          )}
          {error.isRetryable && (
            <>
              <li>Try uploading a different image</li>
              <li>Check your internet connection</li>
              <li>Try again in a few moments</li>
            </>
          )}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {error.isRetryable && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
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
              Try Again
            </span>
          </button>
        )}

        {dismissible && onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="flex-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-3 px-6 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
