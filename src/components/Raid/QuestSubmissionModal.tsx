import { FC, useState } from 'react';
import { X, Upload, Link } from 'lucide-react';
import { QuestSubmission } from '../../types/quest';

interface QuestSubmissionModalProps {
  onClose: () => void;
  onSubmit: (submission: QuestSubmission) => void;
}

export const QuestSubmissionModal: FC<QuestSubmissionModalProps> = ({ onClose, onSubmit }) => {
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!url) {
      setError('URL is required');
      return;
    }

    onSubmit({
      screenshot: screenshot || undefined,
      url
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 /90 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-[#1A1B23] rounded-xl border border-[#39FF14]/20 shadow-[0_0_20px_rgba(57,255,20,0.2)]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#39FF14]/20">
          <h3 className="text-xl font-bold text-white">Submit Quest Proof</h3>
          <button
            onClick={onClose}
            className="p-2 text-neutral-lightGray hover:text-white transition-colors rounded-lg hover:bg-[#39FF14]/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Screenshot Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-lightGray mb-2">
              Screenshot (Optional)
            </label>
            <div className="border-2 border-dashed border-[#39FF14]/20 rounded-lg p-4 text-center">
              {screenshot ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-lightGray truncate flex-1 text-left">
                    {screenshot.name}
                  </span>
                  <button
                    onClick={() => setScreenshot(null)}
                    className="ml-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-8 h-8 text-[#39FF14] mb-2" />
                  <span className="text-sm text-neutral-lightGray">
                    Click to upload or drag and drop
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setScreenshot(file);
                    }}
                  />
                </label>
              )}
            </div>
          </div>

          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-neutral-lightGray mb-2">
              URL Link (Required)
            </label>
            <div className="relative">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2 pl-4 pr-10 bg-[#013220]/40 border border-[#39FF14]/20 rounded-lg text-white placeholder-neutral-lightGray focus:outline-none focus:border-[#39FF14]/40"
              />
              <Link className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-lightGray w-4 h-4" />
            </div>
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full px-4 py-3 bg-[#39FF14] text-black font-semibold rounded-lg hover:bg-[#39FF14]/90 transition-colors shadow-[0_0_15px_rgba(57,255,20,0.3)]"
          >
            Submit Proof
          </button>
        </div>
      </div>
    </div>
  );
};