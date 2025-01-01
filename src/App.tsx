import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Tasks from './pages/Tasks'
import Statistics from './pages/Statistics'

function App() {
  const basename = import.meta.env.DEV ? '' : '/daily-task-gleam';

  return (
    <Router basename={basename}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Tasks />} />
            <Route path="/statistics" element={<Statistics />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App