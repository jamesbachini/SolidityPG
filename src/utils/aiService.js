// AI Service Configuration

const AI_CONFIG_STORAGE_KEY = 'soliditypg_ai_config'

import { stagePrompts } from './stagePrompts'

window.test1 = stagePrompts;

export const AI_PROVIDERS = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  GOOGLE: 'google'
}

export const AI_MODELS = {
  [AI_PROVIDERS.OPENAI]: [
    { id: 'gpt-5', name: 'OpenAI GPT-5', contextLimit: 200000 },
    { id: 'gpt-5-mini', name: 'OpenAI GPT-5-mini', contextLimit: 200000 },
  ],
  [AI_PROVIDERS.ANTHROPIC]: [
    { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', contextLimit: 200000 }
  ],
  [AI_PROVIDERS.GOOGLE]: [
    { id: 'gemini-2.0-flash', name: 'Gemini 2.5 Flash', contextLimit: 1000000, disabled: true },
    { id: 'gemini-2.0-pro', name: 'Gemini 2.5 Pro', contextLimit: 2000000, disabled: true }
  ]
}

export const DEFAULT_CONFIG = {
  provider: AI_PROVIDERS.OPENAI,
  model: 'gpt-5-mini',
  apiKey: '',
  temperature: 1,
  maxTokens: 4096
}

export const saveAIConfig = (config) => {
  try {
    localStorage.setItem(AI_CONFIG_STORAGE_KEY, JSON.stringify(config))
  } catch (error) {
    console.warn('Failed to save AI config:', error)
  }
}

export const loadAIConfig = () => {
  try {
    const saved = localStorage.getItem(AI_CONFIG_STORAGE_KEY)
    return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG
  } catch {
    return DEFAULT_CONFIG
  }
}

// Custom AI gateway - handles CORS automatically
const AI_BASE_URL = 'https://proxy.soropg.com/p'

// API endpoints for different providers
const API_ENDPOINTS = {
  [AI_PROVIDERS.OPENAI]: 'https://api.openai.com/v1/chat/completions',
  [AI_PROVIDERS.ANTHROPIC]: 'https://api.anthropic.com/v1/messages',
  [AI_PROVIDERS.GOOGLE]: 'https://generativelanguage.googleapis.com/v1beta/models'
}

// Format message for different providers
const formatMessage = (provider, systemPrompt, userMessage, context = null, chatHistory = []) => {
  let fullSystemPrompt = systemPrompt
  
  if (context) {
    fullSystemPrompt += `\n\nCurrent file context:\n${context}`
  }

  const config = loadAIConfig()

  // Convert chat history to appropriate format
  const formatChatHistory = (history) => {
    return history.map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content
    }))
  }

  switch (provider) {
    case AI_PROVIDERS.OPENAI: {
      const messages = [
        { role: 'system', content: fullSystemPrompt }
      ]
      
      // Add chat history
      if (chatHistory.length > 0) {
        messages.push(...formatChatHistory(chatHistory))
      }
      
      // Add current user message
      messages.push({ role: 'user', content: userMessage })

      const openaiBody = {
        model: config.model,
        max_completion_tokens: config.maxTokens,
        messages: messages
      }
      
      // Only add temperature for models that support it
      // GPT-5 and o1 models only support temperature = 1
      if (!config.model.includes('gpt-5') && !config.model.includes('o1-')) {
        openaiBody.temperature = config.temperature
      }
      
      return openaiBody
    }
    
    case AI_PROVIDERS.ANTHROPIC: {
      const messages = []
      
      // Add chat history
      if (chatHistory.length > 0) {
        messages.push(...formatChatHistory(chatHistory))
      }
      
      // Add current user message
      messages.push({ role: 'user', content: userMessage })

      return {
        model: config.model,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        system: fullSystemPrompt,
        messages: messages
      }
    }
    
    case AI_PROVIDERS.GOOGLE: {
      // For Google, we need to format chat history as part of the contents
      let fullContent = fullSystemPrompt
      
      // Add chat history to content
      if (chatHistory.length > 0) {
        const historyText = chatHistory.map(msg => 
          `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n\n')
        fullContent += `\n\nPrevious conversation:\n${historyText}`
      }
      
      fullContent += `\n\nUser: ${userMessage}`
      
      return {
        contents: [{
          parts: [{
            text: fullContent
          }]
        }],
        generationConfig: {
          temperature: config.temperature,
          maxOutputTokens: config.maxTokens
        }
      }
    }
    
    default:
      throw new Error(`Unsupported provider: ${provider}`)
  }
}

// Main AI API call function
export const callAI = async (systemPrompt, userMessage, context = null, chatHistory = []) => {
  const config = loadAIConfig()
  
  if (!config.apiKey) {
    throw new Error('API key is required. Please configure your AI settings.')
  }

  // Google models are disabled for now
  if (config.provider === AI_PROVIDERS.GOOGLE) {
    throw new Error('Google models coming soon!')
  }

  const provider = config.provider
  const endpoint = API_ENDPOINTS[provider]
  const body = formatMessage(provider, systemPrompt, userMessage, context, chatHistory)
  
  // Build AI gateway URL
  const aiUrl = `${AI_BASE_URL}?url=${encodeURIComponent(endpoint)}`
  
  // Provider-specific headers
  const headers = {
    'Content-Type': 'application/json'
  }
  
  switch (provider) {
    case AI_PROVIDERS.OPENAI:
      headers['Authorization'] = `Bearer ${config.apiKey}`
      break
    
    case AI_PROVIDERS.ANTHROPIC:
      headers['x-api-key'] = config.apiKey
      headers['anthropic-version'] = '2023-06-01'
      break
  }

  try {
    const response = await fetch(aiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      let errorText
      try {
        errorText = await response.text()
      } catch (e) {
        errorText = `Failed to read error response: ${e.message}`
      }
      console.error('AI Gateway Error Details:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        errorText: errorText,
        url: aiUrl
      })
      throw new Error(`AI API Error (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    return extractResponse(provider, data)
  } catch (error) {
    console.error('AI API call failed:', error)
    
    // Enhanced error handling
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(`Network error: Please check your internet connection and API key.\n\nError details: ${error.message}`)
    }
    
    throw error
  }
}

// Extract response content from different provider formats
const extractResponse = (provider, data) => {
  switch (provider) {
    case AI_PROVIDERS.OPENAI:
      return data.choices?.[0]?.message?.content || 'No response received'
    
    case AI_PROVIDERS.ANTHROPIC:
      return data.content?.[0]?.text || 'No response received'
    
    case AI_PROVIDERS.GOOGLE:
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received'
    
    default:
      throw new Error(`Unsupported provider: ${provider}`)
  }
}

export const parseAIResponse = (response) => {
  const result = {
    code: '',
    comments: '',
    hasCode: false,
    hasComments: false
  }
  // Match only fenced code blocks without language: ```\n...\n```
  const codeBlockRegex = /```\n?([\s\S]*?)```/g
  const codeMatches = [...response.matchAll(codeBlockRegex)]
  if (codeMatches.length > 0) {
    // Extract and join all code blocks
    result.code = codeMatches.map(match => match[1].trim()).join('\n\n')
    result.hasCode = true

    // Remove code blocks for commentary
    result.comments = response.replace(codeBlockRegex, '').trim()
    result.hasComments = result.comments.length > 0
  } else {
    // No fenced blocks, treat entire response as comments
    result.comments = response.trim()
    result.hasComments = result.comments.length > 0
  }

  return result
}

// System prompts for different contexts
export const getSystemPrompt = (stage, fileName, fileContent, allFiles = null) => {
  let contextFiles = ''
  // Include relevant files based on the current stage
  if (allFiles) {
    if (stage === 'build') {
      // For build stage, include spec.md and contract.sol
      const relevantFiles = ['spec.md', 'contract.sol']
      const fileContexts = relevantFiles
        .filter(file => allFiles[file] && allFiles[file].content)
        .map(file => `=== ${file} ===\n${allFiles[file].content}`)
      if (fileContexts.length > 0) {
        contextFiles = `\n\nRelevant project files for context:\n${fileContexts.join('\n\n')}`
      }
    } else if (stage === 'test') {
      // For test stage, include spec.md, contract.sol, and tests.sol
      const relevantFiles = ['spec.md', 'contract.sol', 'tests.sol']
      const fileContexts = relevantFiles
        .filter(file => allFiles[file] && allFiles[file].content)
        .map(file => `=== ${file} ===\n${allFiles[file].content}`)
      
      if (fileContexts.length > 0) {
        contextFiles = `\n\nRelevant project files for context:\n${fileContexts.join('\n\n')}`
      }
    }
  }

  const basePrompt = `You are providing an AI assisted development experience for Solidity smart contracts.

Your response will be returned to an online IDE where it will populate the chat window and code will be added to the text-editor

IMPORTANT INSTRUCTIONS:
1. When providing a response break it down into two parts. The comments for the chat window and a single complete code block to replace the file inside \`\`\` code blocks
2. The entire file will be overwritten with your response so do not leave any placeholders or //remains unchanged comments with missing code
3. When updating existing code, provide the complete updated version

I am using this regex /\`\`\`\\n?([\\s\\S]*?)\`\`\`/g to separate the response so please only send back comments and a single complete code.
Any code you send back will replace the existing file, if you just want to discuss a line of code or small snippet then do not include the \`\`\`\ tags.

Current file: ${fileName}
Current stage: ${stage}${contextFiles}

${fileContent ? `Current file content:\n\`\`\`\n${fileContent}\n\`\`\`` : ''}`


  return basePrompt + (stagePrompts[stage] || stagePrompts.build)
}