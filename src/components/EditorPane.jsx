import { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'
import { useLocation } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { X, Plus, Save, CheckCircle } from 'lucide-react'

// Storage utilities
const STORAGE_KEY = 'soliditypg_project'

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

const saveToStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.warn('Failed to save to localStorage:', error)
  }
}

const DEFAULT_FILES = {
  'README.md': {
    content: `# SolidityPG - AI-Assisted Smart Contract Development

Welcome to the future of smart contract development! This platform combines the power of AI with professional development workflows to help you build secure, efficient Solidity contracts.

## 🚀 How This Platform Works

### 1. **AI-Powered Workflow**
- Each stage (Spec, Build, Test, Deploy, Integrate) has specialized AI prompts
- Get contextual suggestions based on your current development phase
- AI analyzes your code and provides security recommendations

### 2. **Multi-File Project Management**
- Work with multiple files: specifications, contracts, tests, deployment scripts
- File tabs make it easy to switch between different components
- Automatic file type detection and syntax highlighting

### 3. **Security-First Development**
- Built-in security checklist with 20+ security considerations
- AI-powered security analysis and vulnerability detection
- Best practices guidance at every stage

### 4. **Interactive Chat Assistant**
- Stage-specific suggested prompts
- Code review and optimization suggestions  
- Real-time development guidance
- Attach code snippets for detailed analysis

## 💡 Getting Started

1. **Navigate** using the bottom workflow tabs
2. **Chat** with the AI assistant for guidance
3. **Use file tabs** to manage your project files
4. **Follow the workflow**: Spec → Build → Test → Deploy → Integrate

## 🔧 Key Features

- **BYO API Keys**: Your keys stay local, no data sent to our servers
- **Multiple AI Models**: Choose from top providers (Claude, GPT, Gemini, etc.)
- **Professional Workflow**: Based on industry best practices
- **Mobile Responsive**: Code anywhere, anytime

Start by clicking on the **Spec** tab below to define your contract requirements!
`,
    language: 'markdown'
  },
  'spec.md': {
    content: `# Contract Specification

## Overview
*Brief description of what this contract does*

## Requirements
*Functional requirements*

## User Roles
*Define user roles and permissions*

## Functions
*List of required functions*

## Events
*Events to be emitted*

## Security Considerations
*Security requirements and considerations*

## Dependencies
*External contracts or libraries*
`,
    language: 'markdown'
  },
  'contract.sol': {
    content: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/**
 * @title 
 * @dev 
 */
contract MyContract {
    
}`,
    language: 'solidity'
  },
  'tests.sol': {
    content: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Test.sol";

contract MyContractTest is Test {
    
    function setUp() public {
        // Setup test environment
    }
    
    function testExample() public {
        // Test implementation
        assertTrue(true);
    }
}`,
    language: 'solidity'
  }
}

