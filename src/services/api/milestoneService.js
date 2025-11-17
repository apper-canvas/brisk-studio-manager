import milestonesData from "@/services/mockData/milestones.json";

class MilestoneService {
  constructor() {
    this.milestones = this.loadMilestones();
  }

  loadMilestones() {
    const stored = localStorage.getItem("vfx_milestones");
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem("vfx_milestones", JSON.stringify(milestonesData));
    return [...milestonesData];
  }

  saveMilestones() {
    localStorage.setItem("vfx_milestones", JSON.stringify(this.milestones));
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.milestones];
  }

  async getByProjectId(projectId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.milestones.filter(milestone => milestone.projectId === parseInt(projectId));
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const milestone = this.milestones.find(m => m.Id === parseInt(id));
    return milestone ? { ...milestone } : null;
  }

  async create(milestoneData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = this.milestones.reduce((max, milestone) => 
      Math.max(max, milestone.Id), 0
    );
    
    const newMilestone = {
      Id: maxId + 1,
      ...milestoneData
    };
    
    this.milestones.push(newMilestone);
    this.saveMilestones();
    
    return { ...newMilestone };
  }

  async update(id, milestoneData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.milestones.findIndex(m => m.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Milestone not found");
    }
    
    this.milestones[index] = {
      ...this.milestones[index],
      ...milestoneData
    };
    
    this.saveMilestones();
    return { ...this.milestones[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.milestones.findIndex(m => m.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Milestone not found");
    }
    
    this.milestones.splice(index, 1);
    this.saveMilestones();
    
    return true;
  }
}

export default new MilestoneService();