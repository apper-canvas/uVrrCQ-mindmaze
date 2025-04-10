import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Brain, Zap, ChevronRight, Star } from 'lucide-react'
import MainFeature from '../components/MainFeature'

const Home = () => {
  const [selectedLevel, setSelectedLevel] = useState('beginner')
  
  const levels = [
    { id: 'beginner', name: 'Beginner', color: 'from-green-400 to-emerald-500', description: 'Perfect for newcomers to puzzle games' },
    { id: 'intermediate', name: 'Intermediate', color: 'from-blue-400 to-indigo-500', description: 'For those with some puzzle-solving experience' },
    { id: 'advanced', name: 'Advanced', color: 'from-purple-400 to-purple-600', description: 'Challenging puzzles for experienced players' },
    { id: 'expert', name: 'Expert', color: 'from-red-400 to-rose-600', description: 'Only for the most dedicated puzzle masters' }
  ]
  
  const puzzleTypes = [
    { 
      id: 'sliding', 
      name: 'Sliding Puzzle', 
      icon: '🧩',
      description: 'Rearrange tiles to complete the pattern',
      difficulty: 'Beginner'
    },
    { 
      id: 'pattern', 
      name: 'Pattern Recognition', 
      icon: '🔍',
      description: 'Find the hidden pattern in the sequence',
      difficulty: 'Intermediate'
    },
    { 
      id: 'logic', 
      name: 'Logic Grid', 
      icon: '🧠',
      description: 'Use clues to solve complex logic problems',
      difficulty: 'Advanced'
    },
    { 
      id: 'word', 
      name: 'Word Puzzles', 
      icon: '📝',
      description: 'Test your vocabulary and word association skills',
      difficulty: 'Intermediate'
    }
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden hexagon-bg">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-heading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Challenge Your Mind with <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">MindMaze</span>
              </motion.h1>
              
              <motion.p 
                className="text-lg md:text-xl text-surface-600 dark:text-surface-300 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Engage your brain with our collection of puzzles designed to test your logic, pattern recognition, and problem-solving skills.
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <a 
                  href="#play-now" 
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-lg transition-shadow flex items-center gap-2"
                >
                  Play Now <ChevronRight size={18} />
                </a>
                <a 
                  href="#learn-more" 
                  className="px-6 py-3 rounded-xl border-2 border-surface-300 dark:border-surface-600 font-medium hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                >
                  Learn More
                </a>
              </motion.div>
            </div>
            
            <motion.div 
              className="flex-1 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="relative w-full max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-3xl"></div>
                <div className="relative bg-white dark:bg-surface-800 rounded-2xl shadow-soft dark:shadow-neu-dark p-6 border border-surface-200 dark:border-surface-700">
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div 
                        key={item}
                        className="aspect-square rounded-xl bg-gradient-to-br from-primary-light/10 to-primary/10 dark:from-primary-light/5 dark:to-primary/5 flex items-center justify-center p-4"
                      >
                        <div className="w-full h-full rounded-lg bg-white dark:bg-surface-700 shadow-card flex items-center justify-center">
                          <span className="text-3xl">{['🧩', '🔍', '🧠', '📝'][item-1]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Current Level</h3>
                      <div className="flex items-center gap-1 text-primary">
                        <Star size={16} fill="currentColor" />
                        <Star size={16} fill="currentColor" />
                        <Star size={16} fill="currentColor" />
                        <Star size={16} className="text-surface-300 dark:text-surface-600" />
                        <Star size={16} className="text-surface-300 dark:text-surface-600" />
                      </div>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
                      Level 3
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-surface-50 dark:bg-surface-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 font-heading">Why Play MindMaze?</h2>
            <p className="text-lg text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
              Our puzzles are designed to be both entertaining and beneficial for your cognitive abilities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8 text-primary" />,
                title: "Boost Brain Power",
                description: "Regular puzzle solving has been shown to improve memory, concentration, and cognitive function."
              },
              {
                icon: <Trophy className="w-8 h-8 text-secondary" />,
                title: "Track Progress",
                description: "Watch your skills improve as you advance through increasingly challenging levels and puzzles."
              },
              {
                icon: <Zap className="w-8 h-8 text-accent" />,
                title: "Daily Challenges",
                description: "New puzzles every day to keep your mind sharp and engaged with fresh content."
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card border border-surface-200 dark:border-surface-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 rounded-xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-surface-600 dark:text-surface-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Level Selection */}
      <section className="py-16 bg-white dark:bg-surface-900" id="play-now">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 font-heading">Choose Your Challenge Level</h2>
            <p className="text-lg text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
              Select a difficulty that matches your experience with puzzle games.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {levels.map((level) => (
              <motion.button
                key={level.id}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  selectedLevel === level.id 
                    ? `border-primary bg-primary/5 dark:bg-primary/10` 
                    : `border-surface-200 dark:border-surface-700 hover:border-primary/50`
                }`}
                onClick={() => setSelectedLevel(level.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${level.color} mb-4 flex items-center justify-center text-white font-bold`}>
                  {level.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold mb-2">{level.name}</h3>
                <p className="text-surface-600 dark:text-surface-300 text-sm">{level.description}</p>
              </motion.button>
            ))}
          </div>
          
          <div className="bg-surface-50 dark:bg-surface-800 rounded-2xl p-6 md:p-8 border border-surface-200 dark:border-surface-700">
            <h3 className="text-2xl font-bold mb-6 font-heading">Available Puzzle Types</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {puzzleTypes.map((puzzle) => (
                <div 
                  key={puzzle.id}
                  className="bg-white dark:bg-surface-700 rounded-xl p-4 border border-surface-200 dark:border-surface-600"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 flex items-center justify-center text-2xl">
                      {puzzle.icon}
                    </div>
                    <div>
                      <h4 className="font-bold">{puzzle.name}</h4>
                      <p className="text-sm text-surface-600 dark:text-surface-300 mb-2">{puzzle.description}</p>
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-surface-100 dark:bg-surface-600">
                        {puzzle.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Feature */}
      <section className="py-16 bg-gradient-to-b from-surface-50 to-white dark:from-surface-800 dark:to-surface-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 font-heading">Try a Puzzle Now</h2>
            <p className="text-lg text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
              Get a taste of our sliding puzzle game. Rearrange the tiles to put them in order!
            </p>
          </div>
          
          <MainFeature />
        </div>
      </section>
    </div>
  )
}

export default Home