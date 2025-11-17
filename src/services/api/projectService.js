import projectsData from "@/services/mockData/projects.json";

class ProjectService {
  constructor() {
    this.projects = this.loadProjects();
  }

  loadProjects() {
    const stored = localStorage.getItem("vfx_projects");
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem("vfx_projects", JSON.stringify(projectsData));
    return [...projectsData];
  }

  saveProjects() {
    localStorage.setItem("vfx_projects", JSON.stringify(this.projects));
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.projects];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const project = this.projects.find(p => p.Id === parseInt(id));
    return project ? { ...project } : null;
  }

  async create(projectData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = this.projects.reduce((max, project) => 
      Math.max(max, project.Id), 0
    );
    
    const newProject = {
      Id: maxId + 1,
      ...projectData,
      createdAt: projectData.createdAt || new Date().toISOString()
    };
    
    this.projects.push(newProject);
    this.saveProjects();
    
    return { ...newProject };
  }

  async update(id, projectData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.projects.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Project not found");
    }
    
    this.projects[index] = {
      ...this.projects[index],
      ...projectData
    };
    
    this.saveProjects();
    return { ...this.projects[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.projects.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Project not found");
    }
    
    this.projects.splice(index, 1);
    this.saveProjects();
    
    return true;
  }
}

export default new ProjectService();