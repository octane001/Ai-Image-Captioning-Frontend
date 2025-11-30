import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Volume2, ImageIcon, Loader2, AlertCircle, CheckCircle, Mic, MicOff } from 'lucide-react';

export default function ImageCaptioningApp() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [detailed, setDetailed] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const speechSynthesis = window.speechSynthesis;

  const announce = (message) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  const speak = (text) => {
    if (!text) return;
    
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setCaption('');
      setAlternatives([]);
      setError('');
      announce('Image selected. Ready to generate caption.');
    }
  };

  const generateCaption = async () => {
    if (!image) {
      setError('Please select an image first');
      announce('Error: Please select an image first');
      return;
    }

    setLoading(true);
    setError('');
    setCaption('');
    setAlternatives([]);
    announce('Generating caption. Please wait.');

    const formData = new FormData();
    formData.append('file', image);
    formData.append('detailed', detailed);

    try {
      const response = await fetch('http://localhost:8000/caption', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate caption');
      }

      const data = await response.json();
      setCaption(data.caption);
      setAlternatives(data.alternative_captions || []);
      
      announce(`Caption generated: ${data.caption}`);
      
      if (autoSpeak) {
        speak(data.caption);
      }
    } catch (err) {
      const errorMsg = 'Failed to generate caption. Make sure the backend server is running.';
      setError(errorMsg);
      announce(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'u':
            e.preventDefault();
            fileInputRef.current?.click();
            break;
          case 'Enter':
            e.preventDefault();
            if (image && !loading) generateCaption();
            break;
          case 's':
            e.preventDefault();
            if (caption) speak(caption);
            break;
        }
      }
      
      if (e.key === 'Escape' && isSpeaking) {
        stopSpeaking();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [image, loading, caption, isSpeaking]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <div className="h-screen max-h-screen flex flex-col max-w-7xl mx-auto gap-4">
        
        {/* Header - Fixed Height */}
        <header className="bg-white border shadow-lg p-4 shrink-0">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <ImageIcon className="text-black" size={32} />
            Accessible Image Captioning
          </h1>
          <p className="text-black text-sm mt-1">
            AI-powered image descriptions for visually impaired users
          </p>
        </header>

        {/* Main Grid Layout - Takes remaining height */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
          
          {/* Left Column - Controls & Image Preview */}
          <div className="flex flex-col gap-4 min-h-0">
            
            {/* Controls Card */}
            <div className="bg-white border shadow-lg p-4 shrink-0">
              <div className="space-y-3">
                {/* Upload Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 bg-black text-white px-4 py-3 hover:bg-gray-700 transition-colors font-medium"
                  aria-label="Upload image from device (Ctrl+U)"
                >
                  <Upload size={20} />
                  Upload Image
                  <span className="text-xs opacity-75">(Ctrl+U)</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  aria-label="File input for image upload"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                  aria-label="Camera input for taking photo"
                />

                {/* Options */}
                <div className="flex flex-wrap gap-3 p-3 bg-gray-100 border-2 border-black">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={detailed}
                      onChange={(e) => setDetailed(e.target.checked)}
                      className="w-4 h-4"
                      aria-label="Generate detailed description"
                    />
                    <span className="text-black font-medium">Detailed</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={autoSpeak}
                      onChange={(e) => setAutoSpeak(e.target.checked)}
                      className="w-4 h-4"
                      aria-label="Automatically speak captions"
                    />
                    <span className="text-black font-medium">Auto-speak</span>
                  </label>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateCaption}
                  disabled={!image || loading}
                  className="w-full text-black bg-white px-4 border-2 border-black py-3 hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg"
                  aria-label="Generate caption (Ctrl+Enter)"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={20} />
                      Generating...
                    </span>
                  ) : (
                    <span>Generate Caption</span>
                  )}
                </button>
              </div>
            </div>

            {/* Image Preview - Flexible Height */}
            <div className="bg-white border shadow-lg p-4 flex-1 min-h-0 flex flex-col">
              <h2 className="text-lg font-bold text-gray-800 mb-3 shrink-0">
                {preview ? 'Selected Image' : 'No Image Selected'}
              </h2>
              <div className="flex-1 min-h-0 flex items-center justify-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview of selected image"
                    className="max-w-full max-h-full object-contain border border-gray-200"
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <ImageIcon size={64} className="mx-auto mb-2 opacity-50" />
                    <p>Upload an image to get started</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column - Results & Shortcuts */}
          <div className="flex flex-col gap-4 min-h-0">
            
            {/* Results Card - Flexible Height with Scroll */}
            <div className="bg-white border shadow-lg p-4 flex-1 min-h-0 flex flex-col">
              <h2 className="text-lg font-bold text-gray-800 mb-3 shrink-0">
                Results
              </h2>
              
              <div className="flex-1 overflow-y-auto space-y-4">
                {error && (
                  <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200" role="alert">
                    <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={18} />
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                {caption && (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                          <CheckCircle className="text-black" size={20} />
                          Description
                        </h3>
                        <button
                          onClick={() => isSpeaking ? stopSpeaking() : speak(caption)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors text-sm"
                          aria-label={isSpeaking ? "Stop speaking (Escape)" : "Speak caption (Ctrl+S)"}
                        >
                          {isSpeaking ? (
                            <>
                              <MicOff size={16} />
                              Stop
                            </>
                          ) : (
                            <>
                              <Volume2 size={16} />
                              Speak
                            </>
                          )}
                        </button>
                      </div>
                      
                      <div 
                        className="p-3 bg-indigo-50 border-l-4 border-indigo-600"
                        role="region"
                        aria-label="Generated caption"
                      >
                        <p className="text-base text-gray-800 leading-relaxed">{caption}</p>
                      </div>
                    </div>

                    {alternatives.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-gray-700">Alternatives</h3>
                        {alternatives.map((alt, idx) => (
                          <div
                            key={idx}
                            className="p-2 bg-gray-50 border border-gray-200"
                            role="region"
                            aria-label={`Alternative description ${idx + 1}`}
                          >
                            <p className="text-sm text-gray-700">{alt}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {!caption && !error && (
                  <div className="text-center text-gray-400 py-8">
                    <p>Caption will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Keyboard Shortcuts - Fixed Height */}
            <div className="bg-white border shadow-lg p-3 shrink-0">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Keyboard Shortcuts</h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div><kbd className="px-2 py-1 bg-gray-100">Ctrl+U</kbd> Upload</div>
                <div><kbd className="px-2 py-1 bg-gray-100">Ctrl+Enter</kbd> Generate</div>
                <div><kbd className="px-2 py-1 bg-gray-100">Ctrl+S</kbd> Speak</div>
                <div><kbd className="px-2 py-1 bg-gray-100">Esc</kbd> Stop</div>
              </div>
            </div>

          </div>

        </div>

      </div>

      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true"></div>
    </div>
  );
}