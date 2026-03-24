import React, { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function ResumeUpload({ onUpload, currentResume }) {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef();

  const ALLOWED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  const validateFile = (f) => {
    if (!ALLOWED_TYPES.includes(f.type)) {
      setError('Only PDF and DOCX files are allowed.');
      return false;
    }
    if (f.size > MAX_SIZE) {
      setError('File size must be under 5MB.');
      return false;
    }
    setError('');
    return true;
  };

  const handleFile = (f) => {
    if (!validateFile(f)) return;
    setFile(f);
    setUploaded(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    await new Promise(r => setTimeout(r, 1500)); // simulate upload
    setUploading(false);
    setUploaded(true);
    if (onUpload) onUpload(file);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Current Resume */}
      {currentResume && !file && (
        <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <FileText size={18} className="text-emerald-600" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-emerald-800 truncate">
              {currentResume.split('/').pop() || 'Existing Resume'}
            </p>
            <p className="text-xs text-emerald-600">Currently active resume</p>
          </div>
          <CheckCircle size={16} className="text-emerald-500" />
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          dragOver
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
        />
        <div className="flex flex-col items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            dragOver ? 'bg-primary-100' : 'bg-gray-100'
          }`}>
            <Upload size={20} className={dragOver ? 'text-primary-600' : 'text-gray-400'} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {dragOver ? 'Drop your resume here' : 'Upload your resume'}
            </p>
            <p className="text-xs text-gray-400 mt-1">PDF or DOCX • Max 5MB</p>
          </div>
          <button
            type="button"
            className="text-sm text-primary-600 hover:text-primary-800 font-medium border border-primary-200 rounded-lg px-4 py-1.5 hover:bg-primary-50 transition-colors"
          >
            Browse Files
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      {/* Selected File */}
      {file && !uploaded && (
        <div className="flex items-center gap-3 p-3 bg-primary-50 border border-primary-200 rounded-xl">
          <FileText size={18} className="text-primary-600" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-primary-800 truncate">{file.name}</p>
            <p className="text-xs text-primary-500">{formatSize(file.size)}</p>
          </div>
          <button onClick={() => setFile(null)} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Upload Button */}
      {file && !uploaded && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full btn-primary flex items-center justify-center gap-2 text-sm"
        >
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={16} />
              Upload Resume
            </>
          )}
        </button>
      )}

      {/* Success */}
      {uploaded && (
        <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <CheckCircle size={15} />
          Resume uploaded successfully!
        </div>
      )}
    </div>
  );
}
