import React, { useRef, useState } from 'react';
import { Upload, X, Image, Check } from 'lucide-react';

interface FileUploadProps {
  label: string;
  accept?: string;
  currentFile?: string | null;
  onChange: (files: FileList | null) => void;
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept = "image/*",
  currentFile,
  onChange,
  error
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentFile || null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onChange(files);
    }
  };

  const removeFile = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 group ${
          dragActive
            ? 'border-indigo-400 bg-gradient-to-br from-indigo-50 to-purple-50 scale-[1.02]'
            : error
            ? 'border-red-300 bg-red-50'
            : preview
            ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50'
            : 'border-slate-300 hover:border-indigo-400 hover:bg-gradient-to-br hover:from-slate-50 hover:to-indigo-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {preview ? (
          <div className="relative group">
            <img
              src={preview}
              alt="File preview"
              className="max-h-40 mx-auto rounded-xl object-cover shadow-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-xl flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white rounded-full p-2 shadow-lg">
                <Check className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full p-2 hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <Upload className="relative mx-auto h-14 w-14 text-slate-400 group-hover:text-indigo-500 transition-colors duration-300" />
            </div>
            <div className="mt-6">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300">
                  Click to upload
                </span>{' '}
                or drag and drop
              </p>
              <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center space-x-1">
          <X className="w-4 h-4" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};