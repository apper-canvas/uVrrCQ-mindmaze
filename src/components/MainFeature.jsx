import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Clock, Trophy, ChevronRight } from 'lucide-react'

const MainFeature = () => {
  // Puzzle state
  const [tiles, setTiles] = useState([])
  const [emptyIndex, setEmptyIndex] = useState(8) // Bottom right is empty initially
  const [moves, setMoves] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isSolved, setIsSolved] = useState(false)
  const [difficulty, setDifficulty] = useState('easy') // easy, medium, hard
  const [showCongrats, setShowCongrats] = useState(false)
  
  // Initialize puzzle
  useEffect(() => {
    resetPuzzle()
  }, [difficulty])
  
  // Timer
  useEffect(() => {
    let interval
    if (isRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])
  
  // Check if puzzle is solved
  useEffect(() => {
    if (tiles.length === 0) return
    
    const solved = tiles.every((tile, index) => {
      if (index === emptyIndex) return tile === null
      return tile === index + 1
    })
    
    if (solved && moves > 0) {
      setIsSolved(true)
      setIsRunning(false)
      setShowCongrats(true)
    }
  }, [tiles, emptyIndex, moves])
  
  // Initialize puzzle with shuffled tiles
  const resetPuzzle = () => {
    const size = 3 // 3x3 grid
    const newTiles = Array.from({ length: size * size - 1 }, (_, i) => i + 1)
    newTiles.push(null) // Empty tile
    
    // Shuffle based on difficulty
    let shuffleCount
    switch (difficulty) {
      case 'easy':
        shuffleCount = 20
        break
      case 'medium':
        shuffleCount = 50
        break
      case 'hard':
        shuffleCount = 100
        break
      default:
        shuffleCount = 20
    }
    
    let currentEmptyIndex = size * size - 1
    let tempTiles = [...newTiles]
    
    // Perform random valid moves to shuffle
    for (let i = 0; i < shuffleCount; i++) {
      const possibleMoves = getValidMoves(currentEmptyIndex, size)
      const randomMoveIndex = Math.floor(Math.random() * possibleMoves.length)
      const tileToMove = possibleMoves[randomMoveIndex]
      
      // Swap empty tile with selected tile
      tempTiles[currentEmptyIndex] = tempTiles[tileToMove]
      tempTiles[tileToMove] = null
      currentEmptyIndex = tileToMove
    }
    
    setTiles(tempTiles)
    setEmptyIndex(currentEmptyIndex)
    setMoves(0)
    setTimer(0)
    setIsSolved(false)
    setIsRunning(false)
  }
  
  // Get valid moves for the empty tile
  const getValidMoves = (emptyPos, size) => {
    const row = Math.floor(emptyPos / size)
    const col = emptyPos % size
    const validMoves = []
    
    // Check up
    if (row > 0) validMoves.push(emptyPos - size)
    // Check down
    if (row < size - 1) validMoves.push(emptyPos + size)
    // Check left
    if (col > 0) validMoves.push(emptyPos - 1)
    // Check right
    if (col < size - 1) validMoves.push(emptyPos + 1)
    
    return validMoves
  }
  
  // Handle tile click
  const handleTileClick = (index) => {
    if (isSolved) return
    
    // Start timer on first move
    if (moves === 0) {
      setIsRunning(true)
    }
    
    const size = 3
    const validMoves = getValidMoves(emptyIndex, size)
    
    // Check if clicked tile is adjacent to empty tile
    if (validMoves.includes(index)) {
      // Swap tiles
      const newTiles = [...tiles]
      newTiles[emptyIndex] = newTiles[index]
      newTiles[index] = null
      
      setTiles(newTiles)
      setEmptyIndex(index)
      setMoves(moves + 1)
    }
  }
  
  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  // Get color based on difficulty
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy':
        return 'from-green-400 to-emerald-500'
      case 'medium':
        return 'from-blue-400 to-indigo-500'
      case 'hard':
        return 'from-red-400 to-rose-500'
      default:
        return 'from-green-400 to-emerald-500'
    }
  }
  
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft dark:shadow-neu-dark overflow-hidden border border-surface-200 dark:border-surface-700">
        {/* Puzzle Header */}
        <div className="p-4 border-b border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Sliding Puzzle</h3>
            <div className={`px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r ${getDifficultyColor()}`}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
                <Clock size={16} />
              </div>
              <span className="font-mono">{formatTime(timer)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
                <Trophy size={16} />
              </div>
              <span>{moves} moves</span>
            </div>
            
            <button 
              onClick={resetPuzzle}
              className="w-8 h-8 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
              aria-label="Reset puzzle"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
        
        {/* Puzzle Grid */}
        <div className="p-4">
          <div className="aspect-square w-full bg-surface-100 dark:bg-surface-700 rounded-xl p-2">
            <div className="puzzle-grid w-full h-full">
              {tiles.map((tile, index) => (
                <motion.div
                  key={tile || 'empty'}
                  layout
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  onClick={() => handleTileClick(index)}
                  className={`puzzle-tile rounded-lg ${
                    tile === null 
                      ? 'puzzle-tile-empty' 
                      : 'bg-gradient-to-br from-primary-light to-primary text-white'
                  }`}
                >
                  {tile}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Difficulty Selection */}
        <div className="p-4 border-t border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Difficulty:</span>
            <div className="flex gap-2">
              {['easy', 'medium', 'hard'].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    difficulty === level
                      ? 'bg-primary text-white'
                      : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="mt-6 bg-surface-50 dark:bg-surface-700 rounded-xl p-4 text-sm text-surface-600 dark:text-surface-300">
        <h4 className="font-bold text-surface-800 dark:text-surface-100 mb-2">How to Play:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Click on tiles adjacent to the empty space to move them</li>
          <li>Arrange the numbers in order from 1-8 with the empty space in the bottom right</li>
          <li>Try to solve the puzzle in as few moves as possible</li>
        </ul>
      </div>
      
      {/* Congratulations Modal */}
      <AnimatePresence>
        {showCongrats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCongrats(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 max-w-sm w-full shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                <Trophy size={40} className="text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-center mb-2">Puzzle Solved!</h3>
              <p className="text-center text-surface-600 dark:text-surface-300 mb-4">
                Congratulations! You completed the puzzle in {moves} moves and {formatTime(timer)}.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-surface-50 dark:bg-surface-700 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">{moves}</div>
                  <div className="text-sm text-surface-500">Moves</div>
                </div>
                <div className="bg-surface-50 dark:bg-surface-700 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">{formatTime(timer)}</div>
                  <div className="text-sm text-surface-500">Time</div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCongrats(false)
                    resetPuzzle()
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-1"
                >
                  Play Again <RefreshCw size={16} />
                </button>
                <button
                  onClick={() => {
                    setShowCongrats(false)
                    setDifficulty(difficulty === 'easy' ? 'medium' : difficulty === 'medium' ? 'hard' : 'easy')
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-600 font-medium hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors flex items-center justify-center gap-1"
                >
                  Next Level <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature