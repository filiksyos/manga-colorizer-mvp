// Utility functions for manga colorization
import { 
  SupportedImageTypes, 
  FileValidationError, 
  UploadedImage, 
  ApiResponse, 
  ColorizeResponse, 
  GeneratedResult,
  DownloadOptions,
  ErrorState
} from '@/types';

// Maximum file size for image uploads (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Supported MIME types for image uploads
const SUPPORTED_IMAGE_TYPES: SupportedImageTypes[] = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp'
];

/**
 * Validate an uploaded image file
 * @param file - The File object to validate
 * @returns Object with validation result and error type if invalid
 */
export const validateImageFile = (file: File | null): {
  isValid: boolean;
  error?: FileValidationError;
} => {
  if (!file) {
    return {
      isValid: false,
      error: 'no-file-selected'
    };
  }

  // Check file type
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type as SupportedImageTypes)) {
    return {
      isValid: false,
      error: 'invalid-file-type'
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'file-too-large'
    };
  }

  return {
    isValid: true
  };
};

/**
 * Format file size for display
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Create FormData from UploadedImage for API calls
 * @param mangaImage - The uploaded manga panel image
 * @returns FormData object ready for API submission
 */
export const createFormDataFromImage = (
  mangaImage: UploadedImage
): FormData => {
  const formData = new FormData();
  formData.append('mangaImage', mangaImage.file);
  return formData;
};

/**
 * Call the colorize manga API endpoint
 * @param mangaImage - The uploaded manga panel image
 * @returns Promise resolving to API response
 */
