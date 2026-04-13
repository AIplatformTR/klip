import React, { useState, useRef } from 'react';
import { Upload, Video, X } from 'lucide-react';

export default function VideoEditor() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
    }
  };

  const clearVideo = () => {
    setVideoFile(null);
    setVideoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Video Editor</h1>

      {!videoUrl ? (
        <div 
          className="border-2 border-dashed border-gray-700 rounded-2xl p-12 flex flex-col items-center justify-center min-h-[400px] cursor-pointer hover:border-red-600 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-16 h-16 text-red-600 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Upload Video</h2>
          <p className="text-gray-400">Click to upload or drag and drop your video here</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="video/*" 
            className="hidden" 
          />
        </div>
      ) : (
        <div className="bg-[#1c2333] rounded-2xl p-6 border border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Video className="text-red-600" /> {videoFile?.name}
            </h3>
            <button 
              onClick={clearVideo}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
            <video src={videoUrl} controls className="w-full h-full" />
          </div>
          <div className="mt-6 p-4 bg-gray-800 rounded-lg text-gray-400 text-center">
            Video editor tools coming soon...
          </div>
        </div>
      )}
    </div>
  );
}
