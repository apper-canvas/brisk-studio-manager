import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const AssetCard = ({ asset, onView, onDelete }) => {
  const getFileTypeIcon = (fileType) => {
    const type = fileType?.toLowerCase();
    if (type?.includes("image")) return "Image";
    if (type?.includes("video")) return "Video";
    if (type?.includes("model") || type?.includes("3d")) return "Box";
    return "File";
  };

  const getFileTypeColor = (fileType) => {
    const type = fileType?.toLowerCase();
    if (type?.includes("image")) return "success";
    if (type?.includes("video")) return "primary";
    if (type?.includes("model") || type?.includes("3d")) return "secondary";
    return "default";
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="bg-surface rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] border border-slate-700">
      {/* Thumbnail/Preview */}
      <div className="aspect-square bg-slate-700 flex items-center justify-center relative group">
        {asset.thumbnailUrl ? (
          <img 
            src={asset.thumbnailUrl} 
            alt={asset.fileName}
            className="w-full h-full object-cover"
          />
        ) : (
          <ApperIcon 
            name={getFileTypeIcon(asset.fileType)} 
            size={48} 
            className="text-slate-400" 
          />
        )}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView?.(asset)}
            className="text-white hover:bg-white/20"
          >
            <ApperIcon name="Eye" size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete?.(asset)}
            className="text-white hover:bg-red-500/20"
          >
            <ApperIcon name="Trash2" size={20} />
          </Button>
        </div>

        {/* File Type Badge */}
        <div className="absolute top-2 right-2">
          <Badge variant={getFileTypeColor(asset.fileType)}>
            {asset.fileType?.split('/')[0] || 'file'}
          </Badge>
        </div>
      </div>

      {/* Asset Info */}
      <div className="p-4">
        <h4 className="font-medium text-slate-100 mb-2 truncate">
          {asset.fileName}
        </h4>
        
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{formatFileSize(asset.fileSize)}</span>
          <span>{format(new Date(asset.uploadDate), "MMM dd")}</span>
        </div>

        {/* Tags */}
        {asset.tags && asset.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {asset.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="default" className="text-xs">
                {tag}
              </Badge>
            ))}
            {asset.tags.length > 2 && (
              <Badge variant="default" className="text-xs">
                +{asset.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetCard;