// TypeScript type definitions for manga colorizer

export interface UploadedImage {
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  type: string;
}

export interface ImageUploadProps {
  label: string;
  onImageSelect: (image: UploadedImage | null) => void;
  accept?: string;
  maxSize?: number; // in bytes
  className?: string;
}

export type FileValidationError = 
  | 'invalid-file-type'
  | 'file-too-large'
  | 'upload-failed'
  | 'no-file-selected';

export type SupportedImageTypes = 'image/jpeg' | 'image/jpg' | 'image/png' | 'image/webp';

// API Request/Response Types for Manga Colorization

export interface ColorizeRequest {
  mangaImage: File;
}

export interface ColorizeResponse {
  success: true;
  data: {
    generatedImageUrl: string;
    generatedImageBase64?: string;
    description?: string;
    processingTime: number;
  };
  message: string;
}

export interface ApiError {
  success: false;
  error: {
    message: string;
    code: string;
    status: number;
    details?: string;
  };
}

export interface ImageData {
  base64: string;
  mimeType: SupportedImageTypes;
  size: number;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface AIModelResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
    imageUrl?: string;
    imageData?: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  error?: {
    message: string;
    type: string;
    code?: string;
  };
}

// API Response Union Type
export type ApiResponse = ColorizeResponse | ApiError;

// Frontend-specific interfaces for API integration
export type GenerationState = 'idle' | 'loading' | 'success' | 'error';

export interface GeneratedResult {
  imageUrl: string;
  imageBase64?: string;
  description?: string;
  processingTime: number;
  generatedAt: Date;
  metadata?: {
    modelUsed: string;
    promptVersion: string;
    originalImages: {
      mangaImageName: string;
    };
  };
}

export interface ErrorState {
  message: string;
  code: string;
  status: number;
  details?: string;
  isRetryable: boolean;
  timestamp: Date;
}

export interface DownloadOptions {
  format: 'png' | 'jpeg';
  quality?: number; // For JPEG format (0-1)
  filename?: string;
}

export type ResponsiveBreakpoints = {
  sm: '640px';
  md: '768px';
  lg: '1024px';
  xl: '1280px';
  '2xl': '1536px';
};
