import StagePromptCard from '../components/StagePromptCard'

function DeployPage() {
  return (
    <div className="p-6 bg-stone-950">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Contract Deployment</h1>
        <p className="text-dark-300">
          Deploy your contract safely to blockchain networks with proper verification.
        </p>
      </div>
      
      <StagePromptCard stage="deploy" />
      
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="bg-dark-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Deployment Checklist</h3>
          <div className="space-y-2 text-sm text-dark-300">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" disabled />
              <span>Test on local network first</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" disabled />
              <span>Deploy to testnet (Goerli/Sepolia)</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" disabled />
              <span>Verify contract source code</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" disabled />
              <span>Test deployed contract functionality</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" disabled />
              <span>Set up monitoring and alerts</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" disabled />
              <span>Deploy to mainnet</span>
            </div>
          </div>
        </div>
        
        <div className="bg-dark-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Network Configuration</h3>
          <div className="space-y-3">
            <div className="border border-dark-600 rounded p-3">
              <h4 className="font-medium text-white mb-1">Local Development</h4>
              <p className="text-xs text-dark-300">Hardhat/Ganache local blockchain</p>
            </div>
            <div className="border border-dark-600 rounded p-3">
              <h4 className="font-medium text-white mb-1">Testnets</h4>
              <p className="text-xs text-dark-300">Goerli, Sepolia, Mumbai</p>
            </div>
            <div className="border border-dark-600 rounded p-3">
              <h4 className="font-medium text-white mb-1">Mainnets</h4>
              <p className="text-xs text-dark-300">Ethereum, Polygon, Arbitrum</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeployPage