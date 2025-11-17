import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title,
  message,
  icon = "Folder",
  action,
  actionLabel,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-slate-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-slate-100 mb-3">
        {title}
      </h3>
      
      <p className="text-slate-400 mb-8 max-w-md leading-relaxed">
        {message}
      </p>
      
      {action && actionLabel && (
        <Button 
          onClick={action}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;