export const callColorizeMangaAPI = async (
  mangaImage: UploadedImage
): Promise<ApiResponse> => {
  try {
    const formData = createFormDataFromImage(mangaImage);
    
    const response = await fetch('/api/colorize-manga', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error?.message || 
        `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    return validateApiResponse(data);
  } catch (error) {
    const errorDetails = handleApiError(error);
    return {
      success: false,
      error: {
        message: errorDetails.message,
        code: errorDetails.code,
        status: errorDetails.status,
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
};

/**
 * Handle and standardize API errors for consistent response format
 * @param error - The error object from API calls or processing
 * @returns Standardized error object with message and status
 */
export const handleApiError = (error: unknown): {
  message: string;
  status: number;
  code: string;
} => {
  // OpenRouter API errors
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();
    
    if (errorMessage.includes('unauthorized') || errorMessage.includes('invalid api key')) {
      return {
        message: 'Invalid API key. Please check your OpenRouter API configuration.',
        status: 401,
        code: 'INVALID_API_KEY'
      };
    }
    
    if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
      return {
        message: 'Rate limit exceeded. Please try again later.',
        status: 429,
        code: 'RATE_LIMIT_EXCEEDED'
      };
    }
    
    if (errorMessage.includes('insufficient credits') || errorMessage.includes('payment')) {
      return {
        message: 'Insufficient credits in OpenRouter account. Please add funds.',
        status: 402,
        code: 'INSUFFICIENT_CREDITS'
      };
    }
    
    if (errorMessage.includes('model') && errorMessage.includes('not available')) {
      return {
        message: 'The AI model is not available. Please try again later.',
        status: 503,
        code: 'MODEL_UNAVAILABLE'
      };
    }
    
    return {
      message: error.message || 'An unexpected error occurred while processing your request.',
      status: 500,
      code: 'PROCESSING_ERROR'
    };
  }
  
  return {
    message: 'An unknown error occurred. Please try again.',
    status: 500,
    code: 'UNKNOWN_ERROR'
  };
};

/**
 * Validate API response structure and handle edge cases
 * @param response - Raw response from API
 * @returns Validated API response
 */
export const validateApiResponse = (response: any): ApiResponse => {
  if (!response || typeof response !== 'object') {
    return {
      success: false,
      error: {
        message: 'Invalid response format from API',
        code: 'INVALID_RESPONSE',
        status: 500
      }
    };
  }

  if (response.success === false) {
    return response as ApiResponse;
  }

  if (response.success === true && response.data) {
    // Validate required fields in success response
    const { data } = response;
    if (!data.generatedImageUrl && !data.generatedImageBase64) {
      return {
        success: false,
        error: {
          message: 'API response missing generated image data',
          code: 'MISSING_IMAGE_DATA',
          status: 500
        }
      };
    }

    return response as ColorizeResponse;
  }

  return {
    success: false,
    error: {
      message: 'Unexpected API response format',
      code: 'INVALID_RESPONSE',
      status: 500
    }
  };
};

/**
 * Format processing time for user display
 * @param milliseconds - Processing time in milliseconds
 * @returns Formatted time string
 */
export const formatProcessingTime = (milliseconds: number): string => {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  }
  
  const seconds = Math.round(milliseconds / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

/**
 * Generate meaningful filename for downloaded images
 * @param prefix - Filename prefix (default: 'manga-colorized')
 * @param format - Image format
 * @returns Generated filename with timestamp
 */
export const generateFilename = (
  prefix: string = 'manga-colorized',
  format: 'png' | 'jpeg' = 'png'
): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const timeString = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
  return `${prefix}-${timestamp}-${timeString}.${format}`;
};

/**
 * Download image from URL or base64 data
 * @param imageUrl - Image URL or data URL
 * @param options - Download options
 */
export const downloadImage = async (
  imageUrl: string,
  options: DownloadOptions
): Promise<void> => {
  try {
    let blob: Blob;
    
    if (imageUrl.startsWith('data:')) {
      // Handle base64 data URL
      const response = await fetch(imageUrl);
      blob = await response.blob();
    } else {
      // Handle regular URL
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      blob = await response.blob();
    }

    // Convert to desired format if needed
    if (options.format === 'jpeg' && blob.type !== 'image/jpeg') {
      blob = await convertBlobToFormat(blob, 'image/jpeg', options.quality);
    } else if (options.format === 'png' && blob.type !== 'image/png') {
      blob = await convertBlobToFormat(blob, 'image/png');
    }

    // Create download link
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = options.filename || generateFilename('manga-colorized', options.format);
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};

/**
 * Convert blob to specified format
 * @param blob - Original blob
 * @param mimeType - Target MIME type
 * @param quality - Quality for JPEG (0-1)
 * @returns Converted blob
 */
const convertBlobToFormat = async (
  blob: Blob,
  mimeType: string,
  quality?: number
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      canvas.toBlob(
        (convertedBlob) => {
          if (convertedBlob) {
            resolve(convertedBlob);
          } else {
            reject(new Error('Failed to convert image format'));
          }
        },
        mimeType,
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image for conversion'));
    img.src = URL.createObjectURL(blob);
  });
};

/**
 * Convert ColorizeResponse to GeneratedResult for frontend use
 * @param response - API response
 * @param originalImages - Original uploaded image for metadata
 * @returns GeneratedResult object
 */
export const convertApiResponseToResult = (
  response: ColorizeResponse,
  originalImages: {
    mangaImage: UploadedImage;
  }
): GeneratedResult => {
  return {
    imageUrl: response.data.generatedImageUrl,
    imageBase64: response.data.generatedImageBase64,
    description: response.data.description,
    processingTime: response.data.processingTime,
    generatedAt: new Date(),
    metadata: {
      modelUsed: 'Gemini 2.0 Flash',
      promptVersion: '1.0',
      originalImages: {
        mangaImageName: originalImages.mangaImage.name
      }
    }
  };
};

/**
 * Convert API error response to ErrorState for frontend use
 * @param response - API error response
 * @returns ErrorState object
 */
export const convertApiErrorToErrorState = (response: any): ErrorState => {
  const isRetryable = !['INVALID_API_KEY', 'INSUFFICIENT_CREDITS'].includes(
    response.error?.code || ''
  );

  return {
    message: response.error?.message || 'An unknown error occurred',
    code: response.error?.code || 'UNKNOWN_ERROR',
    status: response.error?.status || 500,
    details: response.error?.details,
    isRetryable,
    timestamp: new Date()
  };
};
