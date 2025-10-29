
import React from 'react';
import { DownloadIcon, ExclamationIcon, ImageIcon } from './Icons';

interface ImageDisplayProps {
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
  prompt: string;
}

const Loader: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center text-gray-400">
        <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-purple-500 border-l-purple-500 border-b-purple-500 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-lg">Generating your masterpiece...</p>
        <p className="text-sm text-gray-500">This may take a moment.</p>
    </div>
);

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ generatedImage, isLoading, error, prompt }) => {
  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      const fileName = prompt.substring(0, 30).replace(/\s+/g, '_') || 'generated_image';
      link.download = `${fileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-red-400">
          <ExclamationIcon className="w-16 h-16 mb-4" />
          <p className="text-lg font-semibold">Generation Failed</p>
          <p className="text-sm text-red-300">{error}</p>
        </div>
      );
    }
    if (generatedImage) {
      return (
        <div className="relative group aspect-square">
          <img
            src={generatedImage}
            alt={prompt || 'Generated AI image'}
            className="w-full h-full object-contain rounded-lg shadow-2xl"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center rounded-lg">
            <button
              onClick={downloadImage}
              className="flex items-center bg-white text-black font-bold py-2 px-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-100 scale-95 hover:bg-gray-200"
            >
              <DownloadIcon className="w-5 h-5 mr-2" />
              Download
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center text-center text-gray-500">
        <ImageIcon className="w-24 h-24 mb-4" />
        <p className="text-lg">Your generated image will appear here</p>
        <p className="text-sm">Enter a prompt and click "Generate"</p>
      </div>
    );
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex items-center justify-center min-h-[300px] lg:min-h-full aspect-square w-full">
      {renderContent()}
    </div>
  );
};
