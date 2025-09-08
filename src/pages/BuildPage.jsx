import StagePromptCard from '../components/StagePromptCard'

function BuildPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Contract Implementation</h1>
        <p className="text-dark-300">
          Build your smart contract with proper structure and security patterns.
        </p>
      </div>
      
      <StagePromptCard stage="build" />
      
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="bg-dark-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Implementation Tasks</h3>
          <div className="space-y-2 text-sm text-dark-300">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" disabled />
              <span>Set up contract structure</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" disabled />
              <span>Implement core functions</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" disabled />
              <span>Add access controls</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" disabled />
              <span>Include security guards</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" disabled />
              <span>Write NatSpec documentation</span>
            </div>
          </div>
        </div>
        
        <div className="bg-dark-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Security Patterns</h3>
          <div className="space-y-2 text-sm text-dark-300">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" disabled />
              <span>Reentrancy protection</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" disabled />
              <span>Integer overflow checks</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" disabled />
              <span>Access control modifiers</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" disabled />
              <span>Emergency pause functionality</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" disabled />
              <span>Input validation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuildPage