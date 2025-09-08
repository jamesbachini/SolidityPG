// Route constants and configuration
export const ROUTES = {
  START: '/start',
  SPEC: '/spec',
  BUILD: '/build',
  TEST: '/test',
  DEPLOY: '/deploy',
  INTEGRATE: '/integrate',
}

export const WORKFLOW_STAGES = [
  {
    key: 'spec',
    path: ROUTES.SPEC,
    label: 'Spec',
    icon: 'FileCode',
    description: 'Define contract specifications and requirements'
  },
  {
    key: 'build',
    path: ROUTES.BUILD,
    label: 'Build',
    icon: 'ListChecks',
    description: 'Implement and structure your smart contract'
  },
  {
    key: 'test',
    path: ROUTES.TEST,
    label: 'Test',
    icon: 'Beaker',
    description: 'Test contract functionality and security'
  },
  {
    key: 'deploy',
    path: ROUTES.DEPLOY,
    label: 'Deploy',
    icon: 'Rocket',
    description: 'Deploy contract to blockchain networks'
  },
  {
    key: 'integrate',
    path: ROUTES.INTEGRATE,
    label: 'Integrate',
    icon: 'Plug',
    description: 'Generate client bindings and integration code'
  }
]