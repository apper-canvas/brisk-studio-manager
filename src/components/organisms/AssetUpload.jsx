import { useState, useRef } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const AssetUpload = ({ onAssetUpload, projectId = null }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    if (files.length === 0) return;

    const allowedTypes = [
      "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp",
      "video/mp4", "video/avi", "video/mov", "video/wmv",
      "application/octet-stream", // For 3D model files
      "model/gltf+json", "model/gltf-binary"
    ];

    const validFiles = files.filter(file => {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        toast.error(`File ${file.name} is too large (max 100MB)`);
        return false;
      }
      
      const isValidType = allowedTypes.includes(file.type) || 
                         file.name.toLowerCase().endsWith('.obj') ||
                         file.name.toLowerCase().endsWith('.fbx') ||
                         file.name.toLowerCase().endsWith('.blend') ||
                         file.name.toLowerCase().endsWith('.max');
      
      if (!isValidType) {
        toast.error(`File ${file.name} is not a supported format`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of validFiles) {
        const asset = {
          fileName: file.name,
          fileType: file.type || "application/octet-stream",
          fileSize: file.size,
          projectId: projectId,
          uploadDate: new Date().toISOString(),
          thumbnailUrl: null, // In real app, this would be generated
          tags: []
        };

        // Simulate file processing delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await onAssetUpload(asset);
      }

      toast.success(`Successfully uploaded ${validFiles.length} file(s)`);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error("Failed to upload files");
    } finally {
      setIsUploading(false);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer",
          isDragging 
            ? "border-primary bg-primary/5 scale-105" 
            : "border-slate-600 hover:border-slate-500 hover:bg-slate-800/50",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!isUploading ? openFileDialog : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.obj,.fbx,.blend,.max,.gltf,.glb"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        <div className="space-y-4">
          <div className={cn(
            "w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors duration-200",
            isDragging ? "bg-primary/10 text-primary" : "bg-slate-700 text-slate-400"
          )}>
            {isUploading ? (
              <ApperIcon name="Loader2" size={32} className="animate-spin" />
            ) : (
              <ApperIcon name="Upload" size={32} />
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium text-slate-100 mb-2">
              {isUploading ? "Uploading..." : "Upload Assets"}
            </h3>
            <p className="text-slate-400 text-sm">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Supports images, videos, and 3D models (max 100MB each)
            </p>
          </div>
        </div>
      </div>

      {/* Upload Button */}
      <Button
        onClick={openFileDialog}
        disabled={isUploading}
        className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
      >
        {isUploading ? (
          <>
            <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
            Uploading...
          </>
        ) : (
          <>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Choose Files to Upload
          </>
        )}
      </Button>
    </div>
  );
};

export default AssetUpload;