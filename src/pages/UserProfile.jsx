import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { User, Trophy, Edit2, Save, Clock, BarChart2 } from 'lucide-react'
import { getUserProfile, updateUserProfile } from '../services/userService'
import { getUserPuzzleStats, getUserCompletedPuzzles } from '../services/puzzleService'

const UserProfile = () => {
  const { user } = useSelector(state => state.user)
  const [profile, setProfile] = useState(null)
  const [puzzleStats, setPuzzleStats] = useState(null)
  const [completedPuzzles, setCompletedPuzzles] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    displayName: '',
  })
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user profile
        const userProfile = await getUserProfile(user.userId)
        setProfile(userProfile)
        setFormData({
          displayName: userProfile.displayName,
        })
        
        // Fetch user puzzle stats
        const stats = await getUserPuzzleStats(user.userId)
        setPuzzleStats(stats)
        
        // Fetch completed puzzles
        const puzzles = await getUserCompletedPuzzles(user.userId)
        setCompletedPuzzles(puzzles)
        
        setLoading(false)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setLoading(false)
      }
    }
    
    fetchUserData()
  }, [user.userId])
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await updateUserProfile(profile.id, formData)
      setProfile({ ...profile, ...formData })
      setEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }
  
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
        <h1 className="text-3xl font-bold font-heading mb-2">Your Profile</h1>
        <p className="text-surface-600 dark:text-surface-300">
          View and manage your personal information and puzzle statistics
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft dark:shadow-neu-dark border border-surface-200 dark:border-surface-700 overflow-hidden">
            <div className="p-6 border-b border-surface-200 dark:border-surface-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Profile</h2>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                    aria-label="Edit profile"
                  >
                    <Edit2 size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="p-2 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors"
                    aria-label="Save profile"
                  >
                    <Save size={16} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center mb-4">
                  <User size={40} className="text-white" />
                </div>
                
                {editing ? (
                  <form onSubmit={handleSubmit} className="w-full">
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Display Name</label>
                      <input
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-600 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h3 className="text-xl font-bold mb-1">{profile.displayName}</h3>
                    <p className="text-surface-500 dark:text-surface-400">{user.emailAddress}</p>
                  </>
                )}
              </div>
              
              <div className="border-t border-surface-200 dark:border-surface-700 pt-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">Experience Level</h4>
                    <p className="font-medium">{profile.level || 'Beginner'}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">Member Since</h4>
                    <p className="font-medium">{new Date(user.createdOn).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">Puzzle Rank</h4>
                    <div className="flex items-center gap-2">
                      <div className="text-primary">
                        <Trophy size={16} />
                      </div>
                      <p className="font-medium">#{puzzleStats?.rank || 'Unranked'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats and Activity */}
        <div className="lg:col-span-2">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-surface-800 p-5 rounded-xl shadow-soft dark:shadow-neu-dark border border-surface-200 dark:border-surface-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary-light/20 dark:bg-primary/20 flex items-center justify-center">
                  <Trophy size={16} className="text-primary" />
                </div>
                <h3 className="font-medium">Total Score</h3>
              </div>
              <p className="text-2xl font-bold">{profile.totalScore || 0}</p>
            </div>
            
            <div className="bg-white dark:bg-surface-800 p-5 rounded-xl shadow-soft dark:shadow-neu-dark border border-surface-200 dark:border-surface-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary-light/20 dark:bg-primary/20 flex items-center justify-center">
                  <BarChart2 size={16} className="text-primary" />
                </div>
                <h3 className="font-medium">Games Played</h3>
              </div>
              <p className="text-2xl font-bold">{profile.gamesPlayed || 0}</p>
            </div>
            
            <div className="bg-white dark:bg-surface-800 p-5 rounded-xl shadow-soft dark:shadow-neu-dark border border-surface-200 dark:border-surface-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary-light/20 dark:bg-primary/20 flex items-center justify-center">
                  <Clock size={16} className="text-primary" />
                </div>
                <h3 className="font-medium">Best Time</h3>
              </div>
              <p className="text-2xl font-bold">{profile.bestTime || '00:00'}</p>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft dark:shadow-neu-dark border border-surface-200 dark:border-surface-700 overflow-hidden mb-6">
            <div className="p-6 border-b border-surface-200 dark:border-surface-700">
              <h2 className="text-xl font-bold">Recent Activity</h2>
            </div>
            
            <div className="p-6">
              {completedPuzzles.length > 0 ? (
                <div className="space-y-4">
                  {completedPuzzles.map(puzzle => (
                    <div key={puzzle.id} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
                        {puzzle.puzzleType === 'sliding' ? (
                          <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
                            <div className="bg-primary w-2 h-2 rounded-sm"></div>
                            <div className="bg-primary w-2 h-2 rounded-sm"></div>
                            <div className="bg-primary w-2 h-2 rounded-sm"></div>
                            <div className="bg-surface-200 dark:bg-surface-600 w-2 h-2 rounded-sm"></div>
                          </div>
                        ) : (
                          <div className="text-primary text-xs">🧩</div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-medium">{puzzle.puzzleName}</p>
                        <p className="text-xs text-surface-500 dark:text-surface-400">
                          {new Date(puzzle.completedOn).toLocaleDateString()} • Score: {puzzle.score}
                        </p>
                      </div>
                      
                      <div className="px-3 py-1 rounded-full text-xs font-medium bg-surface-100 dark:bg-surface-700">
                        {puzzle.difficulty}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-surface-500 dark:text-surface-400">
                    You haven't completed any puzzles yet. Start playing to see your activity!
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Achievements */}
          <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft dark:shadow-neu-dark border border-surface-200 dark:border-surface-700 overflow-hidden">
            <div className="p-6 border-b border-surface-200 dark:border-surface-700">
              <h2 className="text-xl font-bold">Achievements</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: 'First Puzzle', description: 'Complete your first puzzle', unlocked: profile.gamesPlayed > 0 },
                  { name: 'Puzzle Master', description: 'Complete 10 puzzles', unlocked: profile.gamesPlayed >= 10 },
                  { name: 'Speed Demon', description: 'Complete a puzzle in under 1 minute', unlocked: false },
                  { name: 'High Scorer', description: 'Reach 1000 points', unlocked: profile.totalScore >= 1000 },
                  { name: 'Dedicated Player', description: 'Play for 5 days in a row', unlocked: false },
                  { name: 'Challenge Champion', description: 'Complete a hard difficulty puzzle', unlocked: false },
                ].map((achievement, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-xl border ${
                      achievement.unlocked 
                        ? 'border-primary/30 bg-primary/5 dark:border-primary/20 dark:bg-primary/10' 
                        : 'border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-700/50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                      achievement.unlocked
                        ? 'bg-primary text-white'
                        : 'bg-surface-200 dark:bg-surface-600 text-surface-400 dark:text-surface-500'
                    }`}>
                      🏆
                    </div>
                    <h3 className={`font-medium mb-1 ${
                      achievement.unlocked ? '' : 'text-surface-400 dark:text-surface-500'
                    }`}>
                      {achievement.name}
                    </h3>
                    <p className="text-xs text-surface-500 dark:text-surface-400">
                      {achievement.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile