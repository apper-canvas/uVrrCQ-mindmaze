import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Moon, Sun, Menu, X, UserCircle, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { clearUser } from './store/userSlice'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Leaderboard from './pages/Leaderboard'
import UserProfile from './pages/UserProfile'
import RequireAuth from './components/RequireAuth'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode')
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(!darkMode)
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)
  
  const handleLogout = () => {
    const { ApperClient } = window.ApperSDK
    const apperClient = new ApperClient("YOUR_CANVAS_ID")
    
    apperClient.logout()
      .then(() => {
        dispatch(clearUser())
        navigate('/')
      })
      .catch(error => {
        console.error("Logout error:", error)
      })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-surface-800/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
              M
            </div>
            <Link to="/" className="text-xl font-heading font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
              MindMaze
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="font-medium text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light transition-colors">
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="font-medium text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light transition-colors">
                  Dashboard
                </Link>
                <Link to="/leaderboard" className="font-medium text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light transition-colors">
                  Leaderboard
                </Link>
                <Link to="/profile" className="font-medium text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light transition-colors">
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="font-medium text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="font-medium text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
          
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-2 pr-2 border-r border-surface-200 dark:border-surface-700 mr-2">
                <UserCircle size={20} className="text-primary" />
                <span className="text-sm font-medium">{user?.firstName || 'User'}</span>
              </div>
            )}
            
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="hidden md:flex p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                aria-label="Log out"
              >
                <LogOut size={20} />
              </button>
            )}
            
            <button 
              className="md:hidden p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <nav className="flex flex-col px-4 py-3 gap-4 bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700">
                <Link to="/" className="font-medium text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light transition-colors py-2">
                  Home
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="font-medium text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light transition-colors py-2">
                      Dashboard
                    </Link>
                    <Link to="/leaderboard" className="font-medium text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light transition-colors py-2">
                      Leaderboard
                    </Link>
                    <Link to="/profile" className="font-medium text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light transition-colors py-2">
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 font-medium text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light transition-colors py-2"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="font-medium text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light transition-colors py-2">
                      Login
                    </Link>
                    <Link to="/signup" className="font-medium text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light transition-colors py-2">
                      Sign Up
                    </Link>
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } />
          <Route path="/leaderboard" element={
            <RequireAuth>
              <Leaderboard />
            </RequireAuth>
          } />
          <Route path="/profile" element={
            <RequireAuth>
              <UserProfile />
            </RequireAuth>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="bg-surface-100 dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                M
              </div>
              <span className="text-sm font-medium text-surface-600 dark:text-surface-300">
                MindMaze © {new Date().getFullYear()}
              </span>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="text-sm text-surface-600 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-surface-600 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-surface-600 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light transition-colors">
                Help
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App