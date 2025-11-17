import { useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onMenuToggle }) => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
      case "/projects":
        return "Projects";
      case "/assets":
        return "Assets";
      case "/timeline":
        return "Timeline";
      default:
        return "VFX Studio Manager";
    }
  };

  return (
    <header className="h-16 bg-surface border-b border-slate-700 flex items-center justify-between px-4 lg:px-6">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors duration-200"
      >
        <ApperIcon name="Menu" size={20} />
      </button>

      {/* Header Title */}
      <div className="flex items-center space-x-3">
        <div className="hidden lg:block w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
          <ApperIcon name="Film" size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-100">
            VFX Studio Manager
          </h1>
          <p className="text-sm text-slate-400 hidden lg:block">
            {getPageTitle()}
          </p>
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center space-x-3">
        <button className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors duration-200">
          <ApperIcon name="Search" size={20} />
        </button>
        <button className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors duration-200">
          <ApperIcon name="Bell" size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;