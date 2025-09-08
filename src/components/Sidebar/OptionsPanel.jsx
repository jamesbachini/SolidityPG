import { useState, useEffect } from 'react'
import { KeyRound, Upload, Download, GitBranch, Shield, Trash2, Save, Eye, EyeOff, Zap } from 'lucide-react'
import { loadAIConfig, saveAIConfig, AI_PROVIDERS, AI_MODELS, DEFAULT_CONFIG } from '../../utils/aiService'

function OptionsPanel() {
  const [config, setConfig] = useState(() => {
    const loadedConfig = loadAIConfig()
    // Ensure the provider exists in our models
    if (!AI_MODELS[loadedConfig.provider]) {
      return { ...loadedConfig, provider: AI_PROVIDERS.ANTHROPIC, model: 'claude-sonnet-4' }
    }
    // Ensure the model exists for the provider
    const providerModels = AI_MODELS[loadedConfig.provider]
    if (!providerModels.find(m => m.id === loadedConfig.model)) {
      return { ...loadedConfig, model: providerModels[0]?.id || 'claude-sonnet-4' }
    }
    return loadedConfig
  })
  const [showApiKey, setShowApiKey] = useState(false)
  const [isConfigValid, setIsConfigValid] = useState(false)

  useEffect(() => {
    setIsConfigValid(config.apiKey.length > 10) // Basic validation
  }, [config.apiKey])

  const handleConfigChange = (field, value) => {
    const newConfig = { ...config, [field]: value }
    setConfig(newConfig)
    saveAIConfig(newConfig)
  }

  const handleProviderChange = (provider) => {
    const providerModels = AI_MODELS[provider]
    if (providerModels && providerModels.length > 0) {
      const firstModel = providerModels[0]
      handleConfigChange('provider', provider)
      handleConfigChange('model', firstModel.id)
    } else {
      // Fallback to just changing provider
      handleConfigChange('provider', provider)
    }
  }

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all locally stored data including projects and AI settings?')) {
      try {
        // Clear all SolidityPG related data
        const keysToRemove = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && key.startsWith('soliditypg_')) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key))
        
        // Reset config to defaults
        setConfig(DEFAULT_CONFIG)
        saveAIConfig(DEFAULT_CONFIG)
        
        alert('All local data has been cleared!')
      } catch (error) {
        alert('Failed to clear data: ' + error.message)
      }
    }
  }

  const getProviderIcon = (provider) => {
    const icons = {
      [AI_PROVIDERS.ANTHROPIC]: '🤖',
      [AI_PROVIDERS.OPENAI]: '🤖',
      [AI_PROVIDERS.GOOGLE]: '🔵',
      [AI_PROVIDERS.GROQ]: '⚡',
      [AI_PROVIDERS.XGROK]: '🚀',
      [AI_PROVIDERS.QWEN]: '🧠',
      [AI_PROVIDERS.DEEPSEEK]: '🔍'
    }
    return icons[provider] || '🤖'
  }

  const getProviderName = (provider) => {
    const names = {
      [AI_PROVIDERS.ANTHROPIC]: 'Anthropic Claude',
      [AI_PROVIDERS.OPENAI]: 'OpenAI',
      [AI_PROVIDERS.GOOGLE]: 'Google Gemini',
      [AI_PROVIDERS.GROQ]: 'Groq / xAI Grok',
      [AI_PROVIDERS.XGROK]: 'xAI Grok',
      [AI_PROVIDERS.QWEN]: 'Qwen (Alibaba)',
      [AI_PROVIDERS.DEEPSEEK]: 'DeepSeek'
    }
    return names[provider] || provider
  }

  return (
    <div className="p-4 space-y-6">
      {/* AI Configuration Status */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
          <div className={`px-2 py-1 rounded-full text-xs ${
            isConfigValid 
              ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
              : 'bg-red-600/20 text-red-400 border border-red-600/30'
          }`}>
            {isConfigValid ? '✓ Configured' : '⚠ Setup Required'}
          </div>
        </div>
        
        {!isConfigValid && (
          <div className="bg-yellow-600/10 border border-yellow-600/20 rounded-lg p-3">
            <div className="flex items-start gap-2 text-yellow-300 text-sm">
              <KeyRound size={16} className="mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium mb-1">API Key Required</div>
                <div className="text-xs text-yellow-200/80">
                  Add your API key below to enable AI assistance with code generation and reviews.
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* AI Service Info */}
        <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-3">
          <div className="flex items-start gap-2 text-blue-300 text-sm">
            <Shield size={16} className="mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium mb-1">🚀 Custom Proxy Enabled</div>
              <div className="text-xs text-blue-200/80">
                Uses custom proxy server for seamless CORS-free access to OpenAI and Anthropic APIs.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Selection */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-white">AI Provider</h4>
        
        <div className="space-y-2">
          {Object.values(AI_PROVIDERS).map(provider => {
            const isDisabled = provider === AI_PROVIDERS.GOOGLE
            return (
              <button
                key={provider}
                onClick={() => !isDisabled && handleProviderChange(provider)}
                disabled={isDisabled}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  config.provider === provider
                    ? 'bg-blue-600/20 border-blue-600/50 text-white'
                    : isDisabled
                    ? 'bg-dark-800 border-dark-700 text-dark-500 cursor-not-allowed opacity-50'
                    : 'bg-dark-700 border-dark-600 text-dark-300 hover:bg-dark-600'
                }`}
              >
                <span className="text-lg">{getProviderIcon(provider)}</span>
                <div className="text-left">
                  <div className="font-medium flex items-center gap-2">
                    {getProviderName(provider)}
                    {isDisabled && (
                      <span className="text-xs px-2 py-0.5 bg-yellow-600/20 text-yellow-400 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <div className="text-xs opacity-75">
                    {isDisabled ? 'Available in future update' : `${AI_MODELS[provider]?.length || 0} models available`}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Model Selection */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Model
        </label>
        <select
          value={config.model}
          onChange={(e) => handleConfigChange('model', e.target.value)}
          className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {AI_MODELS[config.provider]?.map(model => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          )) || <option value="">No models available</option>}
        </select>
        <div className="text-xs text-dark-400 mt-1">
          Context limit: {AI_MODELS[config.provider]?.find(m => m.id === config.model)?.contextLimit?.toLocaleString() || 'Unknown'} tokens
        </div>
      </div>

      {/* API Key Input */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          <KeyRound size={14} className="inline mr-1" />
          API Key
        </label>
        <div className="relative">
          <input
            type={showApiKey ? 'text' : 'password'}
            value={config.apiKey}
            onChange={(e) => handleConfigChange('apiKey', e.target.value)}
            placeholder={`Enter your ${getProviderName(config.provider)} API key...`}
            className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 pr-10 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white"
          >
            {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <p className="text-xs text-dark-400 mt-1">
          🔒 Your API key is stored locally and never sent to our servers
        </p>
      </div>

      {/* Advanced Settings */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-white">Advanced Settings</h4>
        
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Temperature: {config.temperature}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={config.temperature}
            onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-dark-500 mt-1">
            <span>Focused (0.0)</span>
            <span>Creative (1.0)</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Max Tokens
          </label>
          <select
            value={config.maxTokens}
            onChange={(e) => handleConfigChange('maxTokens', parseInt(e.target.value))}
            className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={1024}>1,024 (Short)</option>
            <option value={2048}>2,048 (Medium)</option>
            <option value={4096}>4,096 (Long)</option>
            <option value={8192}>8,192 (Very Long)</option>
          </select>
        </div>
      </div>

      {/* Project Management */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-white">Project Management</h4>
        
        <div className="space-y-2">
          <button
            onClick={() => alert('Project import/export coming soon!')}
            className="w-full flex items-center justify-center gap-2 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-md px-3 py-2 text-sm text-white transition-colors"
          >
            <Upload size={16} />
            Import .zip Project
          </button>
          
          <button
            onClick={() => alert('Project import/export coming soon!')}
            className="w-full flex items-center justify-center gap-2 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-md px-3 py-2 text-sm text-white transition-colors"
          >
            <Download size={16} />
            Export as .zip
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-red-400">Danger Zone</h4>
        
        <button
          onClick={clearAllData}
          className="w-full flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 rounded-md px-3 py-2 text-sm text-red-400 transition-colors"
        >
          <Trash2 size={16} />
          Clear All Local Data
        </button>
      </div>

      {/* Status */}
      <div className="text-xs text-dark-400 pt-4 border-t border-dark-700">
        <p className="mb-2">
          <strong>Privacy:</strong> All data stays on your device. API keys and projects are stored in browser localStorage only.
        </p>
        <p>
          Current storage: ~{Math.round(JSON.stringify(localStorage).length / 1024)}KB
        </p>
      </div>
    </div>
  )
}

export default OptionsPanel