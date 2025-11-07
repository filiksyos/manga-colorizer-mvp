'use client';

import { useState, useCallback, useEffect } from 'react';
import { ImageUpload, ResultDisplay, ErrorDisplay, LoadingDisplay } from '@/components';
import { 
  UploadedImage, 
  GenerationState, 
  GeneratedResult, 
  ErrorState, 
  DownloadOptions 
} from '@/types';
import {
  callColorizeMangaAPI,
  convertApiResponseToResult,
  convertApiErrorToErrorState,
  downloadImage,
  generateFilename
} from '@/lib/utils';

export default function Home() {
  // Upload state - single manga panel
  const [mangaPanel, setMangaPanel] = useState<UploadedImage | null>(null);

  // Generation state management
  const [generationState, setGenerationState] = useState<GenerationState>('idle');
  const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);
  const [loadingStage, setLoadingStage] = useState<'preparing' | 'uploading' | 'processing' | 'generating' | 'finishing'>('preparing');

  // Handle image upload
  const handleMangaPanelSelect = useCallback((image: UploadedImage | null) => {
    setMangaPanel(image);
    // Reset state when changing image
    if (generationState !== 'idle') {
      setGenerationState('idle');
      setGeneratedResult(null);
      setError(null);
    }
  }, [generationState]);

  // Validation
  const canGenerate = mangaPanel && generationState !== 'loading';

  // Handle AI colorization
  const handleColorizeManga = useCallback(async () => {
    if (!mangaPanel) {
      setError({
        message: 'Please upload a manga panel before colorizing.',
        code: 'VALIDATION_ERROR',
        status: 400,
        isRetryable: false,
        timestamp: new Date()
      });
      return;
    }

    try {
      // Reset previous states
      setError(null);
      setGeneratedResult(null);
      setGenerationState('loading');
      setLoadingStage('preparing');

      // Simulate loading stages with delays for better UX
      setTimeout(() => setLoadingStage('uploading'), 1000);
      setTimeout(() => setLoadingStage('processing'), 2000);
      setTimeout(() => setLoadingStage('generating'), 8000);
      setTimeout(() => setLoadingStage('finishing'), 15000);

      // Call the API
      const response = await callColorizeMangaAPI(mangaPanel);

      if (response.success) {
        // Success - convert to result format
        const result = convertApiResponseToResult(response, {
          mangaImage: mangaPanel
        });
        setGeneratedResult(result);
        setGenerationState('success');
      } else {
        // Error - convert to error state
        const errorState = convertApiErrorToErrorState(response);
        setError(errorState);
        setGenerationState('error');
      }
    } catch (error) {
      // Handle unexpected errors
      console.error('Colorization error:', error);
      setError({
        message: 'An unexpected error occurred while colorizing your manga panel. Please try again.',
        code: 'UNEXPECTED_ERROR',
        status: 500,
        details: error instanceof Error ? error.message : 'Unknown error',
        isRetryable: true,
        timestamp: new Date()
      });
      setGenerationState('error');
    }
  }, [mangaPanel]);

  // Handle download
  const handleDownload = useCallback(async (options: DownloadOptions) => {
    if (!generatedResult) return;

    try {
      const imageUrl = generatedResult.imageUrl || 
        `data:image/png;base64,${generatedResult.imageBase64}`;
      
      const downloadOptions: DownloadOptions = {
        ...options,
        filename: options.filename || generateFilename('manga-colorized', options.format)
      };

      await downloadImage(imageUrl, downloadOptions);
    } catch (error) {
      console.error('Download error:', error);
      setError({
        message: 'Failed to download the image. Please try again.',
        code: 'DOWNLOAD_ERROR',
        status: 500,
        details: error instanceof Error ? error.message : 'Unknown download error',
        isRetryable: true,
        timestamp: new Date()
      });
    }
  }, [generatedResult]);

  // Handle retry
  const handleRetry = useCallback(() => {
    setError(null);
    setGenerationState('idle');
    handleColorizeManga();
  }, [handleColorizeManga]);

  // Handle colorize another
  const handleColorizeAnother = useCallback(() => {
    setGenerationState('idle');
    setGeneratedResult(null);
    setError(null);
    // Keep the uploaded image for convenience
  }, []);

  // Handle error dismissal
  const handleErrorDismiss = useCallback(() => {
    setError(null);
    setGenerationState('idle');
  }, []);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (mangaPanel?.previewUrl) {
        URL.revokeObjectURL(mangaPanel.previewUrl);
      }
    };
  }, [mangaPanel?.previewUrl]);

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              AI Manga Colorizer
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Transform black & white manga panels into vibrant colored images using AI.
              Upload your manga panel and watch it come to life with stunning colors!
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Upload Section - Always visible for easy access */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
              <div className="max-w-2xl mx-auto mb-8">
                {/* Manga Panel Upload */}
                <ImageUpload
                  label="Upload Manga Panel"
                  onImageSelect={handleMangaPanelSelect}
                  className="space-y-4"
                />
              </div>

              {/* Colorize Button */}
              {generationState === 'idle' && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleColorizeManga}
                    className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-12 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    disabled={!canGenerate}
                    aria-describedby={!canGenerate ? 'upload-instructions' : undefined}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                        />
                      </svg>
                      Colorize Manga Panel
                    </span>
                  </button>
                  
                  {!canGenerate && (
                    <p id="upload-instructions" className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                      Please upload a manga panel to start colorizing
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Loading State */}
            {generationState === 'loading' && (
              <LoadingDisplay
                stage={loadingStage}
                estimatedTime={45}
                onCancel={() => {
                  setGenerationState('idle');
                  setError(null);
                }}
                showCancel={true}
                className="max-w-2xl mx-auto"
              />
            )}

            {/* Error State */}
            {generationState === 'error' && error && (
              <ErrorDisplay
                error={error}
                onRetry={error.isRetryable ? handleRetry : undefined}
                onDismiss={handleErrorDismiss}
                dismissible={true}
                showDetails={true}
                className="max-w-2xl mx-auto"
              />
            )}

            {/* Success State - Result Display */}
            {generationState === 'success' && generatedResult && (
              <ResultDisplay
                result={generatedResult}
                onDownload={handleDownload}
                onGenerateAnother={handleColorizeAnother}
                className="max-w-4xl mx-auto"
              />
            )}
          </div>

          {/* Footer Information */}
          <div className="mt-16 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                How It Works
              </h2>
              <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">1. Upload Panel</h3>
                  <p>Upload a black & white manga panel or any line art you want to colorize.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">2. AI Processing</h3>
                  <p>Our AI analyzes the panel and applies beautiful, natural-looking colors.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">3. Download Result</h3>
                  <p>View, compare, and download your colorized manga panel in high quality.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
