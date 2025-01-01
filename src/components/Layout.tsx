import { Link, useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function Layout() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Daily Tasks Tracker</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign out
              </button>
            </div>
          </div>
          <nav className="flex gap-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Tasks
            </Link>
            <Link
              to="/statistics"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Statistics
            </Link>
          </nav>
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
} 