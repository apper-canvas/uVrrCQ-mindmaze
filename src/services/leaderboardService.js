// Leaderboard Service to handle leaderboard-related data operations

/**
 * Get leaderboard entries
 * @param {number} limit - Number of entries to retrieve
 * @param {string} timeRange - ISO date string to filter entries from this date
 * @returns {Promise<Array>} Array of leaderboard entries
 */
export const getLeaderboardEntries = async (limit = 10, timeRange = null) => {
  try {
    const { ApperClient } = window.ApperSDK
    const apperClient = new ApperClient("YOUR_CANVAS_ID")
    
    // Prepare filter
    const filter = {}
    if (timeRange) {
      filter.lastActive = { $gte: timeRange }
    }
    
    // Fetch user profiles for leaderboard
    const params = {
      fields: ['id', 'userId', 'displayName', 'totalScore', 'gamesPlayed', 'level', 'lastActive'],
      filter,
      pagingInfo: { limit: limit, offset: 0 },
      orderBy: [{ field: 'totalScore', direction: 'desc' }]
    }
    
    const response = await apperClient.fetchRecords('userProfiles', params)
    
    // Map to leaderboard entries
    if (response && response.data) {
      return response.data.map(profile => ({
        id: profile.id,
        userId: profile.userId,
        displayName: profile.displayName,
        score: profile.totalScore || 0,
        gamesPlayed: profile.gamesPlayed || 0,
        level: profile.level || 'Beginner',
        lastActive: profile.lastActive
      }))
    }
    
    return []
  } catch (error) {
    console.error("Error fetching leaderboard entries:", error)
    throw error
  }
}

/**
 * Get user ranking on the leaderboard
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} User's ranking info
 */
export const getUserRanking = async (userId) => {
  try {
    const { ApperClient } = window.ApperSDK
    const apperClient = new ApperClient("YOUR_CANVAS_ID")
    
    // Get all users to determine rank
    const params = {
      fields: ['userId', 'totalScore'],
      orderBy: [{ field: 'totalScore', direction: 'desc' }]
    }
    
    const response = await apperClient.fetchRecords('userProfiles', params)
    
    if (response && response.data) {
      const userIndex = response.data.findIndex(profile => profile.userId === userId)
      
      if (userIndex !== -1) {
        const userProfile = response.data[userIndex]
        const totalUsers = response.data.length
        
        return {
          rank: userIndex + 1,
          totalUsers,
          score: userProfile.totalScore || 0,
          percentile: Math.round(((totalUsers - (userIndex + 1)) / totalUsers) * 100)
        }
      }
    }
    
    return {
      rank: null,
      totalUsers: 0,
      score: 0,
      percentile: 0
    }
  } catch (error) {
    console.error("Error fetching user ranking:", error)
    throw error
  }
}

/**
 * Record a new score on the leaderboard
 * @param {Object} scoreData - Score data
 * @returns {Promise<Object>} The created record
 */
export const recordScore = async (scoreData) => {
  try {
    const { ApperClient } = window.ApperSDK
    const apperClient = new ApperClient("YOUR_CANVAS_ID")
    
    const { userId, puzzleId, score, timeSpent, difficulty } = scoreData
    
    // Create leaderboard entry
    const params = {
      record: {
        userId,
        puzzleId,
        score,
        timeSpent,
        difficulty,
        recordedOn: new Date().toISOString()
      }
    }
    
    const response = await apperClient.createRecord('leaderboardEntries', params)
    
    return response.data
  } catch (error) {
    console.error("Error recording score:", error)
    throw error
  }
}