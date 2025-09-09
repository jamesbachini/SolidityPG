import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Play, AlertTriangle, CheckCircle, XCircle, Code, FileText, Loader2 } from 'lucide-react'
import StagePromptCard from '../components/StagePromptCard'
import { compileSolidity, formatCompilationErrors } from '../utils/compiler'

function BuildPage() {
  const { files = {} } = useOutletContext() || {}
  const [isCompiling, setIsCompiling] = useState(false)
  const [compilationResult, setCompilationResult] = useState(null)
  const [selectedContract, setSelectedContract] = useState('')

  const handleCompile = async () => {
    setIsCompiling(true)
    setCompilationResult(null)
    
    try {
      // Extract Solidity files
      const solidityFiles = {}
      Object.entries(files).forEach(([filename, file]) => {
        if (filename.endsWith('.sol')) {
          solidityFiles[filename] = file.content
        }
      })

      if (Object.keys(solidityFiles).length === 0) {
        setCompilationResult({
          success: false,
          errors: [{ 
            severity: 'error', 
            message: 'No Solidity files found to compile',
            type: 'NoFilesError' 
          }],
          contracts: {}
        })
        return
      }

      const result = await compileSolidity(solidityFiles)
      setCompilationResult(result)
      
      // Auto-select first contract
      if (result.success && result.contracts) {
        const firstContract = Object.values(result.contracts)[0]
        if (firstContract) {
          const contractName = Object.keys(firstContract)[0]
          setSelectedContract(contractName)
        }
      }
    } catch (error) {
      setCompilationResult({
        success: false,
        errors: [{ 
          severity: 'error', 
          message: `Unexpected error: ${error.message}`,
          type: 'UnexpectedError' 
        }],
        contracts: {}
      })
    } finally {
      setIsCompiling(false)
    }
  }

  const getContractsList = () => {
    if (!compilationResult?.contracts) return []
    
    const contracts = []
    Object.entries(compilationResult.contracts).forEach(([filename, fileContracts]) => {
      Object.keys(fileContracts).forEach(contractName => {
        contracts.push({ filename, contractName })
      })
    })
    return contracts
  }

  const getSelectedContractData = () => {
    if (!selectedContract || !compilationResult?.contracts) return null
    
    for (const [filename, fileContracts] of Object.entries(compilationResult.contracts)) {
      if (fileContracts[selectedContract]) {
        return {
          filename,
          name: selectedContract,
          abi: fileContracts[selectedContract].abi,
          bytecode: fileContracts[selectedContract].evm?.bytecode?.object || '',
          deployedBytecode: fileContracts[selectedContract].evm?.deployedBytecode?.object || ''
        }
      }
    }
    return null
  }

  const solidityFileCount = Object.keys(files).filter(name => name.endsWith('.sol')).length
  const contractsList = getContractsList()
  const selectedContractData = getSelectedContractData()

  return (
    <div className="h-full bg-stone-950">
      <div className="p-6 border-b border-dark-600">
        <h1 className="text-2xl font-bold text-white mb-2">Contract Implementation</h1>
        <p className="text-dark-300">
          Build your smart contract with proper structure and security patterns.
        </p>
      </div>
      
      {/* 50/50 Layout */}
      <div className="flex h-full">
        {/* Left Side - System Prompt Template (50%) */}
        <div className="w-1/2 p-6 border-r border-dark-600 overflow-auto">
          <StagePromptCard stage="build" />
        </div>
        
        {/* Right Side - Compilation Panel (50%) */}
        <div className="w-1/2 overflow-hidden">
          <div className="h-full flex flex-col bg-dark-900">
            {/* Header */}
            <div className="p-4 border-b border-dark-600 bg-dark-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold mb-1">Solidity Compiler</h3>
                  <p className="text-dark-300 text-sm">
                    {solidityFileCount} Solidity file{solidityFileCount !== 1 ? 's' : ''} found
                  </p>
                </div>
                <button
                  onClick={handleCompile}
                  disabled={isCompiling || solidityFileCount === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-dark-600 disabled:text-dark-400 text-white rounded-md transition-colors font-medium"
                >
                  {isCompiling ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Compiling...
                    </>
                  ) : (
                    <>
                      <Play size={16} />
                      Compile
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              {isCompiling ? (
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Loader2 size={28} className="text-white animate-spin" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Compiling Contracts...</h3>
                  <p className="text-dark-300 text-sm">
                    Please wait while we compile your Solidity contracts using the official Solidity compiler.
                  </p>
                  <p className="text-blue-400 text-xs mt-2">
                    Loading compiler binary from soliditylang.org
                  </p>
                </div>
              ) : !compilationResult ? (
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Code size={28} className="text-dark-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Ready to Compile</h3>
                  <p className="text-dark-300 text-sm mb-4">
                    Click the compile button to build your Solidity contracts and generate ABIs.
                  </p>
                  {solidityFileCount === 0 && (
                    <div className="bg-yellow-600/10 border border-yellow-600/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-yellow-300 text-sm">
                        <AlertTriangle size={16} />
                        <span>No .sol files found. Create a Solidity contract to get started.</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {/* Compilation Status */}
                  <div className={`p-3 rounded-lg border ${
                    compilationResult.success 
                      ? 'bg-green-600/10 border-green-600/20' 
                      : 'bg-red-600/10 border-red-600/20'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {compilationResult.success ? (
                        <>
                          <CheckCircle size={16} className="text-green-400" />
                          <span className="text-green-300 font-medium">Compilation Successful</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={16} className="text-red-400" />
                          <span className="text-red-300 font-medium">Compilation Failed</span>
                        </>
                      )}
                    </div>
                    {compilationResult.warnings?.length > 0 && (
                      <div className="text-yellow-300 text-sm">
                        {compilationResult.warnings.length} warning{compilationResult.warnings.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>

                  {/* Errors */}
                  {(compilationResult.compilationErrors?.length > 0 || compilationResult.errors?.length > 0) && (
                    <div className="space-y-2">
                      <h4 className="text-red-300 font-medium">Errors:</h4>
                      {formatCompilationErrors(compilationResult.compilationErrors || compilationResult.errors).map((error, idx) => (
                        <div key={idx} className="bg-red-600/10 border border-red-600/20 rounded p-3">
                          <div className="text-red-300 text-sm font-mono whitespace-pre-wrap">
                            {error.file && <span className="text-red-400">{error.file}:</span>}
                            {error.line && <span className="text-red-400">{error.line}: </span>}
                            {error.formatted}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Warnings */}
                  {compilationResult.warnings?.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-yellow-300 font-medium">Warnings:</h4>
                      {compilationResult.warnings.map((warning, idx) => (
                        <div key={idx} className="bg-yellow-600/10 border border-yellow-600/20 rounded p-3">
                          <div className="text-yellow-300 text-sm font-mono">
                            {warning.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Contracts */}
                  {compilationResult.success && contractsList.length > 0 && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">Compiled Contracts</h4>
                        <select
                          value={selectedContract}
                          onChange={(e) => setSelectedContract(e.target.value)}
                          className="w-full bg-dark-700 border border-dark-600 rounded px-3 py-2 text-white text-sm"
                        >
                          <option value="">Select a contract...</option>
                          {contractsList.map(({ filename, contractName }) => (
                            <option key={`${filename}-${contractName}`} value={contractName}>
                              {contractName} ({filename})
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedContractData && (
                        <div className="space-y-4">
                          <div className="bg-dark-800 rounded-lg p-4">
                            <h5 className="text-white font-medium mb-2 flex items-center gap-2">
                              <FileText size={16} />
                              ABI
                            </h5>
                            <div className="bg-dark-700 rounded p-3 max-h-40 overflow-auto">
                              <pre className="text-xs text-dark-200 font-mono whitespace-pre-wrap">
                                {JSON.stringify(selectedContractData.abi, null, 2)}
                              </pre>
                            </div>
                          </div>

                          {selectedContractData.bytecode && (
                            <div className="bg-dark-800 rounded-lg p-4">
                              <h5 className="text-white font-medium mb-2 flex items-center gap-2">
                                <Code size={16} />
                                Bytecode
                              </h5>
                              <div className="bg-dark-700 rounded p-3 max-h-32 overflow-auto">
                                <div className="text-xs text-dark-200 font-mono break-all">
                                  {selectedContractData.bytecode}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuildPage