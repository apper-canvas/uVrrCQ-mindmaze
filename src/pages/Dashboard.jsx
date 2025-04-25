import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Brain, Trophy, Clock, Award, ChevronRight, Play } from 'lucide-react'
import { useSelector } from 'react-redux'
import { getUserPuzzleStats } from '../services/puzzleService'
import { getLeaderboardEntries } from '../services/leaderboardService'

const Dashboard = () => {
  const { user } = useSelector(state => state.user)
  const [puzzleStats, setPuzzleStats] = useState(null)
  const [topPlayers, setTopPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user puzzle stats
        const stats = await getUserPuzzleStats(user.userId)
        setPuzzleStats(stats)
        
        // Fetch top 3 players for leaderboard preview
        const leaderboardData = await getLeaderboardEntries(3)
        setTopPlayers(leaderboardData)
        
        setLoading(false)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setLoading(false)
      }
    }
    
    fetchData()
  }, [user.userId])
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading mb-2">
          Welcome, {user.firstName || 'Puzzler'}!
        </h1>
        <p className="text-surface-600 dark:text-surface-300">
          Track your progress and challenge yourself with new puzzles
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-soft dark:shadow-neu-dark border border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Puzzles Completed</h3>
            <div className="w-10 h-10 rounded-full bg-primary-light/20 dark:bg-primary/20 flex items-center justify-center">
              <Brain size={20} className="text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">{puzzleStats?.completed || 0}</p>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Out of {puzzleStats?.total || 0} total puzzles
          </p>
        </div>
        
        <div className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-soft dark:shadow-neu-dark border border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Total Score</h3>
            <div className="w-10 h-10 rounded-full bg-primary-light/20 dark:bg-primary/20 flex items-center justify-center">
              <Trophy size={20} className="text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">{puzzleStats?.totalScore || 0}</p>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Current Rank: {puzzleStats?.rank || 'Unranked'}
          </p>
        </div>
        
        <div className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-soft dark:shadow-neu-dark border border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Best Time</h3>
            <div className="w-10 h-10 rounded-full bg-primary-light/20 dark:bg-primary/20 flex items-center justify-center">
              <Clock size={20} className="text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">{puzzleStats?.bestTime || '00:00'}</p>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Puzzle: {puzzleStats?.bestPuzzle || 'None'}
          </p>
        </div>
      </div>
      
      {/* Featured Puzzle & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft dark:shadow-neu-dark border border-surface-200 dark:border-surface-700 overflow-hidden">
            <div className="p-6 border-b border-surface-200 dark:border-surface-700">
              <h2 className="text-xl font-bold mb-1">Featured Puzzle</h2>
              <p className="text-surface-600 dark:text-surface-300 text-sm">
                Continue your puzzle journey with this featured challenge
              </p>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-light to-primary flex items-center justify-center">
                  <Brain size={40} className="text-white" />
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold mb-2">Sliding Puzzle Challenge</h3>
                  <p className="text-surface-600 dark:text-surface-300 mb-4">
                    Arrange the numbers in ascending order. Can you beat your previous time?
                  </p>
                  
                  <div className="flex flex-wrap gap-3 justify-center sm:justify-start mb-4">
                    <div className="px-3 py-1 rounded-full text-xs font-medium bg-surface-100 dark:bg-surface-700">
                      Difficulty: Medium
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-medium bg-surface-100 dark:bg-surface-700">
                      Type: Sliding
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-medium bg-surface-100 dark:bg-surface-700">
                      Time: 2-5 min
                    </div>
                  </div>
                  
                  <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                    Play Now <Play size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft dark:shadow-neu-dark border border-surface-200 dark:border-surface-700 overflow-hidden h-full">
            <div className="p-6 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-1">Leaderboard</h2>
                <p className="text-surface-600 dark:text-surface-300 text-sm">
                  Top players this week
                </p>
              </div>
              <Link to="/leaderboard" className="text-primary hover:text-primary-dark dark:hover:text-primary-light">
                <ChevronRight size={20} />
              </Link>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {topPlayers.map((player, index) => (
                  <div key={player.id} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-amber-700' : 'bg-surface-300'
                    }`}>
                      {index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-medium">{player.displayName}</p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">
                        Score: {player.score}
                      </p>
                    </div>
                    
                    {index === 0 && (
                      <Award size={20} className="text-yellow-500" />
                    )}
                  </div>
                ))}
                
                {topPlayers.length === 0 && (
                  <p className="text-center text-surface-500 dark:text-surface-400 py-4">
                    No scores recorded yet
                  </p>
                )}
                
                <Link 
                  to="/leaderboard"
                  className="block w-full text-center py-2 mt-4 border border-surface-200 dark:border-surface-700 rounded-lg text-sm font-medium hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                >
                  View Full Leaderboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard