import { NavLink } from "react-router-dom";
import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = () => {
  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: 'Home'
    },
    {
      name: 'Projects',
      path: '/projects',
      icon: 'FolderOpen'
    },
    {
      name: "Assets",
      path: "/assets", 
      icon: 'FolderOpen'
    },
    {
      name: "Timeline",
      path: "/timeline",
      icon: "Calendar"
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Film" size={24} className="text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-100">VFX Studio</h2>
            <p className="text-xs text-slate-400">Manager</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group relative",
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

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3 text-sm text-slate-400">
          <ApperIcon name="Settings" size={16} />
          <span>Settings</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;