import React, { useRef, ChangeEvent } from 'react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button"

interface FileUploadButtonProps {
  className: string;
  onFileSelect: (file: File) => void;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({ className, onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onFileSelect(event.target.files[0]);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        type="button"
        className={className}
        onClick={handleButtonClick}
      >
        File Upload
      </Button>
    </>
  );
};

export default function FileButton() {
  const handleFileSelect = (file: File) => {
    console.log('Selected file:', file.name);
    // Handle file upload logic here
  };

  return (
    <FileUploadButton
      className={cn("font-light bg-gray-350 transition duration-150 ease-in-out hover:bg-gray-400 active:scale-95 ")}
      onFileSelect={handleFileSelect}
    />
  );
}
