import { useLocation } from 'react-router-dom'
import { PanelRight } from 'lucide-react'
import { WORKFLOW_STAGES } from '../utils/routes'

function Header({ sidebarOpen, onToggleSidebar }) {
  const location = useLocation()
  
  // Get current stage info
  const currentStage = WORKFLOW_STAGES.find(stage => 
    location.pathname.includes(stage.key)
  )
  
  const getPageTitle = () => {
    if (location.pathname.includes('/start')) return ''
    return currentStage ? currentStage.label : 'Solidity Playground'
  }

  return (
    <header className="bg-dark-800 border-b border-dark-600 px-4 py-3 flex items-center justify-between">
      {/* Left side - Logo */}
      <div className="flex items-center gap-3">
        {/* Simple geometric logo placeholder */}
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path 
              d="M8 2L12 6L8 10L4 6L8 2Z" 
              fill="currentColor" 
              className="text-white"
            />
            <path 
              d="M8 6L12 10L8 14L4 10L8 6Z" 
              fill="currentColor" 
              className="text-white opacity-60"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-white font-semibold text-sm">SolidityPG.com</h1>
          <p className="text-dark-300 text-xs hidden sm:block">The AI Assisted Solidity Playground</p>
        </div>
      </div>
      
      {/* Center - Current stage */}
      <div className="text-center">
        <h2 className="text-white font-medium">{getPageTitle()}</h2>
        {currentStage && (
          <p className="text-dark-300 text-sm hidden sm:block">
            {currentStage.description}
          </p>
        )}
      </div>
      
      {/* Right side - Sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        className={`p-2 rounded-lg transition-colors ${
          sidebarOpen 
            ? 'bg-blue-600 text-white' 
            : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
        }`}
        title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        <PanelRight size={18} />
      </button>
    </header>
  )
}

export default Header