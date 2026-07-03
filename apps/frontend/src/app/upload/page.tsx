import FileUpload from '@/components/FileUpload';

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Analyze Your Resume</h1>
        <p className="text-gray-400">
          Upload your resume and the job description. Our system will parse your document and match it against the job requirements instantly.
        </p>
      </div>
      <FileUpload />
    </div>
  );
}
