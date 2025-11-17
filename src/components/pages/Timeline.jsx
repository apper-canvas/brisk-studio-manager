import { useState, useEffect } from "react";
import { format, isToday, isPast, isFuture } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import TimelineItem from "@/components/molecules/TimelineItem";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import milestoneService from "@/services/api/milestoneService";
import projectService from "@/services/api/projectService";

const Timeline = () => {
  const [milestones, setMilestones] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filteredMilestones, setFilteredMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterProject, setFilterProject] = useState("");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const [milestonesData, projectsData] = await Promise.all([
        milestoneService.getAll(),
        projectService.getAll()
      ]);
      setMilestones(milestonesData);
      setProjects(projectsData);
      
      // Sort milestones by due date
      const sortedMilestones = milestonesData.sort((a, b) => 
        new Date(a.dueDate) - new Date(b.dueDate)
      );
      setFilteredMilestones(sortedMilestones);
    } catch (err) {
      setError(err.message || "Failed to load timeline data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = [...milestones];

    // Filter by status
    if (filterStatus !== "all") {
      switch (filterStatus) {
        case "completed":
          filtered = filtered.filter(m => m.completed);
          break;
        case "pending":
          filtered = filtered.filter(m => !m.completed);
          break;
        case "overdue":
          filtered = filtered.filter(m => !m.completed && isPast(new Date(m.dueDate)));
          break;
        case "today":
          filtered = filtered.filter(m => isToday(new Date(m.dueDate)));
          break;
      }
    }

    // Filter by project
    if (filterProject) {
      filtered = filtered.filter(m => m.projectId === parseInt(filterProject));
    }

    // Sort by due date
    filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    setFilteredMilestones(filtered);
  }, [milestones, filterStatus, filterProject]);

  const getProject = (projectId) => {
    return projects.find(p => p.Id === projectId);
  };

  const getStatusCounts = () => {
    const completed = milestones.filter(m => m.completed).length;
    const pending = milestones.filter(m => !m.completed).length;
    const overdue = milestones.filter(m => !m.completed && isPast(new Date(m.dueDate))).length;
    const today = milestones.filter(m => isToday(new Date(m.dueDate))).length;
    
    return { completed, pending, overdue, today };
  };

  const statusCounts = getStatusCounts();
  const projectOptions = projects.map(project => ({
    value: project.Id.toString(),
    label: project.title
  }));

  if (loading) {
    return <Loading variant="list" />;
  }

  if (error) {
    return (
      <ErrorView
        title="Failed to Load Timeline"
        message={error}
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 mb-2">Timeline</h1>
          <p className="text-slate-400">
            Track project milestones and deadlines
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface rounded-lg p-4 border border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={20} className="text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100">{statusCounts.completed}</p>
              <p className="text-sm text-slate-400">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg p-4 border border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" size={20} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100">{statusCounts.pending}</p>
              <p className="text-sm text-slate-400">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg p-4 border border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertCircle" size={20} className="text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100">{statusCounts.overdue}</p>
              <p className="text-sm text-slate-400">Overdue</p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg p-4 border border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100">{statusCounts.today}</p>
              <p className="text-sm text-slate-400">Due Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-400">Filter:</span>
          <div className="flex items-center space-x-1">
            {[
              { value: "all", label: "All" },
              { value: "completed", label: "Completed" },
              { value: "pending", label: "Pending" },
              { value: "overdue", label: "Overdue" },
              { value: "today", label: "Due Today" }
            ].map((filter) => (
              <Button
                key={filter.value}
                variant={filterStatus === filter.value ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilterStatus(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="relative">
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="appearance-none bg-surface border border-slate-600 rounded-lg px-4 py-2 pr-10 text-sm text-slate-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Projects</option>
            {projectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ApperIcon 
            name="ChevronDown" 
            size={16} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" 
          />
        </div>
      </div>

      {/* Timeline */}
      {filteredMilestones.length === 0 ? (
        <Empty
          title={filterStatus !== "all" || filterProject ? "No milestones found" : "No milestones yet"}
          message={
            filterStatus !== "all" || filterProject
              ? "Try adjusting your filters to see more milestones."
              : "Milestones will appear here as you add them to your projects."
          }
          icon="Calendar"
        />
      ) : (
        <div className="bg-surface rounded-lg p-6 border border-slate-700">
          <div className="space-y-1">
            {filteredMilestones.map((milestone, index) => (
              <TimelineItem
                key={milestone.Id}
                milestone={milestone}
                project={getProject(milestone.projectId)}
                isLast={index === filteredMilestones.length - 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;