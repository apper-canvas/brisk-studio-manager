import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* 404 Icon */}
        <div className="w-24 h-24 mx-auto bg-slate-700/50 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" size={48} className="text-slate-400" />
        </div>

        {/* Error Content */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-slate-100">404</h1>
          <h2 className="text-2xl font-semibold text-slate-300">Page Not Found</h2>
          <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
            Sorry, the page you are looking for doesn't exist or has been moved. 
            Let's get you back to managing your VFX projects.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Button
            onClick={() => navigate("/projects")}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            <ApperIcon name="Home" size={16} className="mr-2" />
            Go to Projects
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            Go Back
          </Button>
        </div>

        {/* Quick Links */}
        <div className="pt-8 border-t border-slate-700">
          <p className="text-sm text-slate-500 mb-4">Quick Navigation:</p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <button
              onClick={() => navigate("/projects")}
              className="text-slate-400 hover:text-primary transition-colors duration-200 flex items-center space-x-1"
            >
              <ApperIcon name="FolderOpen" size={14} />
              <span>Projects</span>
            </button>
            <button
              onClick={() => navigate("/assets")}
              className="text-slate-400 hover:text-primary transition-colors duration-200 flex items-center space-x-1"
            >
              <ApperIcon name="Image" size={14} />
              <span>Assets</span>
            </button>
            <button
              onClick={() => navigate("/timeline")}
              className="text-slate-400 hover:text-primary transition-colors duration-200 flex items-center space-x-1"
            >
              <ApperIcon name="Calendar" size={14} />
              <span>Timeline</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;