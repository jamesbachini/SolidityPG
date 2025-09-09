import { useOutletContext } from 'react-router-dom'
import StagePromptCard from '../components/StagePromptCard'
import CompilationPanel from '../components/Sidebar/CompilationPanel'

function BuildPage() {
  const { files = {} } = useOutletContext() || {}
  return (
    <div className="h-full bg-stone-950">
      <div className="p-6 border-b border-dark-600">
        <h1 className="text-2xl font-bold text-white mb-2">Contract Implementation</h1>
        <p className="text-dark-300">
          Build your smart contract with proper structure and security patterns.
        </p>
      </div>
      
      {/* 50/50 Layout */}
      <div className="flex h-full">
        {/* Left Side - System Prompt Template (50%) */}
        <div className="w-1/2 p-6 border-r border-dark-600 overflow-auto">
          <StagePromptCard stage="build" />
        </div>
        
        {/* Right Side - Compilation Panel (50%) */}
        <div className="w-1/2 overflow-hidden">
          <CompilationPanel files={files} />
        </div>
      </div>
    </div>
  )
}

export default BuildPage