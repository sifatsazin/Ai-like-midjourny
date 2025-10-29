
import React, { useState, useCallback } from 'react';
import { ImagePromptForm } from './components/ImagePromptForm';
import { ImageDisplay } from './components/ImageDisplay';
import { generateImage } from './services/geminiService';
import type { ReferenceImage } from './types';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [referenceImage, setReferenceImage] = useState<ReferenceImage | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt && !referenceImage) {
      setError('Please provide a prompt or a reference image.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageUrl = await generateImage(prompt, referenceImage);
      setGeneratedImage(imageUrl);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, referenceImage]);

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-5xl">
        <header className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-400 mb-2">Sifat Sazin</h2>
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            AI Image Generator
          </h1>
          <p className="text-gray-400 mt-2">Bring your imagination to life. Inspired by MidJourney.</p>
        </header>

        <main className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <ImagePromptForm
              prompt={prompt}
              setPrompt={setPrompt}
              setReferenceImage={setReferenceImage}
              onSubmit={handleGenerate}
              isLoading={isLoading}
              referenceImage={referenceImage}
            />
          </div>
          <div className="lg:w-2/3">
            <ImageDisplay
              generatedImage={generatedImage}
              isLoading={isLoading}
              error={error}
              prompt={prompt}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
