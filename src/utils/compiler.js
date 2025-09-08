// import solc from 'solc' // Temporarily disabled due to browser compatibility issues

/**
 * Compile Solidity source code
 * @param {Object} sources - Object with filename as key and source code as value
 * @param {string} version - Solidity compiler version (defaults to latest)
 * @returns {Promise<Object>} Compilation result
 */
export const compileSolidity = async (sources, version = 'latest') => {
  try {
    // Prepare input for solc
    const input = {
      language: 'Solidity',
      sources: {},
      settings: {
        outputSelection: {
          '*': {
            '*': ['abi', 'evm.bytecode', 'evm.deployedBytecode', 'devdoc', 'userdoc']
          }
        }
      }
    }

    // Convert sources to solc format
    for (const [filename, source] of Object.entries(sources)) {
      if (filename.endsWith('.sol')) {
        input.sources[filename] = {
          content: source
        }
      }
    }

    // Mock compilation for demo (replace with actual solc when properly configured)
    const output = {
      contracts: Object.keys(input.sources).reduce((acc, filename) => {
        // Simple regex to find contract names
        const contractMatches = input.sources[filename].content.match(/contract\s+(\w+)/g)
        if (contractMatches) {
          acc[filename] = {}
          contractMatches.forEach(match => {
            const contractName = match.replace('contract ', '')
            acc[filename][contractName] = {
              abi: [
                {
                  "inputs": [],
                  "name": "exampleFunction",
                  "outputs": [],
                  "stateMutability": "nonpayable",
                  "type": "function"
                }
              ],
              evm: {
                bytecode: {
                  object: "608060405234801561001057600080fd5b50610150806100206000396000f3fe"
                },
                deployedBytecode: {
                  object: "608060405234801561001057600080fd5b50600436106100365760003560e01c8063"
                }
              }
            }
          })
        }
        return acc
      }, {}),
      errors: []
    }
    
    return {
      success: !output.errors || output.errors.every(error => error.severity === 'warning'),
      contracts: output.contracts || {},
      errors: output.errors || [],
      warnings: output.errors?.filter(error => error.severity === 'warning') || [],
      compilationErrors: output.errors?.filter(error => error.severity === 'error') || []
    }
  } catch (error) {
    return {
      success: false,
      contracts: {},
      errors: [{ 
        severity: 'error',
        message: `Compilation failed: ${error.message}`,
        type: 'CompilerError'
      }],
      warnings: [],
      compilationErrors: [{ 
        severity: 'error',
        message: `Compilation failed: ${error.message}`,
        type: 'CompilerError'
      }]
    }
  }
}

/**
 * Get contract ABI from compilation result
 * @param {Object} compilationResult 
 * @param {string} contractName 
 * @returns {Array} ABI array
 */
export const getContractABI = (compilationResult, contractName) => {
  const contracts = compilationResult.contracts
  for (const [filename, fileContracts] of Object.entries(contracts)) {
    if (fileContracts[contractName]) {
      return fileContracts[contractName].abi
    }
  }
  return []
}

/**
 * Get contract bytecode from compilation result
 * @param {Object} compilationResult 
 * @param {string} contractName 
 * @returns {string} Bytecode
 */
export const getContractBytecode = (compilationResult, contractName) => {
  const contracts = compilationResult.contracts
  for (const [filename, fileContracts] of Object.entries(contracts)) {
    if (fileContracts[contractName]) {
      return fileContracts[contractName].evm.bytecode.object
    }
  }
  return ''
}

/**
 * Format compilation errors for display
 * @param {Array} errors 
 * @returns {Array} Formatted errors
 */
export const formatCompilationErrors = (errors) => {
  return errors.map(error => ({
    ...error,
    line: error.sourceLocation?.start ? 
      Math.floor(error.sourceLocation.start / 100) + 1 : // Rough line estimation
      null,
    formatted: `${error.type || 'Error'}: ${error.message}`
  }))
}