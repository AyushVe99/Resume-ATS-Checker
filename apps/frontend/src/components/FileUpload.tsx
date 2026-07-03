'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from '@mantine/form';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAtsStore } from '../../store/ats';
import axios from 'axios';

interface FormValues {
  file: File | null;
  jobDescription: string;
}

export default function FileUpload() {
  const router = useRouter();
  const setAnalysisResult = useAtsStore((state) => state.setAnalysisResult);
  const setIsAnalyzing = useAtsStore((state) => state.setIsAnalyzing);
  const [uploading, setUploading] = useState(false);
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

  const handleAnalyze = async (values: FormValues) => {
    setUploading(true);
    setServerError(null);
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('resume', values.file as File);
      
      const uploadRes = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const parsedResume = uploadRes.data.data;

      const analysisRes = await axios.post('http://localhost:5000/api/analyze', {
        jobDescription: values.jobDescription,
        parsedResume,
      });

      setAnalysisResult(analysisRes.data.data);
      router.push('/analysis');
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof axios.AxiosError ? err.response?.data?.message : 'Something went wrong during analysis';
      setServerError(msg || 'Something went wrong during analysis');
    } finally {
      setUploading(false);
      setIsAnalyzing(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleAnalyze)} className="w-full max-w-2xl mx-auto space-y-8">
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
          <button type="button" onClick={() => form.setFieldValue('file', null)} className="text-gray-400 hover:text-white transition-colors">
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
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {uploading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5" />
            Analyze Resume
          </>
        )}
      </button>
    </form>
  );
}
