import StagePromptCard from '../components/StagePromptCard'

function IntegratePage() {
  return (
    <div className="p-6 bg-stone-950">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Frontend Integration</h1>
        <p className="text-dark-300">
          Generate client bindings and integration code for your applications.
        </p>
      </div>
      
      <StagePromptCard stage="integrate" />
      
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="bg-dark-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Integration Steps</h3>
          <div className="space-y-2 text-sm text-dark-300">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" disabled />
              <span>Generate ABI from contract</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" disabled />
              <span>Create TypeScript bindings</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" disabled />
              <span>Set up wallet connection</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" disabled />
              <span>Implement contract calls</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" disabled />
              <span>Add event listeners</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" disabled />
              <span>Handle errors and edge cases</span>
            </div>
          </div>
        </div>
        
        <div className="bg-dark-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Popular Libraries</h3>
          <div className="space-y-3">
            <div className="border border-dark-600 rounded p-3">
              <h4 className="font-medium text-white mb-1">viem</h4>
              <p className="text-xs text-dark-300">Modern TypeScript Ethereum library</p>
            </div>
            <div className="border border-dark-600 rounded p-3">
              <h4 className="font-medium text-white mb-1">wagmi</h4>
              <p className="text-xs text-dark-300">React hooks for Ethereum</p>
            </div>
            <div className="border border-dark-600 rounded p-3">
              <h4 className="font-medium text-white mb-1">ethers.js</h4>
              <p className="text-xs text-dark-300">Complete Ethereum wallet implementation</p>
            </div>
            <div className="border border-dark-600 rounded p-3">
              <h4 className="font-medium text-white mb-1">web3.js</h4>
              <p className="text-xs text-dark-300">Ethereum JavaScript API</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IntegratePage