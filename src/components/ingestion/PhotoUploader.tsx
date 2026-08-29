import React, { useState } from 'react';
import { Camera, AlertCircle, Sparkles, Check, Image as ImageIcon } from 'lucide-react';
import { analyzeInfrastructureImage, CVAnalysisResult } from '../../services/ai/computerVision';

interface PhotoUploaderProps {
  onCVComplete?: (result: CVAnalysisResult, photoUrl: string) => void;
  onAnalysisComplete?: (result: CVAnalysisResult, photoUrl: string) => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onCVComplete, onAnalysisComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CVAnalysisResult | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const samplePhotos = [
    {
      title: 'Broken Culvert Bridge',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80',
      category: 'road'
    },
    {
      title: 'Water Main Leak',
      url: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=600&q=80',
      category: 'water'
    },
    {
      title: 'Charred Transformer',
      url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80',
      category: 'electric'
    }
  ];

  const notifyComplete = (result: CVAnalysisResult, url: string) => {
    if (onAnalysisComplete) onAnalysisComplete(result, url);
    if (onCVComplete) onCVComplete(result, url);
  };

  const handleSelectSamplePhoto = async (sample: { title: string; url: string; category: string }) => {
    setPhotoPreview(sample.url);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const result = await analyzeInfrastructureImage(sample.category);
    setAnalysisResult(result);
    setIsAnalyzing(false);
    notifyComplete(result, sample.url);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
      setIsAnalyzing(true);
      setAnalysisResult(null);

      const result = await analyzeInfrastructureImage(file);
      setAnalysisResult(result);
      setIsAnalyzing(false);
      notifyComplete(result, previewUrl);
    }
  };

  return (
    <div className="bg-[#0D1B2A] border border-white/10 rounded-xl p-5 text-on-surface space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-primary-container" />
          <h4 className="font-bold text-sm font-headline-lg text-on-surface">Computer Vision Damage Intelligence</h4>
        </div>
        <span className="text-[10px] bg-tertiary/15 text-tertiary border border-tertiary/30 px-2 py-0.5 rounded font-mono font-bold">
          Edge AI Vision
        </span>
      </div>

      <p className="text-xs text-on-surface-variant">
        Upload or take a photo of broken infrastructure. The model automatically classifies damage severity, structural risks, and recommended scheme category.
      </p>

      {/* Upload Drop Area or Sample Clicker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upload Input */}
        <label className="border-2 border-dashed border-white/15 hover:border-primary-container/60 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition bg-surface-container-low hover:bg-surface-container-high/40">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Camera className="w-8 h-8 text-primary-container mb-2" />
          <span className="font-bold text-xs text-on-surface font-headline-lg">Take Photo / Upload Image</span>
          <span className="text-[10px] text-on-surface-variant mt-0.5">JPEG, PNG from mobile or camera</span>
        </label>

        {/* Sample Photo Presets for Quick Testing */}
        <div className="space-y-2">
          <span className="text-[10px] text-on-surface-variant uppercase font-mono block">Or Test with Sample Incident:</span>
          <div className="grid grid-cols-3 gap-2">
            {samplePhotos.map((s, i) => (
              <div
                key={i}
                onClick={() => handleSelectSamplePhoto(s)}
                className="cursor-pointer border border-white/10 rounded-lg overflow-hidden group hover:border-primary-container transition bg-surface-container-low"
              >
                <img src={s.url} alt={s.title} className="w-full h-12 object-cover group-hover:scale-105 transition" />
                <span className="text-[9px] text-on-surface-variant block p-1 truncate text-center">{s.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Result */}
      {isAnalyzing && (
        <div className="p-4 bg-surface-container-low rounded-xl border border-white/5 flex items-center justify-center gap-2 text-xs text-primary-container">
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>Analyzing photo with Edge Computer Vision Model...</span>
        </div>
      )}

      {analysisResult && (
        <div className="p-4 bg-surface-container-low rounded-xl border border-tertiary-container/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-tertiary flex items-center gap-1 font-headline-lg">
              <Check className="w-4 h-4" /> AI Damage Analysis Complete
            </span>
            <span className="text-xs font-mono font-bold text-primary-container">
              Severity: {analysisResult.severityRating}/10
            </span>
          </div>
          <p className="text-xs text-on-surface">{analysisResult.visualSummary}</p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {analysisResult.detectedAnomalies.map((a, i) => (
              <span key={i} className="text-[10px] bg-[#071327] text-on-surface px-2 py-0.5 rounded border border-white/10">
                🔍 {a}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
