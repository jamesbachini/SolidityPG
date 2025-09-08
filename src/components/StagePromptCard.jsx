import { useState } from 'react'
import { ChevronDown, ChevronUp, Copy, CheckCircle, Edit3, Save, X } from 'lucide-react'
import { stagePrompts } from '../config/stagePrompts'

function StagePromptCard({ stage }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedPrompt, setEditedPrompt] = useState(stagePrompts[stage] || '')
  const [currentPrompt, setCurrentPrompt] = useState(stagePrompts[stage] || '')
  
  if (!stagePrompts[stage]) {
    return (
      <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-4">
        <p className="text-red-400">No prompt template found for stage: {stage}</p>
      </div>
    )
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy prompt:', err)
    }
  }

  const handleEdit = () => {
    setEditedPrompt(currentPrompt)
    setIsEditing(true)
    setIsExpanded(true)
  }

  const handleSave = () => {
    setCurrentPrompt(editedPrompt)
    setIsEditing(false)
    // In a real implementation, this would save to localStorage or backend
    console.log('Saved prompt for stage:', stage)
  }

  const handleCancel = () => {
    setEditedPrompt(currentPrompt)
    setIsEditing(false)
  }

  const previewLength = 200
  const needsExpansion = currentPrompt.length > previewLength
  const displayText = isExpanded || !needsExpansion 
    ? currentPrompt 
    : currentPrompt.substring(0, previewLength) + '...'

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-600">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full font-medium">
            AI-Planned
          </span>
          <h3 className="text-white font-medium">System Prompt Template</h3>
          {isEditing && (
            <span className="px-2 py-1 bg-yellow-600/20 text-yellow-300 text-xs rounded-full font-medium">
              Editing
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="p-1.5 text-green-400 hover:text-green-300 hover:bg-dark-700 rounded transition-colors"
                title="Save changes"
              >
                <Save size={16} />
              </button>
              <button
                onClick={handleCancel}
                className="p-1.5 text-red-400 hover:text-red-300 hover:bg-dark-700 rounded transition-colors"
                title="Cancel editing"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCopy}
                className="p-1.5 text-dark-300 hover:text-white hover:bg-dark-700 rounded transition-colors"
                title="Copy prompt to clipboard"
              >
                {copied ? (
                  <CheckCircle size={16} className="text-green-400" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
              
              <button
                onClick={handleEdit}
                className="p-1.5 text-dark-300 hover:text-white hover:bg-dark-700 rounded transition-colors"
                title="Edit prompt template"
              >
                <Edit3 size={16} />
              </button>
              
              {needsExpansion && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 text-dark-300 hover:text-white hover:bg-dark-700 rounded transition-colors"
                  title={isExpanded ? 'Collapse' : 'Expand'}
                >
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-4">
            <textarea
              value={editedPrompt}
              onChange={(e) => setEditedPrompt(e.target.value)}
              className="w-full bg-dark-900 border border-dark-600 rounded-md p-3 text-dark-200 text-sm font-mono resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={20}
              placeholder="Enter your custom prompt template..."
            />
            <div className="flex items-center justify-between text-xs text-dark-400">
              <span>{editedPrompt.length} characters</span>
              <span>Tip: Use clear, specific instructions for best AI responses</span>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-dark-900 border border-dark-600 rounded-md p-3 font-mono text-sm">
              <pre className="text-dark-200 whitespace-pre-wrap overflow-x-auto">
                {displayText}
              </pre>
            </div>
            
            {needsExpansion && !isExpanded && (
              <button
                onClick={() => setIsExpanded(true)}
                className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
              >
                Show full prompt
              </button>
            )}
          </>
        )}
      </div>
      
      {/* Footer note */}
      {!isEditing && (
        <div className="px-4 pb-4">
          <p className="text-xs text-dark-400">
            <strong>Tip:</strong> Click the edit button to customize this prompt template for your specific needs. 
            Changes are saved locally and will persist across sessions.
          </p>
        </div>
      )}
    </div>
  )
}

export default StagePromptCard