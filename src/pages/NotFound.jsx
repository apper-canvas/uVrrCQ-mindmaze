import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary/10 dark:to-secondary/10 flex items-center justify-center">
            <span className="text-5xl">🧩</span>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 font-heading">Puzzle Not Found</h1>
        <p className="text-lg text-surface-600 dark:text-surface-300 mb-8">
          Oops! It seems the puzzle you're looking for has gone missing in the maze.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Back to Home
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-xl border-2 border-surface-300 dark:border-surface-600 font-medium hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound