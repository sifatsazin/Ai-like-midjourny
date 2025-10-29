
import React, { useRef } from 'react';
import { UploadIcon, SparklesIcon } from './Icons';
import type { ReferenceImage } from '../types';

interface ImagePromptFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  setReferenceImage: (image: ReferenceImage | null) => void;
  onSubmit: () => void;
  isLoading: boolean;
  referenceImage: ReferenceImage | null;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // Get only the base64 part
    };
    reader.onerror = (error) => reject(error);
  });
};

export const ImagePromptForm: React.FC<ImagePromptFormProps> = ({
  prompt,
  setPrompt,
  setReferenceImage,
  onSubmit,
  isLoading,
  referenceImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setReferenceImage({ file, base64 });
      } catch (error) {
        console.error("Error converting file to base64", error);
        setReferenceImage(null);
      }
    }
  };

  const handleRemoveImage = () => {
    setReferenceImage(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4 h-full flex flex-col">
      <div className="flex-grow">
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
          Your Prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A cinematic shot of a raccoon in a library, moody lighting..."
          className="w-full h-32 p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 text-gray-200 placeholder-gray-500 resize-none"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Reference Image (Optional)
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            id="file-upload"
            disabled={isLoading}
          />
          <label
            htmlFor="file-upload"
            className={`cursor-pointer w-full flex items-center justify-center px-4 py-2 border border-dashed rounded-md transition duration-200 ${
              isLoading ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'border-gray-500 text-gray-300 hover:border-purple-500 hover:text-white'
            }`}
          >
            <UploadIcon className="w-5 h-5 mr-2" />
            <span>{referenceImage ? 'Change Image' : 'Upload Image'}</span>
          </label>
        </div>
        {referenceImage && (
          <div className="mt-3 flex items-center justify-between bg-gray-700 p-2 rounded-md">
            <span className="text-sm text-gray-300 truncate pr-2">{referenceImage.file.name}</span>
            <button
                onClick={handleRemoveImage}
                disabled={isLoading}
                className="text-gray-400 hover:text-red-400 disabled:text-gray-600 transition-colors"
                aria-label="Remove image"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            </button>
          </div>
        )}
      </div>

      <button
        onClick={onSubmit}
        disabled={isLoading || (!prompt && !referenceImage)}
        className="w-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-4 rounded-md hover:from-purple-600 hover:to-pink-600 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5 mr-2" />
            Generate
          </>
        )}
      </button>
    </div>
  );
};
