import { useState } from 'react'
import StagePromptCard from '../components/StagePromptCard'

function BuildPage() {
  const [completedTasks, setCompletedTasks] = useState(new Set())
  const [securityChecks, setSecurityChecks] = useState(new Set())

  const implementationTasks = [
    { id: 'structure', label: 'Set up contract structure' },
    { id: 'functions', label: 'Implement core functions' },
    { id: 'access', label: 'Add access controls' },
    { id: 'security', label: 'Include security guards' },
    { id: 'documentation', label: 'Write NatSpec documentation' }
  ]

  const securityPatterns = [
    { id: 'modifiers', label: 'Access control modifiers' },
    { id: 'pause', label: 'Emergency pause functionality' },
    { id: 'validation', label: 'Input validation' },
    { id: 'logic', label: 'Logic errors' }
  ]

  const toggleTask = (taskId) => {
    const newCompleted = new Set(completedTasks)
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId)
    } else {
      newCompleted.add(taskId)
    }
    setCompletedTasks(newCompleted)
  }

  const toggleSecurityCheck = (checkId) => {
    const newChecks = new Set(securityChecks)
    if (newChecks.has(checkId)) {
      newChecks.delete(checkId)
    } else {
      newChecks.add(checkId)
    }
    setSecurityChecks(newChecks)
  }

  const checkSecurityConcerns = () => {
    // TODO: Implement AI-powered security analysis
    alert('Security analysis feature will analyze your contract for security concerns using AI.')
  }

  return (
    <div className="p-6 bg-stone-950">
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
            {implementationTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="rounded border-dark-600 text-blue-600 focus:ring-blue-500 focus:ring-2 bg-dark-700" 
                  checked={completedTasks.has(task.id)}
                  onChange={() => toggleTask(task.id)}
                />
                <span className={completedTasks.has(task.id) ? 'line-through text-dark-500' : ''}>
                  {task.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-dark-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Security Checks</h3>
          <div className="space-y-2 text-sm text-dark-300 mb-4">
            {securityPatterns.map((pattern) => (
              <div key={pattern.id} className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="rounded border-dark-600 text-blue-600 focus:ring-blue-500 focus:ring-2 bg-dark-700" 
                  checked={securityChecks.has(pattern.id)}
                  onChange={() => toggleSecurityCheck(pattern.id)}
                />
                <span className={securityChecks.has(pattern.id) ? 'line-through text-dark-500' : ''}>
                  {pattern.label}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={checkSecurityConcerns}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white py-2 px-4 rounded-md transition-all duration-200 font-medium"
          >
            Check For Security Concerns
          </button>
        </div>
      </div>
    </div>
  )
}

export default BuildPage