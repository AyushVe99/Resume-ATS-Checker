'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from '@mantine/form';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Search, FileSearch } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMatchStore } from '../../store/match';
import axios from 'axios';

interface FormValues {
  file: File | null;
  jobDescription: string;
}

interface ParsedData {
  name?: string;
  email?: string;
  phone?: string;
  skills?: unknown[];
  experience?: unknown[];
  projects?: unknown[];
  education?: unknown[];
  [key: string]: unknown;
}

export default function FileUpload() {
  const router = useRouter();
  const setAnalysisResult = useMatchStore((state) => state.setAnalysisResult);
  const setIsAnalyzing = useMatchStore((state) => state.setIsAnalyzing);
  const [step, setStep] = useState<'upload' | 'verify'>('upload');
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    initialValues: {
      file: null,
      jobDescription: '',
    },
    validate: {
      file: (value) => (value ? null : 'Please upload a resume'),
      jobDescription: (value) => (value.length >= 50 ? null : 'Job description must be at least 50 characters'),
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      form.setFieldValue('file', acceptedFiles[0]);
    }
  }, [form]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    onDropRejected: () => form.setFieldError('file', 'Invalid file type or size exceeds 10MB'),
  });

  const handleUploadAndParse = async (values: FormValues) => {
    setUploading(true);
    setServerError(null);
    setLoadingMessage('Parsing document structure...');

    try {
      const formData = new FormData();
      formData.append('resume', values.file as File);
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const uploadRes = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setParsedData(uploadRes.data.data);
      setStep('verify');
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof axios.AxiosError ? err.response?.data?.message : 'Failed to parse resume';
      setServerError(msg || 'Failed to parse resume');
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    setUploading(true);
    setServerError(null);
    setIsAnalyzing(true);
    
    setLoadingMessage('Mapping keywords against JD...');
    
    const timer1 = setTimeout(() => { setLoadingMessage('Evaluating Recruiter Confidence...'); }, 2000);
    const timer2 = setTimeout(() => { setLoadingMessage('Generating Gemini AI suggestions...'); }, 4500);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const analysisRes = await axios.post(`${API_URL}/analyze`, {
        jobDescription: form.values.jobDescription,
        parsedResume: parsedData,
      });

      setAnalysisResult(analysisRes.data.data);
      router.push('/match');
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof axios.AxiosError ? err.response?.data?.message : 'Something went wrong during analysis';
      setServerError(msg || 'Something went wrong during analysis');
      setIsAnalyzing(false);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setUploading(false);
    }
  };

  if (step === 'verify' && parsedData) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <FileSearch className="text-blue-400" /> Verify Parsed Data
          </h2>
          <p className="text-gray-400 mb-6 text-sm">
            Our engine extracted the following information from your resume. If it missed major sections, your ATS score will be lower. Please verify it looks reasonably accurate before proceeding.
          </p>

          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <span className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1 block">Contact Info</span>
              <p className="text-sm text-gray-200">Name: {parsedData.name || 'Not Found'}</p>
              <p className="text-sm text-gray-200">Email: {parsedData.email || 'Not Found'}</p>
              <p className="text-sm text-gray-200">Phone: {parsedData.phone || 'Not Found'}</p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <span className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1 block">Sections Extracted</span>
              <div className="flex gap-4 text-sm text-gray-200 mt-2">
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold text-blue-400">{parsedData.skills?.length || 0}</span>
                  <span className="text-xs text-gray-500">Skills Lines</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold text-green-400">{parsedData.experience?.length || 0}</span>
                  <span className="text-xs text-gray-500">Experience Lines</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold text-purple-400">{parsedData.projects?.length || 0}</span>
                  <span className="text-xs text-gray-500">Project Lines</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold text-yellow-400">{parsedData.education?.length || 0}</span>
                  <span className="text-xs text-gray-500">Education Lines</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={() => setStep('upload')}
              disabled={uploading}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={handleAnalyze}
              disabled={uploading}
              className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  {loadingMessage || 'Analyzing...'}
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Confirm & Analyze
                </>
              )}
            </button>
          </div>

          {serverError && (
            <div className="mt-4 flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-lg border border-red-400/20">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{serverError}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={form.onSubmit(handleUploadAndParse)} className="w-full max-w-2xl mx-auto space-y-8">
      {/* Upload Box */}
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
          isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-500 bg-gray-900/50'
        } ${form.errors.file ? 'border-red-500 bg-red-500/10' : ''}`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        {isDragActive ? (
          <p className="text-blue-400 font-medium">Drop the resume here ...</p>
        ) : (
          <div>
            <p className="text-gray-300 font-medium mb-1">Drag & drop your resume, or click to browse</p>
            <p className="text-gray-500 text-sm">Supports PDF, DOCX, TXT (Max 10MB)</p>
          </div>
        )}
      </div>
      
      {form.errors.file && <p className="text-red-400 text-sm mt-2">{form.errors.file}</p>}

      {/* File Preview */}
      {form.values.file && (
        <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3">
            <FileText className="text-blue-400" />
            <div>
              <p className="text-sm font-medium text-white">{form.values.file.name}</p>
              <p className="text-xs text-gray-400">{(form.values.file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button type="button" onClick={() => form.setFieldValue('file', null)} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Job Description Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300 flex justify-between">
          <span>Job Description</span>
          <span className={`text-xs ${form.values.jobDescription.length >= 50 ? 'text-green-400' : 'text-gray-500'}`}>
            {form.values.jobDescription.length} chars (min 50)
          </span>
        </label>
        <textarea
          {...form.getInputProps('jobDescription')}
          placeholder="Paste the job description here..."
          className={`w-full h-40 bg-gray-900 border rounded-lg p-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
            form.errors.jobDescription ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:border-transparent'
          }`}
        />
        {form.errors.jobDescription && <p className="text-red-400 text-sm">{form.errors.jobDescription}</p>}
      </div>

      {/* Server Error Message */}
      {serverError && (
        <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-lg border border-red-400/20">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{serverError}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
      >
        {uploading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            {loadingMessage || 'Parsing Document...'}
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            Parse & Verify
          </>
        )}
      </button>
    </form>
  );
}
