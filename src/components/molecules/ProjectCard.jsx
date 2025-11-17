import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const ProjectCard = ({ project, onEdit, onDelete, onView }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "pre-production":
        return "pre-production";
      case "in-progress":
        return "in-progress";
      case "review":
        return "review";
      case "complete":
        return "complete";
      default:
        return "default";
    }
  };

  const formatStatus = (status) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="bg-surface rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] border border-slate-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-100 mb-2">
            {project.title}
          </h3>
          <p className="text-slate-400 text-sm mb-3">
            Client: {project.client}
          </p>
        </div>
        <Badge variant={getStatusColor(project.status)}>
          {formatStatus(project.status)}
        </Badge>
      </div>

      {project.description && (
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-slate-400 text-sm">
          <ApperIcon name="Calendar" size={16} />
          <span>Due: {format(new Date(project.dueDate), "MMM dd, yyyy")}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView?.(project)}
          >
            <ApperIcon name="Eye" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit?.(project)}
          >
            <ApperIcon name="Edit" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete?.(project)}
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;