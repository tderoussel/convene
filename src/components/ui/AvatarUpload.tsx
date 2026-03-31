"use client";

import { useState, useRef, useCallback } from "react";

interface AvatarUploadProps {
  currentUrl: string | null | undefined;
  name: string;
  onUpload: (dataUrl: string) => void;
  onRemove: () => void;
}

function compressAndCropImage(
  file: File,
  maxSize: number = 400
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        // Square crop from center
        const size = Math.min(img.width, img.height);
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        const outputSize = Math.min(size, maxSize);
        canvas.width = outputSize;
        canvas.height = outputSize;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }
        ctx.drawImage(img, sx, sy, size, size, 0, 0, outputSize, outputSize);
        resolve(canvas.toDataURL("image/webp", 0.85));
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function AvatarUpload({
  currentUrl,
  name,
  onUpload,
  onRemove,
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const processFile = useCallback(
    async (file: File) => {
      setError(null);

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Please upload a JPG, PNG, or WebP image.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("Image must be under 5MB.");
        return;
      }

      setUploading(true);
      try {
        const dataUrl = await compressAndCropImage(file);
        onUpload(dataUrl);
      } catch {
        setError("Failed to process image. Please try another.");
      } finally {
        setUploading(false);
      }
    },
    [onUpload]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  return (
    <div>
      <label className="block text-xs text-text-muted mb-2">Profile Photo</label>
      <div className="flex items-start gap-4">
        {/* Avatar Preview */}
        <div
          className={`w-20 h-20 rounded-lg shrink-0 overflow-hidden border-2 transition-colors cursor-pointer ${
            dragOver ? "border-primary" : "border-border"
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {currentUrl ? (
            <img
              src={currentUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-surface-lighter flex items-center justify-center text-xl font-medium text-text-muted">
              {initials}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-50"
            >
              {uploading ? (
                <span className="flex items-center gap-1.5">
                  <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                "Upload photo"
              )}
            </button>
            {currentUrl && (
              <button
                type="button"
                onClick={onRemove}
                className="text-xs text-text-muted hover:text-danger transition-colors px-2 py-1.5"
              >
                Remove
              </button>
            )}
          </div>
          <p className="text-[11px] text-text-muted">
            JPG, PNG, or WebP. Max 5MB. Will be cropped to square.
          </p>
          {error && <p className="text-xs text-danger">{error}</p>}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
