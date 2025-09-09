import { useState, useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import BottomWorkflowNav from './BottomWorkflowNav'
import RightSidebar from './RightSidebar'
import EditorPane from '../components/EditorPane'
import FloatingChatInput from '../components/FloatingChatInput'

function Shell() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [editorData, setEditorData] = useState({ files: {}, activeFile: '' })
  const [chatHistory, setChatHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('soliditypg_chat_history')
      if (saved) {
        const parsed = JSON.parse(saved)
        return parsed.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }
      return []
    } catch {
      return []
    }
  })
  const [sidebarActiveTab, setSidebarActiveTab] = useState('chat')
  
  // Ensure valid tab selection (redirect compile to chat since we removed it)
  const handleSetActiveTab = (tab) => {
    setSidebarActiveTab(tab === 'compile' ? 'chat' : tab)
  }
  const editorRef = useRef()
  const floatingChatRef = useRef()
  const location = useLocation()

  // Save chat history
  useEffect(() => {
    try {
      localStorage.setItem('soliditypg_chat_history', JSON.stringify(chatHistory))
    } catch (error) {
      console.warn('Failed to save chat history:', error)
    }
  }, [chatHistory])

  const handleUpdateFile = (fileName, content) => {
    if (editorRef.current) {
      editorRef.current.updateFile(fileName, content)
    }
  }

  const handleSwitchToChat = () => {
    setSidebarActiveTab('chat')
    setSidebarOpen(true)
  }

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="h-full flex flex-col bg-dark-900">
      {/* Header */}
      <Header 
        sidebarOpen={sidebarOpen} 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
      />
      
      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden pb-20">
        {/* Left side - Editor and Stage Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Stage content area - shows above editor on larger screens */}
          <div className={`hidden md:block bg-dark-800 border-b border-dark-600 overflow-auto ${
            location.pathname === '/start' ? 'h-3/5' : 'max-h-80'
          }`}>
            <Outlet context={{ files: editorData.files }} />
          </div>
          
          {/* Editor */}
          <div className={`${location.pathname === '/start' ? 'h-2/5' : 'flex-1'}`}>
            <EditorPane ref={editorRef} onDataChange={setEditorData} />
          </div>
          
          {/* Stage content area - mobile view */}
          <div className="md:hidden bg-dark-800 border-t border-dark-600 max-h-60 overflow-auto">
            <Outlet context={{ files: editorData.files }} />
          </div>
        </div>
        
        {/* Right sidebar */}
        <RightSidebar 
          isOpen={sidebarOpen}
          isMobile={isMobile}
          onClose={() => setSidebarOpen(false)}
          files={editorData.files}
          activeFile={editorData.activeFile}
          onUpdateFile={handleUpdateFile}
          chatHistory={chatHistory}
          onUpdateChatHistory={setChatHistory}
          activeTab={sidebarActiveTab}
          onSetActiveTab={handleSetActiveTab}
          floatingChatRef={floatingChatRef}
        />
      </div>
      
      {/* Bottom navigation */}
      <BottomWorkflowNav sidebarOpen={sidebarOpen} isMobile={isMobile} />
      
      {/* Floating Chat Input */}
      <FloatingChatInput 
        ref={floatingChatRef}
        files={editorData.files}
        activeFile={editorData.activeFile}
        onUpdateFile={handleUpdateFile}
        onSwitchToChat={handleSwitchToChat}
        chatHistory={chatHistory}
        onUpdateChatHistory={setChatHistory}
      />
    </div>
  )
}

export default Shell