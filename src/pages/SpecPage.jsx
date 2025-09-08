import { useState } from 'react'
import { Wand2, Play, CheckCircle2, Circle } from 'lucide-react'
import StagePromptCard from '../components/StagePromptCard'

function SpecPage() {
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Define contract purpose and use cases', checked: false },
    { id: 2, text: 'Specify user roles and permissions', checked: false },
    { id: 3, text: 'List required functions and events', checked: false },
    { id: 4, text: 'Identify potential security risks', checked: false },
    { id: 5, text: 'Define upgrade strategy if needed', checked: false },
  ])

  const toggleChecklistItem = (id) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ))
  }

  const handleSpecWizard = () => {
    console.log('TODO: Launch spec wizard')
    alert('Spec Wizard will guide you through defining requirements step by step!')
  }

  const handleRunPrompt = () => {
    console.log('TODO: Run spec prompt and update editor')
    alert('Running AI prompt to generate specification based on your inputs!')
  }

  return (
    <div className="p-6 bg-stone-950">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Contract Specification</h1>
          <p className="text-dark-300">
            Define your smart contract requirements, interfaces, and security considerations.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSpecWizard}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors"
          >
            <Wand2 size={16} />
            Spec Wizard
          </button>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <StagePromptCard stage="spec" />
        </div>
        
        <div className="space-y-6">
          <div className="bg-dark-800 rounded-lg p-6 border border-dark-600">
            <h3 className="text-lg font-semibold text-white mb-4">Specification Checklist</h3>
            <div className="space-y-3">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <button
                    onClick={() => toggleChecklistItem(item.id)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {item.checked ? (
                      <CheckCircle2 size={20} className="text-green-400" />
                    ) : (
                      <Circle size={20} />
                    )}
                  </button>
                  <span className={`text-sm ${item.checked ? 'text-dark-400 line-through' : 'text-dark-200'}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-dark-600">
              <p className="text-xs text-dark-400">
                Complete {checklist.filter(item => item.checked).length} of {checklist.length} specification requirements
              </p>
            </div>
          </div>
          
          <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-300 mb-2">💡 Specification Tips</h4>
            <ul className="text-xs text-blue-200/80 space-y-1">
              <li>• Use the Spec Wizard for guided requirement gathering</li>
              <li>• Be specific about user roles and access patterns</li>
              <li>• Consider gas optimization early in design</li>
              <li>• Think about upgrade mechanisms and governance</li>
              <li>• Document all assumptions and constraints</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpecPage