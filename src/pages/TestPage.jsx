import { useState } from 'react'
import StagePromptCard from '../components/StagePromptCard'
import SecurityChecklist from '../components/SecurityChecklist'
import { Play, ChevronLeft, ChevronRight } from 'lucide-react'

function TestPage() {
  const [showConsole, setShowConsole] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [testOutput, setTestOutput] = useState('')
  const [consoleWidth, setConsoleWidth] = useState(50) // Percentage width
  const [isDragging, setIsDragging] = useState(false)

  const runUnitTests = async () => {
    setIsRunning(true)
    setShowConsole(true)
    setTestOutput('Starting test suite...\n')
    
    // Simulate test execution with progressive output
    const testSteps = [
      '🔧 Compiling contracts...',
      '✅ Compilation successful',
      '🧪 Running unit tests...',
      '  ✅ test_constructor() - PASS',
      '  ✅ test_basic_functionality() - PASS', 
      '  ✅ test_access_control() - PASS',
      '  ✅ test_edge_cases() - PASS',
      '  ✅ test_security_guards() - PASS',
      '🛡️  Running security tests...',
      '  ✅ test_reentrancy_protection() - PASS',
      '  ✅ test_overflow_protection() - PASS',
      '  ✅ test_access_control_bypass() - PASS',
      '📊 Test Results:',
      '  • Tests Passed: 8/8',
      '  • Coverage: 95.2%',
      '  • Gas Usage: Optimal',
      '✨ All tests completed successfully!'
    ]
    
    for (let i = 0; i < testSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setTestOutput(prev => prev + testSteps[i] + '\n')
    }
    
    setIsRunning(false)
  }

  const handleMouseDown = (e) => {
    setIsDragging(true)
    e.preventDefault()
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    
    const container = e.currentTarget.parentElement
    const rect = container.getBoundingClientRect()
    const newWidth = ((e.clientX - rect.left) / rect.width) * 100
    
    // Limit width between 20% and 80%
    const clampedWidth = Math.max(20, Math.min(80, newWidth))
    setConsoleWidth(clampedWidth)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div 
      className="p-6 bg-stone-950"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
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
      
      {/* Testing Strategy and Run Tests Section */}
      <div className="mt-6 flex gap-6">
        <div 
          className={`bg-dark-800 rounded-lg p-4 transition-all duration-300 ${
            showConsole ? `flex-shrink-0` : 'flex-1'
          }`}
          style={{ width: showConsole ? `${consoleWidth}%` : '100%' }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white">Testing Strategy</h3>
            <button
              onClick={runUnitTests}
              disabled={isRunning}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-2 px-4 rounded-md transition-all duration-200 font-medium"
            >
              <Play size={16} className={isRunning ? 'animate-spin' : ''} />
              {isRunning ? 'Running Tests...' : 'Run Unit Tests'}
            </button>
          </div>
          
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

        {/* Resizable Divider */}
        {showConsole && (
          <div
            className="w-1 bg-dark-600 hover:bg-blue-500 cursor-col-resize transition-colors duration-200 relative"
            onMouseDown={handleMouseDown}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-dark-400">
              <ChevronRight size={12} />
            </div>
          </div>
        )}

        {/* Console Output */}
        {showConsole && (
          <div 
            className="bg-black rounded-lg border border-dark-600 flex-1 flex flex-col"
            style={{ width: `${100 - consoleWidth}%` }}
          >
            <div className="flex items-center justify-between p-3 border-b border-dark-600">
              <h3 className="text-sm font-medium text-white">Test Console</h3>
              <button
                onClick={() => setShowConsole(false)}
                className="text-dark-400 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
            <div className="flex-1 p-3 overflow-auto">
              <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                {testOutput}
                {isRunning && <span className="animate-pulse">█</span>}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Mobile overlay for console */}
      {showConsole && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-black rounded-lg border border-dark-600 w-full max-w-md max-h-96 flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-dark-600">
              <h3 className="text-sm font-medium text-white">Test Console</h3>
              <button
                onClick={() => setShowConsole(false)}
                className="text-dark-400 hover:text-white transition-colors text-lg"
              >
                ×
              </button>
            </div>
            <div className="flex-1 p-3 overflow-auto">
              <pre className="text-green-400 font-mono text-xs whitespace-pre-wrap">
                {testOutput}
                {isRunning && <span className="animate-pulse">█</span>}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TestPage