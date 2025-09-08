import StagePromptCard from '../components/StagePromptCard'
import SecurityChecklist from '../components/SecurityChecklist'

function TestPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Testing & Security</h1>
        <p className="text-dark-300">
          Ensure your contract works correctly and securely through comprehensive testing.
        </p>
      </div>
      
      <StagePromptCard stage="test" />
      
      <div className="mt-6">
        <SecurityChecklist />
      </div>
      
      <div className="mt-6 bg-dark-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Testing Strategy</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium text-white mb-2">Unit Tests</h4>
            <div className="space-y-1 text-sm text-dark-300">
              <div>• Test individual functions</div>
              <div>• Verify return values</div>
              <div>• Check state changes</div>
              <div>• Test edge cases</div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Integration Tests</h4>
            <div className="space-y-1 text-sm text-dark-300">
              <div>• Multi-contract interactions</div>
              <div>• Workflow testing</div>
              <div>• External dependencies</div>
              <div>• Gas optimization</div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Security Tests</h4>
            <div className="space-y-1 text-sm text-dark-300">
              <div>• Reentrancy attacks</div>
              <div>• Access control bypass</div>
              <div>• Integer overflow/underflow</div>
              <div>• Denial of service</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestPage