import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Send, Sparkles, Code, FileText, Loader2, Zap, RefreshCw, Edit3, AlertCircle } from 'lucide-react'
import { callAI, getSystemPrompt, parseAIResponse, loadAIConfig } from '../../utils/aiService'

function ChatPanel({ files, activeFile, onUpdateFile }) {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('soliditypg_chat_history')
      if (saved) {
        const parsed = JSON.parse(saved)
        // Convert timestamp strings back to Date objects
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
  const [includeCurrentFile, setIncludeCurrentFile] = useState(false)
  const [aiConfig, setAiConfig] = useState(loadAIConfig())
  const [error, setError] = useState(null)
  const location = useLocation()
  const chatContainerRef = useRef(null)

  // Update AI config when it changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setAiConfig(loadAIConfig())
    }
    window.addEventListener('storage', handleStorageChange)
    
    // Also check periodically for changes
    const interval = setInterval(handleStorageChange, 1000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  // Save chat history
  useEffect(() => {
    try {
      localStorage.setItem('soliditypg_chat_history', JSON.stringify(chatHistory))
    } catch (error) {
      console.warn('Failed to save chat history:', error)
    }
  }, [chatHistory])

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      // Use setTimeout to ensure DOM updates are complete
      setTimeout(() => {
        if (chatContainerRef.current) {
          // Scroll the chat container into view (it will scroll the parent sidebar)
          chatContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
      }, 0)
    }
  }, [chatHistory])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return
    
    // Clear any previous errors
    setError(null)
    
    // Check if AI is configured
    if (!aiConfig.apiKey || aiConfig.apiKey.length < 10) {
      setError('Please configure your AI API key in the Options tab first.')
      return
    }
    
    // Prepare context
    let context = null
    if (includeCurrentFile && files && activeFile && files[activeFile]) {
      context = `File: ${activeFile}\n${files[activeFile].content}`
    }
    
    // Add user message to chat
    const userMessage = { 
      type: 'user', 
      content: message,
      timestamp: new Date(),
      includeContext: includeCurrentFile && activeFile
    }
    setChatHistory(prev => [...prev, userMessage])
    
    setIsLoading(true)
    setMessage('')
    
    try {
      // Get current stage for system prompt
      const stageName = location.pathname.split('/').pop()
      const currentFile = files && activeFile && files[activeFile] ? files[activeFile].content : ''
      const systemPrompt = getSystemPrompt(stageName, activeFile, currentFile)
      
      // Call AI API
      const aiResponse = await callAI(systemPrompt, message, context)
      
      // Parse the response to separate code from comments
      const parsedResponse = parseAIResponse(aiResponse)
      
      console.log('AI Response parsed:', {
        hasCode: parsedResponse.hasCode,
        hasComments: parsedResponse.hasComments,
        code: parsedResponse.code,
        comments: parsedResponse.comments,
        onUpdateFile: !!onUpdateFile,
        activeFile,
        hasActiveFile: !!(files && activeFile && files[activeFile]),
        filesObject: files,
        activeFileContent: files && activeFile ? files[activeFile] : null
      })
      
      // If there's code and we can update the editor
      if (parsedResponse.hasCode && onUpdateFile && activeFile && files && files[activeFile]) {
        console.log('✅ All conditions met - calling onUpdateFile with:', {
          activeFile,
          codeLength: parsedResponse.code.length,
          codePreview: parsedResponse.code.substring(0, 100) + '...'
        })
        
        // Update the current file with the generated code
        onUpdateFile(activeFile, parsedResponse.code)
        
        // Show comments in chat if any
        const chatContent = parsedResponse.hasComments 
          ? parsedResponse.comments 
          : "I've updated your code. The changes have been applied to the editor."
        
        const chatMessage = {
          type: 'ai',
          content: chatContent + (parsedResponse.hasCode ? '\n\n✨ *Code has been updated in the editor*' : ''),
          timestamp: new Date(),
          hasCodeUpdate: true
        }
        setChatHistory(prev => [...prev, chatMessage])
      } else {
        console.log('❌ Code NOT updated - reasons:', {
          hasCode: parsedResponse.hasCode,
          hasOnUpdateFile: !!onUpdateFile,
          hasActiveFile: !!activeFile,
          hasFilesAndActiveFile: !!(files && files[activeFile]),
          fullCondition: parsedResponse.hasCode && onUpdateFile && activeFile && files && files[activeFile]
        })
        
        // No code to update, just show the response
        const chatMessage = {
          type: 'ai',
          content: aiResponse,
          timestamp: new Date(),
          hasCodeUpdate: false
        }
        setChatHistory(prev => [...prev, chatMessage])
      }
      
    } catch (error) {
      console.error('AI API Error:', error)
      setError(error.message)
      
      // Add error message to chat
      const errorMessage = {
        type: 'ai',
        content: `❌ Sorry, I encountered an error: ${error.message}\n\nPlease check your API key configuration in the Options tab.`,
        timestamp: new Date(),
        isError: true
      }
      setChatHistory(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const getSuggestedPrompts = () => {
    const path = location.pathname
    if (path.includes('/spec')) {
      return [
        "Help me define the requirements for a token contract",
        "What security considerations should I include?",
        "Create a specification checklist for my use case"
      ]
    } else if (path.includes('/build')) {
      return [
        "Review my contract for security issues",
        "Help me implement a specific function",
        "Suggest gas optimization improvements"
      ]
    } else if (path.includes('/test')) {
      return [
        "Create comprehensive unit tests",
        "Help me test for security vulnerabilities",
        "Generate property-based test cases"
      ]
    } else if (path.includes('/deploy')) {
      return [
        "Create a deployment script",
        "Help me configure constructor parameters",
        "Guide me through testnet deployment"
      ]
    } else if (path.includes('/integrate')) {
      return [
        "Generate TypeScript bindings",
        "Create React integration code",
        "Help with wallet connection setup"
      ]
    }
    return [
      "Help me plan a smart contract project",
      "Explain Solidity best practices",
      "Review my code for improvements"
    ]
  }

  const handleSuggestedPrompt = (prompt) => {
    setMessage(prompt)
  }

  const handleAttachCode = () => {
    if (files && activeFile && files[activeFile]) {
      setIncludeCurrentFile(!includeCurrentFile)
    }
  }

  const clearChat = () => {
    setChatHistory([])
  }

  return (
    <div className="flex flex-col min-h-full bg-gradient-to-b from-dark-800 to-dark-900">
      {/* Header */}
      <div className="p-4 border-b border-dark-600 bg-dark-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              aiConfig.apiKey && aiConfig.apiKey.length > 10
                ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                : 'bg-gray-600'
            }`}>
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">AI Assistant</h3>
              <p className="text-xs text-dark-300">
                {aiConfig.apiKey && aiConfig.apiKey.length > 10 
                  ? `Connected • ${aiConfig.provider}` 
                  : 'Setup required in Options tab'
                }
              </p>
            </div>
          </div>
          {chatHistory.length > 0 && (
            <button
              onClick={clearChat}
              className="p-1 text-dark-400 hover:text-white transition-colors"
              title="Clear conversation"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-3">
            <div className="flex items-start gap-2 text-red-300 text-sm">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium mb-1">Configuration Error</div>
                <div className="text-xs text-red-200/80">{error}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat history */}
      <div ref={chatContainerRef} className="flex-shrink-0">
        {chatHistory.length === 0 ? (
          <div className="p-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Welcome to AI Assisted Development</h3>
              <p className="text-dark-300 text-sm">
                Get expert guidance at every stage of your smart contract development
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-white mb-2">✨ Suggested prompts for this stage:</h4>
                <div className="space-y-2">
                  {getSuggestedPrompts().map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestedPrompt(prompt)}
                      className="w-full text-left p-3 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-lg text-sm text-dark-200 hover:text-white transition-colors"
                    >
                      <Zap size={12} className="inline mr-2 text-blue-400" />
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-300 mb-2">💡 Pro Tips</h4>
                <ul className="text-xs text-blue-200/80 space-y-1">
                  <li>• Be specific about your requirements</li>
                  <li>• Ask for code reviews and security analysis</li>
                  <li>• Request explanations for complex concepts</li>
                  <li>• Use &quot;Attach Code&quot; to include your current work</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : ''}`}>
                {msg.type === 'ai' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles size={14} className="text-white" />
                  </div>
                )}
                <div className={`max-w-xs lg:max-w-sm ${msg.type === 'user' ? 'order-2' : ''}`}>
                  <div className={`rounded-lg p-3 text-sm ${
                    msg.type === 'user' 
                      ? 'bg-blue-600 text-white ml-auto'
                      : msg.isError 
                        ? 'bg-red-600/20 border border-red-600/30 text-red-300'
                        : 'bg-dark-700 text-dark-200'
                  }`}>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    {msg.includeContext && (
                      <div className="mt-2 pt-2 border-t border-blue-500/20">
                        <div className="flex items-center gap-1 text-blue-200 text-xs">
                          <Code size={10} />
                          <span>Included: {activeFile}</span>
                        </div>
                      </div>
                    )}
                    {msg.hasCodeUpdate && (
                      <div className="mt-2 pt-2 border-t border-green-500/20">
                        <div className="flex items-center gap-1 text-green-300 text-xs">
                          <Edit3 size={10} />
                          <span>Code updated in editor</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={`text-xs text-dark-400 mt-1 ${msg.type === 'user' ? 'text-right' : ''}`}>
                    {msg.timestamp instanceof Date ? msg.timestamp.toLocaleTimeString() : new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                {msg.type === 'user' && (
                  <div className="w-8 h-8 bg-dark-600 rounded-full flex items-center justify-center flex-shrink-0 order-1">
                    <span className="text-white text-sm font-medium">U</span>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Sparkles size={14} className="text-white" />
                </div>
                <div className="bg-dark-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-dark-300">
                    <Loader2 size={14} className="animate-spin" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-dark-600 p-4 bg-dark-800">
        {/* Quick actions */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={handleAttachCode}
            disabled={!files || !activeFile || !files[activeFile]}
            className={`flex items-center gap-1 px-2 py-1 text-xs border rounded transition-colors ${
              includeCurrentFile && activeFile 
                ? 'bg-blue-600 border-blue-500 text-white' 
                : 'bg-dark-700 hover:bg-dark-600 border-dark-600 text-white disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
            title={`${includeCurrentFile ? 'Remove' : 'Include'} current file context`}
          >
            <Code size={12} />
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
            title="Quick security review"
          >
            <FileText size={12} />
            Security Review
          </button>
        </div>

        {/* Message input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about your contract, request code reviews, or get development guidance..."
              className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-dark-400"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            {message && (
              <div className="absolute bottom-1 right-1 text-xs text-dark-500">
                ⏎ to send
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-dark-600 disabled:to-dark-600 disabled:text-dark-400 text-white rounded-md transition-all flex items-center gap-1 font-medium"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </form>

        {/* Status message */}
        <div className="mt-2 text-xs text-dark-500 text-center">
          🔒 Your conversations and API keys stay local • No data sent to our servers
        </div>
      </div>
    </div>
  )
}

export default ChatPanel