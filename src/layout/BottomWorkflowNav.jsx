import { useLocation, useNavigate } from 'react-router-dom'
import { FileCode, ListChecks, Beaker, Rocket, Plug, BookOpen } from 'lucide-react'

const WORKFLOW_STAGES = [
  {
    key: 'start',
    path: '/start',
    label: 'Onboard',
    icon: BookOpen,
    description: 'Learn how the platform works and get started',
    gradient: 'from-indigo-500 to-purple-600'
  },
  {
    key: 'spec',
    path: '/spec',
    label: 'Spec',
    icon: FileCode,
    description: 'Define contract specifications and requirements',
    gradient: 'from-green-500 to-teal-600'
  },
  {
    key: 'build',
    path: '/build',
    label: 'Build',
    icon: ListChecks,
    description: 'Implement and structure your smart contract',
    gradient: 'from-blue-500 to-indigo-600'
  },
  {
    key: 'test',
    path: '/test',
    label: 'Test',
    icon: Beaker,
    description: 'Test contract functionality and security',
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    key: 'deploy',
    path: '/deploy',
    label: 'Deploy',
    icon: Rocket,
    description: 'Deploy contract to blockchain networks',
    gradient: 'from-orange-500 to-red-600'
  },
  {
    key: 'integrate',
    path: '/integrate',
    label: 'Integrate',
    icon: Plug,
    description: 'Generate client bindings and integration code',
    gradient: 'from-teal-500 to-cyan-600'
  }
]

function BottomWorkflowNav() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-dark-800 border-t border-dark-600 px-4 py-3 safe-area-bottom">
      <div className="flex justify-center">
        <div className="flex items-center gap-1 max-w-2xl w-full">
          {WORKFLOW_STAGES.map((stage) => {
            const Icon = stage.icon
            const active = isActive(stage.path)
            
            return (
              <button
                key={stage.key}
                onClick={() => navigate(stage.path)}
                className={`flex flex-col items-center justify-center px-2 py-2 rounded-xl transition-all flex-1 min-w-0 group ${
                  active
                    ? 'text-white'
                    : 'text-dark-300 hover:text-white'
                }`}
                title={stage.description}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 transition-all bg-gradient-to-r ${stage.gradient} ${
                  active 
                    ? 'shadow-lg scale-110'
                    : 'opacity-60 group-hover:opacity-80 group-hover:scale-105'
                }`}>
                  <Icon size={18} />
                </div>
                <span className="text-xs font-medium truncate">{stage.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default BottomWorkflowNav