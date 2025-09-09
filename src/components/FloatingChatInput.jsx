import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { Send, Loader2, Code, FileText, X, MessageSquare } from 'lucide-react'
import { callAI, getSystemPrompt, parseAIResponse, loadAIConfig } from '../utils/aiService'
import { useLocation } from 'react-router-dom'

const FloatingChatInput = forwardRef(({ 
  files, 
  activeFile, 
  onUpdateFile, 
  onSwitchToChat,
  chatHistory,
  onUpdateChatHistory 
}, ref) => {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [includeCurrentFile, setIncludeCurrentFile] = useState(false)
  const [aiConfig, setAiConfig] = useState(loadAIConfig())
  const [error, setError] = useState(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [textareaHeight, setTextareaHeight] = useState(4) // Initial rows
  const [position, setPosition] = useState(null) // null means use default positioning
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const textareaRef = useRef(null)
  const location = useLocation()

  const maxRows = 8 // Maximum rows before scroll
  const minRows = 4 // Minimum rows

  // Update AI config when it changes
  useEffect(() => {
    const handleStorageChange = () => {
      setAiConfig(loadAIConfig())
    }
    window.addEventListener('storage', handleStorageChange)
    const interval = setInterval(handleStorageChange, 1000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current
      textarea.style.height = 'auto'
      
      const scrollHeight = textarea.scrollHeight
      const lineHeight = 24 // Approximate line height in pixels
      const newRows = Math.max(minRows, Math.min(maxRows, Math.ceil(scrollHeight / lineHeight)))
      
      if (newRows <= maxRows) {
        setTextareaHeight(newRows)
        textarea.style.overflowY = 'hidden'
      } else {
        setTextareaHeight(maxRows)
        textarea.style.overflowY = 'auto'
      }
    }
  }, [message])

  // Dragging functionality
  const handleMouseDown = (e) => {
    e.preventDefault()
    setIsDragging(true)
    
    // Get the current window position
    const rect = e.currentTarget.closest('.floating-window').getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    
    const newX = e.clientX - dragOffset.x
    const newY = e.clientY - dragOffset.y
    
    // Get accurate window dimensions
    const windowWidth = 384 // w-96 = 384px
    const windowRect = document.querySelector('.floating-window')?.getBoundingClientRect()
    const windowHeight = windowRect ? windowRect.height : 400
    
    // Keep window within viewport bounds with proper constraints
    const maxX = window.innerWidth - windowWidth
    const maxY = window.innerHeight - windowHeight
    
    const constrainedX = Math.max(0, Math.min(maxX, newX))
    const constrainedY = Math.max(0, Math.min(maxY, newY))
    
    setPosition({
      x: constrainedX,
      y: constrainedY
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleDoubleClick = () => {
    // Double-click header to reset to default position
    setPosition(null)
  }

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragOffset.x, dragOffset.y])

  // Expose methods to parent components
  useImperativeHandle(ref, () => ({
    setMessage: (newMessage) => {
      setMessage(newMessage)
    },
    focusInput: () => {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }
  }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return
    
    setError(null)
    
    if (!aiConfig.apiKey || aiConfig.apiKey.length < 10) {
      setError('Please configure your AI API key in the Options tab first.')
      return
    }
    
    // Prepare context
    let context = null
    if (includeCurrentFile && files && activeFile && files[activeFile]) {
      context = `File: ${activeFile}\\n${files[activeFile].content}`
    }
    
    // Add user message to chat history
    const userMessage = { 
      type: 'user', 
      content: message,
      timestamp: new Date(),
      includeContext: includeCurrentFile && activeFile
    }
    
    const newChatHistory = [...chatHistory, userMessage]
    onUpdateChatHistory(newChatHistory)
    
    // Add temporary "thinking..." message
    const thinkingMessage = {
      type: 'ai',
      content: '🤔 Thinking...',
      timestamp: new Date(),
      isThinking: true
    }
    const chatWithThinking = [...newChatHistory, thinkingMessage]
    onUpdateChatHistory(chatWithThinking)
    
    setIsLoading(true)
    setMessage('')
    
    // Switch to chat tab and expand if minimized
    onSwitchToChat()
    
    try {
      const stageName = location.pathname.split('/').pop()
      const currentFile = files && activeFile && files[activeFile] ? files[activeFile].content : ''
      const systemPrompt = getSystemPrompt(stageName, activeFile, currentFile, files)
      
      const aiResponse = await callAI(systemPrompt, userMessage.content, context, chatHistory)
      const parsedResponse = parseAIResponse(aiResponse)
      
      // If there's code and we can update the editor
      if (parsedResponse.hasCode && onUpdateFile && activeFile && files && files[activeFile]) {
        onUpdateFile(activeFile, parsedResponse.code)
        
        const chatContent = parsedResponse.hasComments 
          ? parsedResponse.comments 
          : "I've updated your code. The changes have been applied to the editor."
        
        const chatMessage = {
          type: 'ai',
          content: chatContent + (parsedResponse.hasCode ? '\\n\\n✨ *Code has been updated in the editor*' : ''),
          timestamp: new Date(),
          hasCodeUpdate: true
        }
        onUpdateChatHistory([...newChatHistory, chatMessage])
      } else {
        const chatMessage = {
          type: 'ai',
          content: aiResponse,
          timestamp: new Date(),
          hasCodeUpdate: false
        }
        onUpdateChatHistory([...newChatHistory, chatMessage])
      }
      
    } catch (error) {
      console.error('AI API Error:', error)
      setError(error.message)
      
      const errorMessage = {
        type: 'ai',
        content: `❌ Sorry, I encountered an error: ${error.message}\\n\\nPlease check your API key configuration in the Options tab.`,
        timestamp: new Date(),
        isError: true
      }
      onUpdateChatHistory([...newChatHistory, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-0 right-0 z-50">
        <button
          onClick={() => {
            setIsMinimized(false)
            // Reset position when reopened
            setPosition(null)
          }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white p-3 rounded-full shadow-lg transition-all duration-200 m-2"
          title="Open AI Chat"
        >
          <MessageSquare size={20} />
        </button>
      </div>
    )
  }

  // Determine positioning style
  const windowStyle = position ? { 
    left: position.x, 
    top: position.y, 
    bottom: 'auto', 
    right: 'auto' 
  } : {}

  return (
    <div 
      className={`fixed z-50 w-96 max-w-[calc(100vw-1rem)] floating-window ${!position ? 'bottom-0 right-0' : ''}`}
      style={windowStyle}
    >
      <div className="bg-dark-800 border-2 border-indigo-600 rounded-lg shadow-xl mr-1 mb-1">
        {/* Header */}
        <div 
          className={`flex items-center justify-between p-3 border-b border-dark-600 cursor-move select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
          title="Drag to move, double-click to reset position"
        >
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              aiConfig.apiKey && aiConfig.apiKey.length > 10
                ? 'bg-green-500'
                : 'bg-red-500'
            }`} />
            <span className="text-white text-sm font-medium">AI Assistant</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 text-dark-400 hover:text-white transition-colors"
              title="Minimize"
            >
              <MessageSquare size={14} />
            </button>
            <button
              onClick={() => {
                setIsMinimized(true)
                // Reset position when closing
                setPosition(null)
              }}
              className="p-1 text-dark-400 hover:text-white transition-colors"
              title="Close"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-600/10 border-b border-red-600/20">
            <p className="text-red-300 text-xs">{error}</p>
          </div>
        )}

        {/* Input Area */}
        <div className="p-3">
          {/* Quick actions */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setIncludeCurrentFile(!includeCurrentFile)}
              disabled={!files || !activeFile || !files[activeFile]}
              className={`flex items-center gap-1 px-2 py-1 text-xs border rounded transition-colors ${
                includeCurrentFile && activeFile 
                  ? 'bg-blue-600 border-blue-500 text-white' 
                  : 'bg-dark-700 hover:bg-dark-600 border-dark-600 text-white disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              <Code size={10} />
              {includeCurrentFile ? `✓ ${activeFile}` : 'Attach Code'}
            </button>
            <button
              onClick={() => {
                setMessage("Please review my current file for security issues and suggest improvements.")
                if (files && activeFile && files[activeFile]) {
                  setIncludeCurrentFile(true)
                }
              }}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded text-white transition-colors"
            >
              <FileText size={10} />
              Security Review
            </button>
          </div>

          {/* Message input */}
          <form onSubmit={handleSubmit} className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about your contract, request code reviews, or get development guidance..."
                className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-dark-400 transition-all duration-150"
                rows={textareaHeight}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
                style={{ 
                  minHeight: `${minRows * 24}px`,
                  maxHeight: `${maxRows * 24}px`
                }}
              />
              {message && (
                <div className="absolute bottom-1 right-1 text-xs text-dark-500">
                  ⏎ to send
                </div>
              )}
            </div>
            <div className="mb-2">
              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className="px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-dark-600 disabled:to-dark-600 disabled:text-dark-400 text-white rounded-md transition-all flex items-center gap-1 font-medium"
              >
                {isLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Send size={14} />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
})

export default FloatingChatInput