import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Shell from './layout/Shell'
import StartPage from './pages/StartPage'
import SpecPage from './pages/SpecPage'
import BuildPage from './pages/BuildPage'
import TestPage from './pages/TestPage'
import DeployPage from './pages/DeployPage'
import IntegratePage from './pages/IntegratePage'
import { ROUTES } from './utils/routes'

function App() {
  return (
    <Router>
      <div className="h-full bg-dark-900">
        <Routes>
          <Route path="/" element={<Navigate to={ROUTES.START} replace />} />
          <Route path="/*" element={<Shell />}>
            <Route path="start" element={<StartPage />} />
            <Route path="spec" element={<SpecPage />} />
            <Route path="build" element={<BuildPage />} />
            <Route path="test" element={<TestPage />} />
            <Route path="deploy" element={<DeployPage />} />
            <Route path="integrate" element={<IntegratePage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App