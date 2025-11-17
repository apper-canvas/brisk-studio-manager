import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ProjectCard from "@/components/molecules/ProjectCard";
import AddProjectModal from "@/components/organisms/AddProjectModal";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import projectService from "@/services/api/projectService";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const statusOptions = [
    { value: "pre-production", label: "Pre-production" },
    { value: "in-progress", label: "In Progress" },
    { value: "review", label: "Review" },
    { value: "complete", label: "Complete" }
  ];

  const loadProjects = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await projectService.getAll();
      setProjects(data);
      setFilteredProjects(data);
    } catch (err) {
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    let filtered = [...projects];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(search) ||
        project.client.toLowerCase().includes(search) ||
        project.description?.toLowerCase().includes(search)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter]);

  const handleAddProject = async (projectData) => {
    try {
      const newProject = await projectService.create(projectData);
      setProjects(prev => [newProject, ...prev]);
    } catch (error) {
      throw error;
    }
  };

  const handleEditProject = (project) => {
    toast.info("Edit functionality coming soon!");
  };

  const handleDeleteProject = async (project) => {
    if (window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
      try {
        await projectService.delete(project.Id);
        setProjects(prev => prev.filter(p => p.Id !== project.Id));
        toast.success("Project deleted successfully");
      } catch (error) {
        toast.error("Failed to delete project");
      }
    }
  };

  const handleViewProject = (project) => {
    toast.info("Project details view coming soon!");
  };

  if (loading) {
    return <Loading variant="grid" />;
  }

  if (error) {
    return (
      <ErrorView
        title="Failed to Load Projects"
        message={error}
        onRetry={loadProjects}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 mb-2">Projects</h1>
          <p className="text-slate-400">
            Manage your VFX projects and track their progress
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
        >
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Add Project
        </Button>
      </div>

      {/* Search and Filters */}
      <SearchBar
        placeholder="Search projects..."
        onSearch={setSearchTerm}
        showFilter
        filterOptions={statusOptions}
        onFilterChange={setStatusFilter}
        selectedFilter={statusFilter}
      />

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Empty
          title={searchTerm || statusFilter ? "No projects found" : "No projects yet"}
          message={
            searchTerm || statusFilter
              ? "Try adjusting your search or filter criteria."
              : "Create your first VFX project to get started with managing your studio workflow."
          }
          icon="FolderOpen"
          action={() => setIsAddModalOpen(true)}
          actionLabel="Create First Project"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.Id}
              project={project}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
              onView={handleViewProject}
            />
          ))}
        </div>
      )}

      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProjectAdd={handleAddProject}
      />
    </div>
  );
};

export default Projects;