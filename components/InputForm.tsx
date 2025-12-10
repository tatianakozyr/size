import React, { useState, useRef } from 'react';
import { UserInput, AppTranslations } from '../types';
import { Camera, Upload, Ruler, Weight } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
  t: AppTranslations;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, t }) => {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Height and Image are required, Weight is optional
    if (height && image) {
      onSubmit({ height, weight, image });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-xl mx-auto">
      
      {/* Image Upload Area */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-700 ml-1">{t.photoLabel}</label>
        <div 
            className={`relative flex flex-col items-center justify-center w-full min-h-[400px] border-2 border-dashed rounded-3xl transition-all duration-300 overflow-hidden shadow-sm
                ${isDragging ? 'border-violet-500 bg-violet-50 scale-[1.01]' : ''}
                ${preview ? 'border-transparent bg-slate-900 shadow-xl' : 'border-violet-200/60 bg-white/50 hover:border-violet-400 hover:bg-white hover:shadow-md cursor-pointer'}
            `}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => !preview && fileInputRef.current?.click()}
        >
            {preview ? (
                <div className="relative w-full h-full flex items-center justify-center p-2 bg-slate-900">
                    <img 
                        src={preview} 
                        alt="Preview" 
                        className="max-h-[500px] w-full object-contain rounded-xl" 
                    />
                     <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); setPreview(null); setImage(null); }}
                        className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-red-500 p-2.5 rounded-full shadow-lg transition-all hover:scale-110"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-10 text-center">
                    <div className="bg-gradient-to-tr from-violet-100 to-fuchsia-100 p-5 rounded-full mb-6 shadow-inner">
                        <Camera className="w-12 h-12 text-violet-500" />
                    </div>
                    <p className="mb-2 text-xl font-bold text-slate-700">{t.dragDrop}</p>
                    <p className="mb-6 text-sm font-medium text-slate-500">{t.orClick}</p>
                    <span className="text-[10px] text-violet-400 bg-violet-50 px-3 py-1 rounded-full font-bold uppercase tracking-wider">{t.fileHint}</span>
                </div>
            )}
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageChange}
            />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Height Input */}
        <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 flex items-center gap-1.5 ml-1">
                <Ruler className="w-4 h-4 text-violet-500" /> {t.heightLabel}
            </label>
            <input
                type="number"
                required
                min="140"
                max="220"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all shadow-sm font-semibold text-lg"
                placeholder="175"
            />
        </div>

        {/* Weight Input */}
        <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 flex items-center gap-1.5 ml-1">
                <Weight className="w-4 h-4 text-fuchsia-500" /> {t.weightLabel}
            </label>
            <input
                type="number"
                min="40"
                max="150"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 outline-none transition-all shadow-sm font-semibold text-lg"
                placeholder="70"
            />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !image || !height}
        className={`w-full py-4 px-6 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.98]
            ${(isLoading || !image || !height) 
                ? 'bg-slate-300 cursor-not-allowed text-slate-100' 
                : 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:shadow-xl hover:shadow-violet-500/30 hover:brightness-110'}
        `}
      >
        {isLoading ? (
            <>
                <svg className="animate-spin -ml-1 mr-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t.analyzingBtn}
            </>
        ) : (
            <>
                <Upload className="w-5 h-5" />
                {t.analyzeBtn}
            </>
        )}
      </button>

      <p className="text-xs text-center text-slate-400 mt-4 max-w-sm mx-auto">
        {t.privacyNote}
      </p>
    </form>
  );
};

export default InputForm;