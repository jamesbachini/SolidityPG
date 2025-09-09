import { useState } from 'react'
import StagePromptCard from '../components/StagePromptCard'
import { Play } from 'lucide-react'

function TestPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [testOutput, setTestOutput] = useState('')

  const runTests = async () => {
    setIsRunning(true)
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

  return (
    <div className="h-full bg-stone-950">
      <div className="p-6 border-b border-dark-600">
        <h1 className="text-2xl font-bold text-white mb-2">Testing & Security</h1>
        <p className="text-dark-300">
          Ensure your contract works correctly and securely through comprehensive testing.
        </p>
      </div>
      
      {/* 50/50 Layout */}
      <div className="flex h-full">
        {/* Left Side - System Prompt Template (50%) */}
        <div className="w-1/2 p-6 border-r border-dark-600 overflow-auto">
          <StagePromptCard stage="test" />
        </div>
        
        {/* Right Side - Test Console (50%) */}
        <div className="w-1/2 flex flex-col">
          {/* Test Controls Header */}
          <div className="p-6 border-b border-dark-600">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Test Suite</h3>
              <button
                onClick={runTests}
                disabled={isRunning}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-2 px-4 rounded-md transition-all duration-200 font-medium"
              >
                <Play size={16} className={isRunning ? 'animate-spin' : ''} />
                {isRunning ? 'Running Tests...' : 'Run Tests'}
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-white mb-1">Unit Tests</h4>
                <div className="space-y-1 text-dark-300 text-xs">
                  <div>• Function testing</div>
                  <div>• State validation</div>
                  <div>• Edge cases</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Integration</h4>
                <div className="space-y-1 text-dark-300 text-xs">
                  <div>• Contract interactions</div>
                  <div>• Workflow testing</div>
                  <div>• Gas optimization</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Security</h4>
                <div className="space-y-1 text-dark-300 text-xs">
                  <div>• Reentrancy tests</div>
                  <div>• Access control</div>
                  <div>• Overflow protection</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Console Window */}
          <div className="flex-1 bg-black border-t border-dark-600">
            <div className="h-full flex flex-col">
              <div className="p-3 border-b border-dark-600 bg-dark-900">
                <h4 className="text-sm font-medium text-white">Test Console</h4>
              </div>
              <div className="flex-1 p-4 overflow-auto">
                <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                  {testOutput || 'Click "Run Tests" to start testing your smart contracts...\n\nTest output will appear here with real-time results.'}
                  {isRunning && <span className="animate-pulse">█</span>}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestPage