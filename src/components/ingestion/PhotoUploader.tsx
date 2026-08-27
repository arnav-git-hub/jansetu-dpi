import React, { useState } from 'react';
import { Camera, AlertCircle, Sparkles, Check, Image as ImageIcon } from 'lucide-react';
import { analyzeInfrastructureImage, CVAnalysisResult } from '../../services/ai/computerVision';

interface PhotoUploaderProps {
  onCVComplete: (result: CVAnalysisResult, photoUrl: string) => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onCVComplete }) => {
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

  const handleSelectSamplePhoto = async (sample: { title: string; url: string; category: string }) => {
    setPhotoPreview(sample.url);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const result = await analyzeInfrastructureImage(sample.category);
    setAnalysisResult(result);
    setIsAnalyzing(false);
    onCVComplete(result, sample.url);
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
      onCVComplete(result, previewUrl);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-slate-300">
            Photo Intake & Computer Vision Severity AI
          </span>
        </div>
        <span className="text-[10px] text-amber-300 bg-amber-950 border border-amber-800 px-2 py-0.5 rounded-full font-medium">
          Low-Literacy Friendly
        </span>
      </div>

      {/* Preset Photo Sampler for Instant Hackathon Demo */}
      <div className="mb-3">
        <p className="text-[11px] text-slate-400 mb-2">Select a sample photo or upload your own:</p>
        <div className="grid grid-cols-3 gap-2">
          {samplePhotos.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSamplePhoto(s)}
              className={`relative rounded-lg overflow-hidden border transition text-left group ${
                photoPreview === s.url ? 'border-amber-400 ring-2 ring-amber-500/30' : 'border-slate-800 hover:border-slate-600'
              }`}
            >
              <img src={s.url} alt={s.title} className="w-full h-16 object-cover group-hover:scale-105 transition" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent p-1 flex items-end">
                <span className="text-[10px] font-medium text-white truncate">{s.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Upload Input */}
      <div className="relative border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-xl p-3 text-center transition bg-slate-950/40">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex items-center justify-center gap-2 text-xs text-slate-300">
          <ImageIcon className="w-4 h-4 text-amber-400" />
          <span>Upload photo from device / camera</span>
        </div>
      </div>

      {/* Analyzing Loader */}
      {isAnalyzing && (
        <div className="mt-3 p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
          <span className="text-xs text-amber-300 font-medium">
            CV Model Extracting Severity Index & Structural Hazards...
          </span>
        </div>
      )}

      {/* CV Results Breakdown */}
      {analysisResult && !isAnalyzing && (
        <div className="mt-3 p-3 bg-slate-800/90 border border-slate-700 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-400" />
              AI CV Hazard Extraction
            </span>
            <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-[11px] font-bold px-2 py-0.5 rounded-full">
              Severity: {analysisResult.severityRating}/10
            </span>
          </div>

          <p className="text-slate-300 font-medium">{analysisResult.visualSummary}</p>

          <div className="flex flex-wrap gap-1 pt-1">
            {analysisResult.detectedObjects.map((obj, i) => (
              <span key={i} className="bg-slate-900 text-slate-300 border border-slate-700 text-[10px] px-2 py-0.5 rounded">
                {obj}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-700/60">
            <span>Hazard Type: <strong className="text-slate-200">{analysisResult.hazardType}</strong></span>
            <span>CV Confidence: <strong className="text-emerald-400">{(analysisResult.confidence * 100).toFixed(0)}%</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
