import { useState } from 'react'
import StagePromptCard from '../components/StagePromptCard'
import { Code, Download, CheckCircle } from 'lucide-react'

function IntegratePage() {
  const [selectedLibrary, setSelectedLibrary] = useState('')
  const [selectedFramework, setSelectedFramework] = useState('react')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStatus, setGenerationStatus] = useState('')

  const libraries = [
    {
      id: 'viem',
      name: 'viem',
      description: 'Modern TypeScript Ethereum library',
      features: ['Type-safe', 'Lightweight', 'Tree-shakeable', 'Modern APIs'],
      recommended: true
    },
    {
      id: 'wagmi',
      name: 'wagmi',
      description: 'React hooks for Ethereum',
      features: ['React hooks', 'Built on viem', 'Caching', 'Type-safe'],
      recommended: true
    },
    {
      id: 'ethers',
      name: 'ethers.js v6',
      description: 'Complete Ethereum wallet implementation',
      features: ['Comprehensive', 'Well documented', 'Provider abstraction', 'ENS support']
    },
    {
      id: 'web3js',
      name: 'web3.js',
      description: 'Ethereum JavaScript API',
      features: ['Legacy support', 'Wide adoption', 'Plugin system', 'Multi-provider']
    }
  ]

  const frameworks = [
    { id: 'react', name: 'React' },
    { id: 'vue', name: 'Vue.js' },
    { id: 'svelte', name: 'Svelte' },
    { id: 'vanilla', name: 'Vanilla JS' }
  ]

  const handleGenerateBindings = async () => {
    if (!selectedLibrary) return
    
    setIsGenerating(true)
    setGenerationStatus('Preparing binding generation...')
    
    // Simulate binding generation process
    const generationSteps = [
      'Parsing contract ABI...',
      'Generating TypeScript types...',
      `Creating ${selectedLibrary} integration code...`,
      `Setting up ${selectedFramework} components...`,
      'Generating utility functions...',
      'Creating example usage code...',
      'Bindings generated successfully!'
    ]
    
    for (let i = 0; i < generationSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1200))
      setGenerationStatus(generationSteps[i])
    }
    
    setIsGenerating(false)
  }

  return (
    <div className="h-full bg-stone-950">
      <div className="p-6 border-b border-dark-600">
        <h1 className="text-2xl font-bold text-white mb-2">Frontend Integration</h1>
        <p className="text-dark-300">
          Generate client bindings and integration code for your applications.
        </p>
      </div>
      
      {/* 50/50 Layout */}
      <div className="flex h-full">
        {/* Left Side - System Prompt Template (50%) */}
        <div className="w-1/2 p-6 border-r border-dark-600 overflow-auto">
          <StagePromptCard stage="integrate" />
        </div>
        
        {/* Right Side - Library Selection and Binding Generation (50%) */}
        <div className="w-1/2 p-6 overflow-auto">
          <div className="space-y-6">
            {/* Library Selection */}
            <div className="bg-dark-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Code size={18} />
                Popular Libraries
              </h3>
              
              <div className="space-y-3">
                {libraries.map(library => (
                  <div
                    key={library.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      selectedLibrary === library.id
                        ? 'border-blue-500 bg-blue-600/10'
                        : 'border-dark-600 hover:border-dark-500 hover:bg-dark-700'
                    }`}
                    onClick={() => setSelectedLibrary(library.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-white">{library.name}</h4>
                          {library.recommended && (
                            <span className="px-2 py-0.5 bg-green-600/20 text-green-300 text-xs rounded-full">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-dark-300 mt-1">{library.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {library.features.map(feature => (
                            <span
                              key={feature}
                              className="px-2 py-0.5 bg-dark-600 text-dark-200 text-xs rounded"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="ml-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedLibrary === library.id
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-dark-500'
                        }`}>
                          {selectedLibrary === library.id && (
                            <CheckCircle size={12} className="text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Framework Selection */}
            <div className="bg-dark-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Target Framework</h3>
              <select
                value={selectedFramework}
                onChange={(e) => setSelectedFramework(e.target.value)}
                className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {frameworks.map(framework => (
                  <option key={framework.id} value={framework.id}>
                    {framework.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Generate Bindings */}
            <div className="bg-dark-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Generate Bindings</h3>
              
              <button
                onClick={handleGenerateBindings}
                disabled={!selectedLibrary || isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-3 px-4 rounded-md transition-all duration-200 font-medium flex items-center justify-center gap-2"
              >
                <Download size={16} className={isGenerating ? 'animate-pulse' : ''} />
                {isGenerating ? 'Generating...' : 'Create Bindings'}
              </button>
              
              {!selectedLibrary && (
                <p className="text-xs text-dark-400 mt-2">
                  Select a library above to enable binding generation.
                </p>
              )}
              
              {/* Generation Status */}
              {(generationStatus || isGenerating) && (
                <div className="mt-4 p-3 bg-dark-900 border border-dark-600 rounded-md">
                  <div className="text-sm text-white font-medium mb-1">Generation Status</div>
                  <div className="text-sm text-purple-400">
                    {generationStatus}
                    {isGenerating && <span className="animate-pulse ml-1">...</span>}
                  </div>
                </div>
              )}
            </div>

            {/* Generated Output */}
            {generationStatus && !isGenerating && (
              <div className="bg-dark-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Generated Files</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle size={14} />
                    <span>types/Contract.ts - TypeScript type definitions</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle size={14} />
                    <span>hooks/useContract.{selectedFramework === 'react' ? 'ts' : 'js'} - {frameworks.find(f => f.id === selectedFramework)?.name} integration</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle size={14} />
                    <span>utils/contract.ts - Utility functions</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle size={14} />
                    <span>examples/usage.{selectedFramework === 'vanilla' ? 'js' : 'tsx'} - Example implementation</span>
                  </div>
                </div>
                <button
                  className="w-full mt-3 bg-dark-600 hover:bg-dark-500 text-white py-2 px-4 rounded-md text-sm transition-colors"
                >
                  Download Integration Package
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default IntegratePage