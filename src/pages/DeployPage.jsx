import { useState } from 'react'
import StagePromptCard from '../components/StagePromptCard'
import { Rocket, Settings, CheckCircle, AlertTriangle } from 'lucide-react'

function DeployPage() {
  const [selectedNetwork, setSelectedNetwork] = useState('sepolia')
  const [gasPrice, setGasPrice] = useState('20')
  const [gasLimit, setGasLimit] = useState('3000000')
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentStatus, setDeploymentStatus] = useState('')

  const networks = [
    { id: 'local', name: 'Local Network', rpc: 'http://localhost:8545', chainId: '1337' },
    { id: 'sepolia', name: 'Sepolia Testnet', rpc: 'https://sepolia.infura.io', chainId: '11155111' },
    { id: 'goerli', name: 'Goerli Testnet', rpc: 'https://goerli.infura.io', chainId: '5' },
    { id: 'mainnet', name: 'Ethereum Mainnet', rpc: 'https://mainnet.infura.io', chainId: '1' },
    { id: 'polygon', name: 'Polygon Mainnet', rpc: 'https://polygon-rpc.com', chainId: '137' }
  ]

  const handleDeploy = async () => {
    setIsDeploying(true)
    setDeploymentStatus('Preparing deployment...')
    
    // Simulate deployment process
    const deploymentSteps = [
      'Validating contract bytecode...',
      'Estimating gas costs...',
      'Connecting to network...',
      'Broadcasting transaction...',
      'Waiting for confirmation...',
      'Contract deployed successfully!',
      'Verifying contract source code...',
      'Deployment complete!'
    ]
    
    for (let i = 0; i < deploymentSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setDeploymentStatus(deploymentSteps[i])
    }
    
    setIsDeploying(false)
  }

  return (
    <div className="h-full bg-stone-950">
      <div className="p-6 border-b border-dark-600">
        <h1 className="text-2xl font-bold text-white mb-2">Contract Deployment</h1>
        <p className="text-dark-300">
          Deploy your contract safely to blockchain networks with proper verification.
        </p>
      </div>
      
      {/* 50/50 Layout */}
      <div className="flex h-full">
        {/* Left Side - System Prompt Template (50%) */}
        <div className="w-1/2 p-6 border-r border-dark-600 overflow-auto">
          <StagePromptCard stage="deploy" />
        </div>
        
        {/* Right Side - Deployment Controls (50%) */}
        <div className="w-1/2 p-6 overflow-auto">
          <div className="space-y-6">
            {/* Network Selection */}
            <div className="bg-dark-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Settings size={18} />
                Network Configuration
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Target Network</label>
                  <select
                    value={selectedNetwork}
                    onChange={(e) => setSelectedNetwork(e.target.value)}
                    className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {networks.map(network => (
                      <option key={network.id} value={network.id}>
                        {network.name} (Chain ID: {network.chainId})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Gas Price (Gwei)</label>
                    <input
                      type="number"
                      value={gasPrice}
                      onChange={(e) => setGasPrice(e.target.value)}
                      className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Gas Limit</label>
                    <input
                      type="number"
                      value={gasLimit}
                      onChange={(e) => setGasLimit(e.target.value)}
                      className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Deployment Controls */}
            <div className="bg-dark-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Rocket size={18} />
                Deploy Contract
              </h3>
              
              {/* Pre-deployment Checklist */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-white mb-2">Pre-deployment Checklist</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle size={14} />
                    <span>Contract compiled successfully</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle size={14} />
                    <span>All tests passing</span>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-400">
                    <AlertTriangle size={14} />
                    <span>Wallet connected to {networks.find(n => n.id === selectedNetwork)?.name}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleDeploy}
                disabled={isDeploying}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-3 px-4 rounded-md transition-all duration-200 font-medium flex items-center justify-center gap-2"
              >
                <Rocket size={16} className={isDeploying ? 'animate-pulse' : ''} />
                {isDeploying ? 'Deploying...' : 'Deploy Contract'}
              </button>
              
              {/* Deployment Status */}
              {(deploymentStatus || isDeploying) && (
                <div className="mt-4 p-3 bg-dark-900 border border-dark-600 rounded-md">
                  <div className="text-sm text-white font-medium mb-1">Deployment Status</div>
                  <div className="text-sm text-blue-400">
                    {deploymentStatus}
                    {isDeploying && <span className="animate-pulse ml-1">...</span>}
                  </div>
                </div>
              )}
            </div>

            {/* Post-deployment Actions */}
            <div className="bg-dark-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Post-deployment</h3>
              <div className="space-y-2">
                <button
                  disabled
                  className="w-full bg-dark-600 text-dark-400 py-2 px-4 rounded-md text-sm"
                >
                  Verify Contract Source Code
                </button>
                <button
                  disabled
                  className="w-full bg-dark-600 text-dark-400 py-2 px-4 rounded-md text-sm"
                >
                  Set up Contract Monitoring
                </button>
                <button
                  disabled
                  className="w-full bg-dark-600 text-dark-400 py-2 px-4 rounded-md text-sm"
                >
                  Generate Integration Code
                </button>
              </div>
              <p className="text-xs text-dark-400 mt-2">
                These options will be available after successful deployment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeployPage