import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import AssetCard from "@/components/molecules/AssetCard";
import AssetUpload from "@/components/organisms/AssetUpload";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import assetService from "@/services/api/assetService";
import projectService from "@/services/api/projectService";

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showUpload, setShowUpload] = useState(false);

  const typeOptions = [
    { value: "image", label: "Images" },
    { value: "video", label: "Videos" },
    { value: "model", label: "3D Models" },
    { value: "other", label: "Other" }
  ];

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const [assetsData, projectsData] = await Promise.all([
        assetService.getAll(),
        projectService.getAll()
      ]);
      setAssets(assetsData);
      setProjects(projectsData);
      setFilteredAssets(assetsData);
    } catch (err) {
      setError(err.message || "Failed to load assets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = [...assets];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(asset =>
        asset.fileName.toLowerCase().includes(search) ||
        asset.tags?.some(tag => tag.toLowerCase().includes(search))
      );
    }

    if (typeFilter) {
      filtered = filtered.filter(asset => {
        const type = asset.fileType?.toLowerCase() || "";
        switch (typeFilter) {
          case "image":
            return type.includes("image");
          case "video":
            return type.includes("video");
          case "model":
            return type.includes("model") || type.includes("fbx") || type.includes("obj") || type.includes("blend") || type.includes("max");
          case "other":
            return !type.includes("image") && !type.includes("video") && !type.includes("model");
          default:
            return true;
        }
      });
    }

    if (projectFilter) {
      filtered = filtered.filter(asset => asset.projectId === parseInt(projectFilter));
    }

    setFilteredAssets(filtered);
  }, [assets, searchTerm, typeFilter, projectFilter]);

  const handleAssetUpload = async (assetData) => {
    try {
      const newAsset = await assetService.create(assetData);
      setAssets(prev => [newAsset, ...prev]);
    } catch (error) {
      throw error;
    }
  };

  const handleViewAsset = (asset) => {
    toast.info("Asset preview coming soon!");
  };

  const handleDeleteAsset = async (asset) => {
    if (window.confirm(`Are you sure you want to delete "${asset.fileName}"?`)) {
      try {
        await assetService.delete(asset.Id);
        setAssets(prev => prev.filter(a => a.Id !== asset.Id));
        toast.success("Asset deleted successfully");
      } catch (error) {
        toast.error("Failed to delete asset");
      }
    }
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.Id === projectId);
    return project?.title || "Unknown Project";
  };

  const projectOptions = projects.map(project => ({
    value: project.Id.toString(),
    label: project.title
  }));

  if (loading) {
    return <Loading variant="grid" />;
  }

  if (error) {
    return (
      <ErrorView
        title="Failed to Load Assets"
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
          <h1 className="text-2xl font-bold text-slate-100 mb-2">Assets</h1>
          <p className="text-slate-400">
            Manage your project assets and media files
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex items-center bg-surface rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${viewMode === "grid" ? "bg-primary text-white" : "text-slate-400 hover:text-slate-100"}`}
            >
              <ApperIcon name="Grid3X3" size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${viewMode === "list" ? "bg-primary text-white" : "text-slate-400 hover:text-slate-100"}`}
            >
              <ApperIcon name="List" size={16} />
            </button>
          </div>

          <Button
            onClick={() => setShowUpload(!showUpload)}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            <ApperIcon name="Upload" size={20} className="mr-2" />
            Upload Assets
          </Button>
        </div>
      </div>

      {/* Upload Section */}
      {showUpload && (
        <div className="bg-surface rounded-lg p-6 border border-slate-700">
          <AssetUpload onAssetUpload={handleAssetUpload} />
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <SearchBar
          placeholder="Search assets..."
          onSearch={setSearchTerm}
          className="flex-1"
        />
        
        {/* Type Filter */}
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="appearance-none bg-surface border border-slate-600 rounded-lg px-4 py-2 pr-10 text-sm text-slate-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Types</option>
            {typeOptions.map((option) => (
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

        {/* Project Filter */}
        <div className="relative">
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
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

      {/* Assets Display */}
      {filteredAssets.length === 0 ? (
        <Empty
          title={searchTerm || typeFilter || projectFilter ? "No assets found" : "No assets yet"}
          message={
            searchTerm || typeFilter || projectFilter
              ? "Try adjusting your search or filter criteria."
              : "Upload your first assets to start building your project library."
          }
          icon="Image"
          action={() => setShowUpload(true)}
          actionLabel="Upload First Asset"
        />
      ) : (
        <div className={viewMode === "grid" 
          ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" 
          : "space-y-4"
        }>
          {filteredAssets.map((asset) => (
            <div key={asset.Id}>
              {viewMode === "list" ? (
                <div className="bg-surface rounded-lg p-4 flex items-center space-x-4 hover:bg-slate-700/50 transition-colors duration-200">
                  <div className="w-12 h-12 bg-slate-700 rounded flex items-center justify-center flex-shrink-0">
                    <ApperIcon 
                      name={asset.fileType?.includes("image") ? "Image" : asset.fileType?.includes("video") ? "Video" : "File"} 
                      size={24} 
                      className="text-slate-400" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-100 truncate">{asset.fileName}</h4>
                    <p className="text-sm text-slate-400">{getProjectName(asset.projectId)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleViewAsset(asset)}>
                      <ApperIcon name="Eye" size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteAsset(asset)}>
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              ) : (
                <AssetCard
                  asset={asset}
                  onView={handleViewAsset}
                  onDelete={handleDeleteAsset}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Assets;