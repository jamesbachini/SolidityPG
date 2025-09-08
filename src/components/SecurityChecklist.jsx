import { useState } from 'react'
import { Shield, AlertTriangle, CheckCircle2, Circle, Info } from 'lucide-react'

const SECURITY_CATEGORIES = [
  {
    name: 'Access Control',
    items: [
      {
        id: 'access-ownership',
        title: 'Proper ownership implementation',
        description: 'Contract uses OpenZeppelin Ownable or similar secure ownership pattern',
        severity: 'high'
      },
      {
        id: 'access-roles',
        title: 'Role-based permissions',
        description: 'Critical functions are protected with appropriate access modifiers',
        severity: 'high'
      },
      {
        id: 'access-admin',
        title: 'Admin key management',
        description: 'Administrative functions use multi-sig or timelocks for additional security',
        severity: 'medium'
      }
    ]
  },
  {
    name: 'Reentrancy Protection',
    items: [
      {
        id: 'reentrancy-guards',
        title: 'Reentrancy guards implemented',
        description: 'Functions with external calls use OpenZeppelin ReentrancyGuard',
        severity: 'high'
      },
      {
        id: 'reentrancy-pattern',
        title: 'Checks-Effects-Interactions pattern',
        description: 'State changes occur before external calls',
        severity: 'high'
      },
      {
        id: 'reentrancy-cross',
        title: 'Cross-function reentrancy considered',
        description: 'Protection against reentrancy across different functions',
        severity: 'medium'
      }
    ]
  },
  {
    name: 'Input Validation',
    items: [
      {
        id: 'input-zero-address',
        title: 'Zero address checks',
        description: 'Functions validate against zero address where appropriate',
        severity: 'medium'
      },
      {
        id: 'input-bounds',
        title: 'Bounds checking',
        description: 'Array indices and numerical inputs are properly validated',
        severity: 'high'
      },
      {
        id: 'input-overflow',
        title: 'Overflow protection',
        description: 'Using Solidity 0.8+ or SafeMath for arithmetic operations',
        severity: 'high'
      }
    ]
  },
  {
    name: 'Economic Security',
    items: [
      {
        id: 'economic-slippage',
        title: 'Slippage protection',
        description: 'DEX interactions include slippage and deadline protection',
        severity: 'medium'
      },
      {
        id: 'economic-mev',
        title: 'MEV protection',
        description: 'Contract design considers and mitigates MEV extraction',
        severity: 'medium'
      },
      {
        id: 'economic-incentives',
        title: 'Economic incentive alignment',
        description: 'Token economics and incentives are properly aligned',
        severity: 'low'
      }
    ]
  },
  {
    name: 'Code Quality',
    items: [
      {
        id: 'code-natspec',
        title: 'NatSpec documentation',
        description: 'Functions have comprehensive NatSpec documentation',
        severity: 'low'
      },
      {
        id: 'code-errors',
        title: 'Custom error messages',
        description: 'Using custom errors instead of require strings for gas efficiency',
        severity: 'low'
      },
      {
        id: 'code-events',
        title: 'Proper event emission',
        description: 'Important state changes emit appropriate events',
        severity: 'medium'
      }
    ]
  },
  {
    name: 'Testing & Auditing',
    items: [
      {
        id: 'test-coverage',
        title: 'High test coverage',
        description: 'Test coverage is above 90% for critical functions',
        severity: 'high'
      },
      {
        id: 'test-edge-cases',
        title: 'Edge case testing',
        description: 'Tests cover boundary conditions and failure scenarios',
        severity: 'high'
      },
      {
        id: 'test-formal-verification',
        title: 'Formal verification considered',
        description: 'Critical invariants are formally verified where appropriate',
        severity: 'low'
      }
    ]
  }
]

function SecurityChecklist() {
  const [checkedItems, setCheckedItems] = useState(new Set())
  const [expandedCategories, setExpandedCategories] = useState(new Set(['Access Control', 'Reentrancy Protection']))

  const toggleItem = (itemId) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId)
    } else {
      newChecked.add(itemId)
    }
    setCheckedItems(newChecked)
  }

  const toggleCategory = (categoryName) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName)
    } else {
      newExpanded.add(categoryName)
    }
    setExpandedCategories(newExpanded)
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-600/20 border-red-600/50'
      case 'medium': return 'text-yellow-400 bg-yellow-600/20 border-yellow-600/50'
      case 'low': return 'text-blue-400 bg-blue-600/20 border-blue-600/50'
      default: return 'text-dark-300 bg-dark-600/20 border-dark-600/50'
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <AlertTriangle size={12} />
      case 'medium': return <AlertTriangle size={12} />
      case 'low': return <Info size={12} />
      default: return <Info size={12} />
    }
  }

  const totalItems = SECURITY_CATEGORIES.reduce((sum, cat) => sum + cat.items.length, 0)
  const checkedCount = checkedItems.size
  const completionPercentage = Math.round((checkedCount / totalItems) * 100)

  return (
    <div className="bg-dark-800 rounded-lg border border-dark-600">
      {/* Header */}
      <div className="p-4 border-b border-dark-600">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="text-blue-400" size={20} />
            <h3 className="text-lg font-semibold text-white">Security Checklist</h3>
          </div>
          <div className="text-sm text-dark-300">
            {checkedCount}/{totalItems} completed
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-dark-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <div className="text-xs text-dark-400 mt-1">
          {completionPercentage}% complete
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="space-y-4">
          {SECURITY_CATEGORIES.map((category) => {
            const isExpanded = expandedCategories.has(category.name)
            const categoryChecked = category.items.filter(item => checkedItems.has(item.id)).length
            
            return (
              <div key={category.name} className="border border-dark-600 rounded-lg">
                {/* Category header */}
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="w-full flex items-center justify-between p-3 hover:bg-dark-700 rounded-t-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{category.name}</span>
                    <span className="text-xs text-dark-400">
                      ({categoryChecked}/{category.items.length})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {categoryChecked === category.items.length && (
                      <CheckCircle2 size={16} className="text-green-400" />
                    )}
                    <span className="text-dark-400">
                      {isExpanded ? '−' : '+'}
                    </span>
                  </div>
                </button>

                {/* Category items */}
                {isExpanded && (
                  <div className="border-t border-dark-600">
                    {category.items.map((item) => {
                      const isChecked = checkedItems.has(item.id)
                      
                      return (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 p-3 hover:bg-dark-700/50 transition-colors"
                        >
                          <button
                            onClick={() => toggleItem(item.id)}
                            className="mt-0.5 text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {isChecked ? (
                              <CheckCircle2 size={16} className="text-green-400" />
                            ) : (
                              <Circle size={16} />
                            )}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`text-sm font-medium ${isChecked ? 'text-dark-400 line-through' : 'text-white'}`}>
                                {item.title}
                              </h4>
                              <span className={`px-2 py-0.5 text-xs rounded-full border flex items-center gap-1 ${getSeverityColor(item.severity)}`}>
                                {getSeverityIcon(item.severity)}
                                {item.severity}
                              </span>
                            </div>
                            <p className={`text-xs ${isChecked ? 'text-dark-500' : 'text-dark-300'}`}>
                              {item.description}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer note */}
        <div className="mt-6 p-3 bg-yellow-600/20 border border-yellow-600/50 rounded-lg">
          <p className="text-yellow-400 text-xs">
            <strong>Note:</strong> This security checklist is for reference only. 
            Checking items here does not perform actual security validation. 
            Always conduct proper testing and consider professional audits for production contracts.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SecurityChecklist