import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Medal, ChevronDown, ChevronUp, Search, Users, Award } from 'lucide-react'
import { getLeaderboardEntries } from '../services/leaderboardService'
import { formatDistanceToNow } from 'date-fns'

const LeaderboardFilters = {
  ALL_TIME: 'All Time',
  THIS_WEEK: 'This Week',
  THIS_MONTH: 'This Month'
}

const Leaderboard = () => {
  const { user } = useSelector(state => state.user)
  const [leaderboardData, setLeaderboardData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [userRank, setUserRank] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'score', direction: 'desc' })
  const [currentFilter, setCurrentFilter] = useState(LeaderboardFilters.ALL_TIME)
  
  useEffect(() => {
    fetchLeaderboardData()
  }, [user.userId, currentFilter])
  
  const fetchLeaderboardData = async () => {
    setLoading(true)
    try {
      let timeRange = null
      
      if (currentFilter === LeaderboardFilters.THIS_WEEK) {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        timeRange = weekAgo.toISOString()
      } else if (currentFilter === LeaderboardFilters.THIS_MONTH) {
        const monthAgo = new Date()
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        timeRange = monthAgo.toISOString()
      }
      
      const data = await getLeaderboardEntries(100, timeRange)
      setLeaderboardData(data)
      setFilteredData(data)
      
      // Find current user's rank
      const userRankInfo = data.findIndex(entry => entry.userId === user.userId)
      setUserRank(userRankInfo !== -1 ? userRankInfo + 1 : null)
      
      setLoading(false)
    } catch (error) {
      console.error("Error fetching leaderboard data:", error)
      setLoading(false)
    }
  }
  
  useEffect(() => {
    if (searchTerm) {
      const filtered = leaderboardData.filter(entry => 
        entry.displayName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredData(filtered)
    } else {
      setFilteredData(leaderboardData)
    }
  }, [searchTerm, leaderboardData])
  
  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    
    setSortConfig({ key, direction })
    
    setFilteredData(prevData => [...prevData].sort((a, b) => {
      if (direction === 'asc') {
        return a[key] > b[key] ? 1 : -1
      } else {
        return a[key] < b[key] ? 1 : -1
      }
    }))
  }
  
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null
    return sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
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
        <h1 className="text-3xl font-bold font-heading mb-2">Leaderboard</h1>
        <p className="text-surface-600 dark:text-surface-300">
          See where you stand against other puzzle enthusiasts
        </p>
      </div>
      
      {/* User's Rank Card */}
      <div className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-soft dark:shadow-neu-dark border border-surface-200 dark:border-surface-700 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white">
            <Medal size={32} />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold mb-1">Your Ranking</h2>
            {userRank ? (
              <p className="text-lg">
                You're ranked <span className="font-bold text-primary">#{userRank}</span> out of {leaderboardData.length} players
              </p>
            ) : (
              <p className="text-lg">Complete puzzles to get on the leaderboard!</p>
            )}
          </div>
          
          <div className="md:border-l md:border-surface-200 md:dark:border-surface-700 md:pl-6">
            <div className="text-center">
              <p className="text-sm text-surface-500 dark:text-surface-400">Your Score</p>
              <p className="text-2xl font-bold">{
                userRank 
                  ? leaderboardData.find(entry => entry.userId === user.userId)?.score || 0
                  : 0
              }</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft dark:shadow-neu-dark border border-surface-200 dark:border-surface-700 mb-8">
        <div className="p-4 md:p-6 border-b border-surface-200 dark:border-surface-700">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-wrap gap-2">
              {Object.values(LeaderboardFilters).map(filter => (
                <button
                  key={filter}
                  onClick={() => setCurrentFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentFilter === filter
                      ? 'bg-primary text-white'
                      : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-700 w-full md:w-64 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary dark:focus:border-primary"
              />
            </div>
          </div>
        </div>
        
        {/* Leaderboard Table */}
        <div className="p-4 md:p-6">
          {filteredData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-200 dark:border-surface-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-surface-500 dark:text-surface-400">Rank</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-surface-500 dark:text-surface-400">Player</th>
                    <th 
                      className="text-left py-3 px-4 text-sm font-medium text-surface-500 dark:text-surface-400 cursor-pointer"
                      onClick={() => handleSort('score')}
                    >
                      <div className="flex items-center gap-1">
                        Score
                        {renderSortIcon('score')}
                      </div>
                    </th>
                    <th 
                      className="text-left py-3 px-4 text-sm font-medium text-surface-500 dark:text-surface-400 cursor-pointer"
                      onClick={() => handleSort('gamesPlayed')}
                    >
                      <div className="flex items-center gap-1">
                        Games
                        {renderSortIcon('gamesPlayed')}
                      </div>
                    </th>
                    <th 
                      className="text-left py-3 px-4 text-sm font-medium text-surface-500 dark:text-surface-400 cursor-pointer"
                      onClick={() => handleSort('level')}
                    >
                      <div className="flex items-center gap-1">
                        Level
                        {renderSortIcon('level')}
                      </div>
                    </th>
                    <th 
                      className="text-left py-3 px-4 text-sm font-medium text-surface-500 dark:text-surface-400 cursor-pointer hidden md:table-cell"
                      onClick={() => handleSort('lastActive')}
                    >
                      <div className="flex items-center gap-1">
                        Last Active
                        {renderSortIcon('lastActive')}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((entry, index) => (
                    <tr 
                      key={entry.id}
                      className={`border-b border-surface-200 dark:border-surface-700 ${
                        entry.userId === user.userId ? 'bg-primary/5 dark:bg-primary/10' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                            index === 0 ? 'bg-yellow-500' : 
                            index === 1 ? 'bg-gray-400' :
                            index === 2 ? 'bg-amber-700' : 'bg-surface-300 dark:bg-surface-600'
                          }`}>
                            {index + 1}
                          </div>
                          {index < 3 && (
                            <Award size={16} className={`ml-1 ${
                              index === 0 ? 'text-yellow-500' : 
                              index === 1 ? 'text-gray-400' :
                              'text-amber-700'
                            }`} />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">
                          {entry.displayName}
                          {entry.userId === user.userId && (
                            <span className="text-primary ml-2 text-xs">(You)</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium">
                        {entry.score.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        {entry.gamesPlayed}
                      </td>
                      <td className="py-3 px-4">
                        <div className="px-2 py-1 rounded-full text-xs inline-block font-medium bg-surface-100 dark:bg-surface-700">
                          {entry.level}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-surface-500 dark:text-surface-400 text-sm hidden md:table-cell">
                        {entry.lastActive ? formatDistanceToNow(new Date(entry.lastActive), { addSuffix: true }) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center mb-4">
                <Users size={24} className="text-surface-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No players found</h3>
              <p className="text-surface-500 dark:text-surface-400 text-center max-w-md">
                {searchTerm 
                  ? `No players matching "${searchTerm}" were found.` 
                  : "There are no players on the leaderboard yet. Be the first to complete a puzzle!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Leaderboard