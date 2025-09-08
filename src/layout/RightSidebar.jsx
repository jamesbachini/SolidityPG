import { useState } from 'react'
import { X } from 'lucide-react'
import OptionsPanel from '../components/Sidebar/OptionsPanel'
import ChatPanel from '../components/Sidebar/ChatPanel'
import CompilationPanel from '../components/CompilationPanel'

function RightSidebar({ isOpen, isMobile, onClose, files, activeFile, onUpdateFile }) {
  const [activeTab, setActiveTab] = useState('chat')

  if (!isOpen) return null

  const sidebarClasses = isMobile
    ? 'fixed inset-y-0 right-0 z-50 w-80 bg-dark-800 border-l border-dark-600 transform transition-transform flex flex-col h-full'
    : 'w-96 border-l border-dark-600 bg-dark-800 flex flex-col h-full'

  const sidebarStyle = {}

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={sidebarClasses}
        style={sidebarStyle}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-600">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                activeTab === 'chat'
                  ? 'bg-blue-600 text-white'
                  : 'text-dark-300 hover:text-white hover:bg-dark-700'
              }`}
            >
              Chat
              <span className="ml-1 px-1.5 py-0.5 bg-yellow-600 text-yellow-100 text-xs rounded-full">
                AI
              </span>
            </button>
            <button
              onClick={() => setActiveTab('compile')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                activeTab === 'compile'
                  ? 'bg-blue-600 text-white'
                  : 'text-dark-300 hover:text-white hover:bg-dark-700'
              }`}
            >
              Compile
            </button>
            <button
              onClick={() => setActiveTab('options')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                activeTab === 'options'
                  ? 'bg-blue-600 text-white'
                  : 'text-dark-300 hover:text-white hover:bg-dark-700'
              }`}
            >
              Options
            </button>
          </div>
          
          {isMobile && (
            <button
              onClick={onClose}
              className="p-1 text-dark-300 hover:text-white"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {activeTab === 'chat' && <ChatPanel files={files} activeFile={activeFile} onUpdateFile={onUpdateFile} />}
          {activeTab === 'compile' && <CompilationPanel files={files} activeFile={activeFile} />}
          {activeTab === 'options' && <OptionsPanel />}
        </div>
      </div>
    </>
  )
}

export default RightSidebar