const EditorPane = forwardRef(function EditorPane({ onDataChange }, ref) {
  const editorRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [files, setFiles] = useState(() => {
    const saved = loadFromStorage()
    return saved?.files || DEFAULT_FILES
  })
  const [activeFile, setActiveFile] = useState(() => {
    const saved = loadFromStorage()
    return saved?.activeFile || 'README.md'
  })
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const location = useLocation()

  // Auto-save functionality
  const saveProject = useCallback(() => {
    setIsAutoSaving(true)
    saveToStorage({ files, activeFile })
    setLastSaved(new Date())
    setTimeout(() => setIsAutoSaving(false), 500)
  }, [files, activeFile])

  // Auto-save on changes
  useEffect(() => {
    const timer = setTimeout(saveProject, 1000)
    return () => clearTimeout(timer)
  }, [files, saveProject])

  // Expose data to parent
  useEffect(() => {
    if (onDataChange) {
      onDataChange({ files, activeFile })
    }
  }, [files, activeFile, onDataChange])

  useImperativeHandle(ref, () => ({
    getFiles: () => files,
    getActiveFile: () => activeFile,
    updateFile: (fileName, content) => {
      setFiles(prev => ({
        ...prev,
        [fileName]: {
          ...prev[fileName],
          content
        }
      }))
    }
  }))

  // Set default active file based on current page
  useEffect(() => {
    if (location.pathname.includes('/start')) {
      setActiveFile('README.md')
    } else if (location.pathname.includes('/spec')) {
      setActiveFile('spec.md')
    } else if (location.pathname.includes('/build')) {
      setActiveFile('contract.sol')
    } else if (location.pathname.includes('/test')) {
      setActiveFile('tests.sol')
    }
  }, [location.pathname])

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor
    
    // Register Solidity language
    if (!monaco.languages.getLanguages().find(lang => lang.id === 'solidity')) {
      monaco.languages.register({ id: 'solidity' })
      
      // Define Solidity tokens
      monaco.languages.setMonarchTokensProvider('solidity', {
        tokenizer: {
          root: [
            [/\b(pragma|import|contract|interface|library|abstract|function|modifier|event|struct|enum|mapping|using|for)\b/, 'keyword'],
            [/\b(public|private|internal|external|pure|view|payable|nonpayable|override|virtual|constant|immutable)\b/, 'keyword.modifier'],
            [/\b(constructor|fallback|receive)\b/, 'keyword.special'],
            [/\b(if|else|while|for|do|break|continue|return|try|catch|throw|emit)\b/, 'keyword.control'],
            [/\b(uint|int|bytes|string|bool|address)\d*\b/, 'type'],
            [/\b(true|false|null|this|super|now|msg|tx|block|abi|wei|ether|gwei|seconds|minutes|hours|days|weeks|years)\b/, 'constant.builtin'],
            [/\/\/.*$/, 'comment'],
            [/\/\*[\s\S]*?\*\//, 'comment'],
            [/"[^"]*"/, 'string'],
            [/'[^']*'/, 'string'],
            [/\b0x[a-fA-F0-9]+\b/, 'number.hex'],
            [/\b\d+(\.\d+)?([eE][+-]?\d+)?\b/, 'number'],
            [/[{}()[\\]]/, 'delimiter.bracket'],
            [/[;,.]/, 'delimiter']
          ]
        }
      })
      
      // Define Solidity theme
      monaco.editor.defineTheme('solidity-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'keyword', foreground: '569cd6' },
          { token: 'keyword.modifier', foreground: '9cdcfe' },
          { token: 'keyword.special', foreground: 'c586c0' },
          { token: 'keyword.control', foreground: 'c586c0' },
          { token: 'type', foreground: '4ec9b0' },
          { token: 'constant.builtin', foreground: '4fc1ff' },
          { token: 'comment', foreground: '6a9955' },
          { token: 'string', foreground: 'ce9178' },
          { token: 'number', foreground: 'b5cea8' },
          { token: 'number.hex', foreground: 'b5cea8' }
        ],
        colors: {}
      })
    }
    
    // Configure editor
    editor.updateOptions({
      fontSize: 14,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      wordWrap: 'on',
      lineNumbers: 'on',
      folding: true,
      renderWhitespace: 'selection',
      bracketPairColorization: { enabled: true },
      formatOnPaste: true,
      formatOnType: true
    })
    
    setIsLoading(false)
  }

  const handleEditorChange = (value) => {
    setFiles(prev => ({
      ...prev,
      [activeFile]: {
        ...prev[activeFile],
        content: value || ''
      }
    }))
  }

  const addFile = () => {
    const fileName = prompt('Enter file name (e.g., deployment.sh, bindings.js):')
    if (fileName && !files[fileName]) {
      const extension = fileName.split('.').pop()
      let language = 'javascript'
      let content = ''
      
      if (extension === 'sol') {
        language = 'solidity'
        content = '// SPDX-License-Identifier: MIT\npragma solidity ^0.8.19;\n\ncontract NewContract {\n    \n}'
      } else if (extension === 'sh') {
        language = 'shell'
        content = '#!/bin/bash\n\n# Deployment script\n'
      } else if (extension === 'js') {
        language = 'javascript'
        content = '// JavaScript bindings\n\n'
      } else if (extension === 'ts') {
        language = 'typescript'
        content = '// TypeScript bindings\n\n'
      } else if (extension === 'md') {
        language = 'markdown'
        content = '# Document\n\n'
      }
      
      setFiles(prev => ({
        ...prev,
        [fileName]: { content, language }
      }))
      setActiveFile(fileName)
    }
  }

  const removeFile = (fileName) => {
    if (Object.keys(DEFAULT_FILES).includes(fileName)) {
      alert('Cannot remove default files')
      return
    }
    
    const newFiles = { ...files }
    delete newFiles[fileName]
    setFiles(newFiles)
    
    if (activeFile === fileName) {
      setActiveFile(Object.keys(newFiles)[0])
    }
  }

  const currentFile = files[activeFile] || DEFAULT_FILES['spec.md']

  return (
    <div className="h-full bg-dark-900 flex flex-col">
      {/* File tabs */}
      <div className="bg-dark-800 border-b border-dark-600 flex items-center">
        <div className="flex items-center overflow-x-auto">
          {Object.keys(files).map(fileName => (
            <div
              key={fileName}
              className={`flex items-center group border-r border-dark-600 ${
                activeFile === fileName
                  ? 'bg-dark-700 text-white'
                  : 'text-dark-300 hover:bg-dark-700 hover:text-white'
              }`}
            >
              <button
                onClick={() => setActiveFile(fileName)}
                className="px-3 py-2 text-sm font-medium min-w-0 flex-1"
              >
                {fileName}
              </button>
              {!Object.keys(DEFAULT_FILES).includes(fileName) && (
                <button
                  onClick={() => removeFile(fileName)}
                  className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-600 rounded mr-1"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={addFile}
          className="p-2 text-dark-300 hover:text-white hover:bg-dark-700 border-l border-dark-600"
          title="Add new file"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-900 z-10">
            <div className="text-dark-300">Loading editor...</div>
          </div>
        )}
        
        <Editor
          height="100%"
          language={currentFile.language}
          theme={currentFile.language === 'solidity' ? 'solidity-dark' : 'vs-dark'}
          value={currentFile.content}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          options={{
            readOnly: false,
            automaticLayout: true,
          }}
        />
      </div>
      
      {/* Status bar */}
      <div className="bg-dark-800 border-t border-dark-600 px-3 py-1 flex items-center justify-between text-xs text-dark-300">
        <div className="flex items-center gap-4">
          <span>{activeFile}</span>
          <span>•</span>
          <span>{currentFile.language}</span>
          <span>•</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-4">
          {isAutoSaving ? (
            <div className="flex items-center gap-1 text-yellow-400">
              <Save size={12} className="animate-pulse" />
              <span>Saving...</span>
            </div>
          ) : lastSaved ? (
            <div className="flex items-center gap-1 text-green-400">
              <CheckCircle size={12} />
              <span>Saved {lastSaved.toLocaleTimeString()}</span>
            </div>
          ) : (
            <span>Ready</span>
          )}
          <span>•</span>
          <span>Line 1, Col 1</span>
        </div>
      </div>
    </div>
  )
})

export default EditorPane