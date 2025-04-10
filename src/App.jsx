import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode')
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-surface-800/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
              M
            </div>
            <h1 className="text-xl font-heading font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
              MindMaze
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="font-medium text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light transition-colors">
              Home
            </a>
            <a href="#puzzles" className="font-medium text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light transition-colors">
              Puzzles
            </a>
            <a href="#leaderboard" className="font-medium text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light transition-colors">
              Leaderboard
            </a>
            <a href="#profile" className="font-medium text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light transition-colors">
              Profile
            </a>
          </nav>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
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
                <a href="/" className="font-medium text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light transition-colors py-2">
                  Home
                </a>
                <a href="#puzzles" className="font-medium text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light transition-colors py-2">
                  Puzzles
                </a>
                <a href="#leaderboard" className="font-medium text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light transition-colors py-2">
                  Leaderboard
                </a>
                <a href="#profile" className="font-medium text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light transition-colors py-2">
                  Profile
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
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