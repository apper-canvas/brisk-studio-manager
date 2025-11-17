import assetsData from "@/services/mockData/assets.json";

class AssetService {
  constructor() {
    this.assets = this.loadAssets();
  }

  loadAssets() {
    const stored = localStorage.getItem("vfx_assets");
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem("vfx_assets", JSON.stringify(assetsData));
    return [...assetsData];
  }

  saveAssets() {
    localStorage.setItem("vfx_assets", JSON.stringify(this.assets));
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.assets];
  }

  async getByProjectId(projectId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.assets.filter(asset => asset.projectId === parseInt(projectId));
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const asset = this.assets.find(a => a.Id === parseInt(id));
    return asset ? { ...asset } : null;
  }

  async create(assetData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = this.assets.reduce((max, asset) => 
      Math.max(max, asset.Id), 0
    );
    
    const newAsset = {
      Id: maxId + 1,
      ...assetData,
      uploadDate: assetData.uploadDate || new Date().toISOString()
    };
    
    this.assets.push(newAsset);
    this.saveAssets();
    
    return { ...newAsset };
  }

  async update(id, assetData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.assets.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Asset not found");
    }
    
    this.assets[index] = {
      ...this.assets[index],
      ...assetData
    };
    
    this.saveAssets();
    return { ...this.assets[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.assets.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Asset not found");
    }
    
    this.assets.splice(index, 1);
    this.saveAssets();
    
    return true;
  }
}

export default new AssetService();