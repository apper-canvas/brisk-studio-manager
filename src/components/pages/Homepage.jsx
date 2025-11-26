import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';

function Homepage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatType, setChatType] = useState('chat');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [maxTokens, setMaxTokens] = useState(1000);
  const [temperature, setTemperature] = useState(0.7);
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileInputRef = useRef(null);
const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    setResponse('');

    try {
      // Initialize ApperClient
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Invoke OpenAI edge function
      const result = await apperClient.functions.invoke(import.meta.env.VITE_OPENAI, {
        body: JSON.stringify({
          prompt: prompt.trim(),
          type: chatType,
          model: model,
          maxTokens: maxTokens,
          temperature: temperature
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.success) {
        setResponse(result.data.content);
        toast.success('AI response generated successfully');
      } else {
        console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_OPENAI}. The response body is: ${JSON.stringify(result)}.`);
        toast.error(result.error || 'Failed to generate AI response');
      }
    } catch (error) {
      console.info(`apper_info: Got this error an this function: ${import.meta.env.VITE_OPENAI}. The error is: ${error.message}`);
      toast.error('Failed to connect to AI service');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    
    if (!file) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (e.g., max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image file is too large (max 10MB)');
      return;
    }

    setUploadLoading(true);

    try {
      // Initialize ApperClient
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', file);

      // Invoke upload-large-image edge function
      const result = await apperClient.functions.invoke(import.meta.env.VITE_UPLOAD_LARGE_IMAGE, {
        body: formData,
        headers: {
          // Don't set Content-Type header - let browser set it with boundary for FormData
        }
      });

      if (result.success) {
        toast.success('Image uploaded successfully');
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_UPLOAD_LARGE_IMAGE}. The response body is: ${JSON.stringify(result)}.`);
        toast.error(result.error || 'Failed to upload image');
      }
    } catch (error) {
      console.info(`apper_info: Got this error an this function: ${import.meta.env.VITE_UPLOAD_LARGE_IMAGE}. The error is: ${error.message}`);
      toast.error('Failed to connect to upload service');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleClear = () => {
    setPrompt('');
    setResponse('');
  };

  const chatTypeOptions = [
    { value: 'chat', label: 'Chat', description: 'Interactive conversation' },
    { value: 'completion', label: 'Completion', description: 'Text completion' },
    { value: 'analysis', label: 'Analysis', description: 'Content analysis' },
    { value: 'generation', label: 'Generation', description: 'Creative content' }
  ];

  const modelOptions = [
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">AI Assistant</h1>
          <p className="text-slate-400">
            Powered by OpenAI - Generate content, analyze text, and get intelligent responses
          </p>
        </div>

        {/* Settings Panel */}
        <div className="bg-surface rounded-lg p-6 mb-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
            <ApperIcon name="Settings" size={20} className="mr-2" />
            Configuration
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Chat Type */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Type
              </label>
              <select
                value={chatType}
                onChange={(e) => setChatType(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-slate-600 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {chatTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">
                {chatTypeOptions.find(opt => opt.value === chatType)?.description}
              </p>
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-slate-600 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {modelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Tokens */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Max Tokens
              </label>
              <input
                type="number"
                min="1"
                max="4000"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-background border border-slate-600 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Temperature
              </label>
              <input
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-background border border-slate-600 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-surface rounded-lg border border-slate-700 overflow-hidden">
          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-6 border-b border-slate-700">
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Your Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                rows={4}
                className="w-full px-4 py-3 bg-background border border-slate-600 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex space-x-3">
                <Button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Send" size={16} className="mr-2" />
                      Generate
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleClear}
                  disabled={loading}
                  className="flex items-center"
                >
                  <ApperIcon name="Trash2" size={16} className="mr-2" />
                  Clear
                </Button>
              </div>

              <div className="text-sm text-slate-500">
                {prompt.length} characters
              </div>
            </div>
          </form>

          {/* Response Area */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loading />
                <span className="ml-3 text-slate-400">AI is thinking...</span>
              </div>
            ) : response ? (
              <div>
                <div className="flex items-center mb-3">
                  <ApperIcon name="Bot" size={20} className="text-primary mr-2" />
                  <h3 className="text-lg font-semibold text-slate-100">AI Response</h3>
                </div>
                <div className="bg-background rounded-lg p-4 border border-slate-600">
                  <pre className="text-slate-100 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {response}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="MessageCircle" size={48} className="text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500">
                  Enter a prompt above and click Generate to get started
                </p>
              </div>
            )}
          </div>
        </div>
{/* Image Upload Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-surface/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-secondary to-accent flex items-center justify-center">
                <ApperIcon name="Upload" size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent mb-2">
                Upload Large Image
              </h2>
              <p className="text-slate-400">
                Select and upload large image files using our edge function
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-slate-400
                    file:mr-4 file:py-3 file:px-6
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium
                    file:bg-primary/10 file:text-primary
                    hover:file:bg-primary/20 file:cursor-pointer
                    border border-slate-600 rounded-lg p-3
                    focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                
                <Button
                  onClick={handleImageUpload}
                  disabled={uploadLoading}
                  className="w-full max-w-xs bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 disabled:opacity-50"
                >
                  {uploadLoading ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Upload" size={16} className="mr-2" />
                      Upload Image
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Examples */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Quick Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setPrompt("Explain VFX pipeline workflow in simple terms")}
              disabled={loading}
              className="text-left p-4 bg-surface border border-slate-700 rounded-lg hover:border-primary transition-colors disabled:opacity-50"
            >
              <div className="flex items-start">
                <ApperIcon name="Film" size={20} className="text-primary mr-3 mt-1" />
                <div>
                  <div className="text-slate-100 font-medium mb-1">VFX Workflow</div>
                  <div className="text-slate-400 text-sm">Learn about visual effects pipeline</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setPrompt("Generate a creative brief for a sci-fi movie project")}
              disabled={loading}
              className="text-left p-4 bg-surface border border-slate-700 rounded-lg hover:border-primary transition-colors disabled:opacity-50"
            >
              <div className="flex items-start">
                <ApperIcon name="Sparkles" size={20} className="text-primary mr-3 mt-1" />
                <div>
                  <div className="text-slate-100 font-medium mb-1">Creative Brief</div>
                  <div className="text-slate-400 text-sm">Generate project ideas</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setPrompt("Analyze this project timeline and suggest optimizations")}
              disabled={loading}
              className="text-left p-4 bg-surface border border-slate-700 rounded-lg hover:border-primary transition-colors disabled:opacity-50"
            >
              <div className="flex items-start">
                <ApperIcon name="BarChart3" size={20} className="text-primary mr-3 mt-1" />
                <div>
                  <div className="text-slate-100 font-medium mb-1">Timeline Analysis</div>
                  <div className="text-slate-400 text-sm">Optimize project schedules</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setPrompt("Write technical documentation for 3D asset creation standards")}
              disabled={loading}
              className="text-left p-4 bg-surface border border-slate-700 rounded-lg hover:border-primary transition-colors disabled:opacity-50"
            >
              <div className="flex items-start">
                <ApperIcon name="FileText" size={20} className="text-primary mr-3 mt-1" />
                <div>
                  <div className="text-slate-100 font-medium mb-1">Documentation</div>
                  <div className="text-slate-400 text-sm">Create technical standards</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;