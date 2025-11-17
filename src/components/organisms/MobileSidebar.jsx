import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MobileSidebar = ({ isOpen, onClose }) => {
  const navItems = [
    {
      name: "Projects",
      path: "/projects",
      icon: "FolderOpen"
    },
    {
      name: "Assets", 
      path: "/assets",
      icon: "Image"
    },
    {
      name: "Timeline",
      path: "/timeline", 
      icon: "Calendar"
    }
  ];

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-slate-700 transform transition-transform duration-300 ease-in-out lg:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Film" size={18} className="text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-100 text-sm">VFX Studio</h2>
            <p className="text-xs text-slate-400">Manager</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors duration-200"
        >
          <ApperIcon name="X" size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary/10 text-primary border-l-4 border-primary"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-700/50"
              )
            }
          >
            {({ isActive }) => (
              <>
                <ApperIcon
                  name={item.icon}
                  size={20}
                  className={cn(
                    "transition-colors duration-200",
                    isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-100"
                  )}
                />
                <span className="font-medium">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default MobileSidebar;