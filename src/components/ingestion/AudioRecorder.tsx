import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, CheckCircle2, RefreshCw } from 'lucide-react';
import { LanguageCode } from '../../types';

interface AudioRecorderProps {
  onTranscriptComplete: (transcript: string) => void;
  selectedLang: LanguageCode;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onTranscriptComplete,
  selectedLang
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [waveformBars, setWaveformBars] = useState<number[]>([20, 40, 60, 30, 80, 50, 70, 40, 30, 60, 45, 55]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let waveTimer: NodeJS.Timeout;

    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      waveTimer = setInterval(() => {
        setWaveformBars(Array.from({ length: 12 }, () => Math.floor(Math.random() * 80) + 20));
      }, 150);
    } else {
      setRecordingSeconds(0);
    }

    return () => {
      clearInterval(timer);
      clearInterval(waveTimer);
    };
  }, [isRecording]);

  const startRecording = () => {
    setIsRecording(true);
    setTranscript('');

    // Web Speech API fallback or Simulated Speech-to-Text for Indian Languages
    setTimeout(() => {
      let sampleTranscript = '';
      if (selectedLang === 'hi') {
        sampleTranscript = 'हमारे ग्राम पंचायत पिपरिया में नाले की मुख्य पुलिया टूट गई है, बारिश के पानी से बहुत खतरा हो रहा है।';
      } else if (selectedLang === 'mr') {
        sampleTranscript = 'धारावी प्रभाग १४ मध्ये पिण्याच्या पाण्याचे पाईप फुटले असून दूषित पाणी घरात येत आहे.';
      } else if (selectedLang === 'ml') {
        sampleTranscript = 'വയനാട് മേപ്പാടി വില്ലേജിൽ പ്രാഥമിക ആരോഗ്യ കേന്ദ്രത്തിൽ ഓക്സിജൻ സിലിണ്ടറുകളും ആംബുലൻസും ഇല്ല.';
      } else if (selectedLang === 'hinglish') {
        sampleTranscript = 'Hey team, our area Khedgaon electrical transformer has burned out. Need urgent repair!';
      } else {
        sampleTranscript = 'Main drinking water pipeline in our locality has burst, water contamination spreading fast.';
      }
      setTranscript(sampleTranscript);
      setIsRecording(false);
      onTranscriptComplete(sampleTranscript);
    }, 4500);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-slate-300">
            Voice Input (On-Device Local Audio Processing)
          </span>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-full font-medium">
          DPDP Edge Minimization
        </span>
      </div>

      <div className="flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-xl border border-slate-800/80">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 transform active:scale-95 transition"
          >
            <Mic className="w-8 h-8 text-slate-950" />
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse transform active:scale-95 transition"
          >
            <MicOff className="w-8 h-8 text-white" />
          </button>
        )}

        <div className="mt-3 text-center">
          <p className="text-xs text-slate-400 font-medium">
            {isRecording
              ? `Listening in ${selectedLang.toUpperCase()}... (${recordingSeconds}s)`
              : 'Tap microphone and speak in your language'}
          </p>
        </div>

        {/* Live Audio Waveform Animation */}
        {isRecording && (
          <div className="flex items-center justify-center gap-1 mt-4 h-8">
            {waveformBars.map((height, i) => (
              <div
                key={i}
                className="w-1.5 bg-gradient-to-t from-amber-500 to-amber-300 rounded-full transition-all duration-150"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        )}
      </div>

      {transcript && (
        <div className="mt-3 p-3 bg-slate-800/70 border border-slate-700/80 rounded-lg text-xs">
          <div className="flex items-center justify-between text-amber-400 font-semibold mb-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Speech Transcribed
            </span>
            <button
              onClick={startRecording}
              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Re-record
            </button>
          </div>
          <p className="text-slate-200 italic font-mono">"{transcript}"</p>
        </div>
      )}
    </div>
  );
};
