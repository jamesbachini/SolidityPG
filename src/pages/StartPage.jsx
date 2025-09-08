import { useNavigate } from 'react-router-dom'
import { Sparkles, Shield, Code, Zap, Users, FileCode, ListChecks, Beaker, Rocket, Plug } from 'lucide-react'

function StartPage() {
  const navigate = useNavigate()

  const workflowStages = [
    {
      key: 'spec',
      path: '/spec',
      label: 'Spec',
      icon: FileCode,
      description: 'Define requirements, user roles and security considerations',
      gradient: 'from-green-500 to-teal-600'
    },
    {
      key: 'build',
      path: '/build',
      label: 'Build',
      icon: ListChecks,
      description: 'Implement contracts with secure patterns and best practices',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      key: 'test',
      path: '/test',
      label: 'Test',
      icon: Beaker,
      description: 'Create comprehensive test suites and security assessments',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      key: 'deploy',
      path: '/deploy',
      label: 'Deploy',
      icon: Rocket,
      description: 'Deploy safely to local testnets or production blockchains',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      key: 'integrate',
      path: '/integrate',
      label: 'Integrate',
      icon: Plug,
      description: 'Generate client bindings & integration code for frontend',
      gradient: 'from-teal-500 to-cyan-600'
    }
  ]

  return (
    <div className="h-full overflow-auto bg-stone-950">
      <div className="p-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 16 16" fill="none">
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
              <h1 className="text-5xl font-bold text-white mb-2">
                SolidityPG
              </h1>
              <p className="text-dark-300 text-sm tracking-wide">
                NEXTGEN SMART CONTRACT DEVELOPMENT
              </p>
            </div>
          </div>
          <p className="text-dark-200 text-xl max-w-3xl mx-auto leading-relaxed">
            Build secure, efficient smart contracts with AI assisted workflow.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-dark-800 to-dark-900 rounded-2xl p-8 mb-12 border border-dark-600 relative">
          <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-8">
            {workflowStages.map((stage, index) => {
              const Icon = stage.icon
              return (
                <button
                  key={stage.key}
                  onClick={() => navigate(stage.path)}
                  className={`text-center space-y-4 group cursor-pointer transition-all duration-200 hover:scale-105 ${index === 0 ? 'relative' : ''}`}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${stage.gradient} rounded-2xl flex items-center justify-center text-white mx-auto group-hover:shadow-lg transition-all`}>
                    <Icon size={24} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-white text-lg group-hover:text-blue-300 transition-colors">{stage.label}</h3>
                    <p className="text-dark-300 text-sm leading-relaxed group-hover:text-dark-200 transition-colors">
                      {stage.description}
                    </p>
                  </div>
                  
                  {/* Floating Arrow for Spec stage */}
                  {index === 0 && (
                    <div className="absolute -top-0 -left-20 flex items-center gap-2 animate-bounce pointer-events-none z-10">
                      <span className="text-blue-400 text-sm font-medium bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 whitespace-nowrap">
                        Start here
                      </span>
                      <div className="text-blue-400 transform rotate-45">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M4 16 L16 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                          <path d="M12 4 L16 4 L16 8" fill="currentColor"/>
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-dark-800 rounded-xl p-6 border border-dark-600">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Sparkles size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI-Powered Development</h3>
            <p className="text-dark-300 text-sm leading-relaxed mb-4">
              Get contextual AI assistance at every stage. From architecture decisions to security audits, 
              our AI provides expert guidance tailored to your specific needs.
            </p>
            <ul className="text-dark-400 text-xs space-y-1">
              <li>• Stage-specific prompt templates</li>
              <li>• Code review and optimization</li>
              <li>• Security vulnerability detection</li>
            </ul>
          </div>
          
          <div className="bg-dark-800 rounded-xl p-6 border border-dark-600">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
              <Shield size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Security First</h3>
            <p className="text-dark-300 text-sm leading-relaxed mb-4">
              Built-in security checklist with 20+ considerations. AI-powered vulnerability scanning 
              and best practices enforcement throughout development.
            </p>
            <ul className="text-dark-400 text-xs space-y-1">
              <li>• Comprehensive security checklist</li>
              <li>• Automated vulnerability scanning</li>
              <li>• Best practices enforcement</li>
            </ul>
          </div>
          
          <div className="bg-dark-800 rounded-xl p-6 border border-dark-600">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
              <Code size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Professional Workflow</h3>
            <p className="text-dark-300 text-sm leading-relaxed mb-4">
              Industry-standard development workflow with multi-file project management, 
              testing integration, and deployment automation.
            </p>
            <ul className="text-dark-400 text-xs space-y-1">
              <li>• Multi-file project support</li>
              <li>• Integrated testing framework</li>
              <li>• Automated deployment scripts</li>
            </ul>
          </div>
        </div>
        
        <div className="text-center bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-600/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Ready For Next Generation Contract Development Tooling?</h2>
          <p className="text-dark-300 mb-6 max-w-2xl mx-auto">
            Start your smart contract development journey with AI-powered guidance. 
            Click on any workflow stage below to begin, or explore the chat assistant for immediate help.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-4 py-2 bg-blue-600/20 text-blue-300 rounded-full text-sm font-medium">BYO API Keys</span>
            <span className="px-4 py-2 bg-green-600/20 text-green-300 rounded-full text-sm font-medium">Local Storage</span>
            <span className="px-4 py-2 bg-purple-600/20 text-purple-300 rounded-full text-sm font-medium">Privacy First</span>
            <span className="px-4 py-2 bg-orange-600/20 text-orange-300 rounded-full text-sm font-medium">Open Source</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StartPage