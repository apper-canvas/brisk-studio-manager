import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const TimelineItem = ({ milestone, project, isLast = false }) => {
  return (
    <div className="relative flex items-start space-x-4">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-5 top-12 w-px h-16 bg-slate-600"></div>
      )}

      {/* Timeline Dot */}
      <div className={cn(
        "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-200",
        milestone.completed 
          ? "bg-green-500/10 border-green-500 text-green-400" 
          : "bg-slate-700 border-slate-600 text-slate-400"
      )}>
        <ApperIcon 
          name={milestone.completed ? "CheckCircle" : "Circle"} 
          size={20} 
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-slate-100 font-medium mb-1">
              {milestone.title}
            </h4>
            
            {milestone.description && (
              <p className="text-slate-400 text-sm mb-2">
                {milestone.description}
              </p>
            )}

            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 text-slate-400">
                <ApperIcon name="Calendar" size={14} />
                <span>{format(new Date(milestone.dueDate), "MMM dd, yyyy")}</span>
              </div>

              {project && (
                <div className="flex items-center space-x-1 text-slate-400">
                  <ApperIcon name="FolderOpen" size={14} />
                  <span>{project.title}</span>
                </div>
              )}
            </div>
          </div>

          <Badge 
            variant={milestone.completed ? "success" : "warning"}
            className="flex-shrink-0"
          >
            {milestone.completed ? "Completed" : "Pending"}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;