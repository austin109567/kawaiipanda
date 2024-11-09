import { FC, useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { playerService } from '../../services/playerService';

interface ProfileUploadProps {
  wallet: string;
  onUpload: () => void;
}

export const ProfileUpload: FC<ProfileUploadProps> = ({ wallet, onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        const success = playerService.setProfilePicture(wallet, imageData);
        if (success) {
          onUpload();
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileChange(file);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-neutral-charcoal/90 backdrop-blur-md"
        onClick={() => onUpload()}
      />
      <div className="relative w-full max-w-md bg-[#1A1B23] rounded-xl border border-primary-pink/20 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-primary-pink/20">
          <h3 className="text-xl font-bold text-white">Upload Profile Picture</h3>
          <button
            onClick={() => onUpload()}
            className="p-2 text-neutral-lightGray hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragging
                ? 'border-primary-pink bg-primary-pink/10'
                : 'border-primary-pink/20 hover:border-primary-pink/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileChange(file);
              }}
            />
            
            <Upload className="w-12 h-12 text-primary-pink mx-auto mb-4" />
            <p className="text-white font-medium mb-2">
              Drag and drop your image here
            </p>
            <p className="text-neutral-lightGray text-sm mb-4">
              or
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2 bg-primary-pink text-white rounded-lg hover:bg-primary-pink/90 transition-colors"
            >
              Browse Files
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};