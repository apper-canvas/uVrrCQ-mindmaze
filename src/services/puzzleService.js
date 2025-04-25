// Puzzle Service to handle all puzzle-related data operations

/**
 * Get puzzle statistics for a specific user
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} The user's puzzle statistics
 */
export const getUserPuzzleStats = async (userId) => {
  try {
    const { ApperClient } = window.ApperSDK
    const apperClient = new ApperClient("YOUR_CANVAS_ID")
    
    // Fetch user profile which contains stats
    const params = {
      fields: ['userId', 'totalScore', 'gamesPlayed', 'bestTime', 'bestPuzzle', 'level'],
      filter: {
        userId: userId
      }
    }
    
    const response = await apperClient.fetchRecords('userProfiles', params)
    
    if (response && response.data && response.data.length > 0) {
      // Calculate rank by fetching all users ordered by score
      const rankParams = {
        fields: ['userId', 'totalScore'],
        orderBy: [{ field: 'totalScore', direction: 'desc' }]
      }
      
      const rankResponse = await apperClient.fetchRecords('userProfiles', rankParams)
      const userRank = rankResponse.data.findIndex(profile => profile.userId === userId) + 1
      
      // Get total puzzles available
      const puzzlesResponse = await apperClient.fetchRecords('puzzles', {
        fields: ['id'],
      })
      
      // Get completed puzzles
      const completedParams = {
        fields: ['puzzleId'],
        filter: {
          userId: userId,
        }
      }
      
      const completedResponse = await apperClient.fetchRecords('completedPuzzles', completedParams)
      
      return {
        ...response.data[0],
        rank: userRank || 'Unranked',
        total: puzzlesResponse.data.length || 0,
        completed: completedResponse.data.length || 0,
      }
    }
    
    return null
  } catch (error) {
    console.error("Error fetching user puzzle stats:", error)
    throw error
  }
}

/**
 * Get completed puzzles for a specific user
 * @param {string} userId - The user ID
 * @param {number} limit - Number of records to return
 * @returns {Promise<Array>} Array of completed puzzles
 */
export const getUserCompletedPuzzles = async (userId, limit = 5) => {
  try {
    const { ApperClient } = window.ApperSDK
    const apperClient = new ApperClient("YOUR_CANVAS_ID")
    
    const params = {
      fields: ['id', 'userId', 'puzzleId', 'score', 'completedOn', 'timeSpent', 'moves'],
      filter: {
        userId: userId
      },
      pagingInfo: { limit: limit, offset: 0 },
      orderBy: [{ field: 'completedOn', direction: 'desc' }]
    }
    
    const response = await apperClient.fetchRecords('completedPuzzles', params)
    
    if (response && response.data && response.data.length > 0) {
      // Fetch puzzle details for the completed puzzles
      const puzzleIds = response.data.map(record => record.puzzleId)
      
      const puzzleParams = {
        fields: ['id', 'name', 'type', 'difficulty'],
        filter: {
          id: { $in: puzzleIds }
        }
      }
      
      const puzzlesResponse = await apperClient.fetchRecords('puzzles', puzzleParams)
      const puzzleMap = {}
      
      puzzlesResponse.data.forEach(puzzle => {
        puzzleMap[puzzle.id] = puzzle
      })
      
      // Combine completed records with puzzle details
      return response.data.map(record => ({
        id: record.id,
        puzzleId: record.puzzleId,
        puzzleName: puzzleMap[record.puzzleId]?.name || 'Unknown Puzzle',
        puzzleType: puzzleMap[record.puzzleId]?.type || 'unknown',
        difficulty: puzzleMap[record.puzzleId]?.difficulty || 'normal',
        score: record.score,
        completedOn: record.completedOn,
        timeSpent: record.timeSpent,
        moves: record.moves
      }))
    }
    
    return []
  } catch (error) {
    console.error("Error fetching user completed puzzles:", error)
    throw error
  }
}

/**
 * Record a completed puzzle
 * @param {Object} puzzleData - The puzzle completion data
 * @returns {Promise<Object>} The created record
 */
export const recordPuzzleCompletion = async (puzzleData) => {
  try {
    const { ApperClient } = window.ApperSDK
    const apperClient = new ApperClient("YOUR_CANVAS_ID")
    
    const { userId, puzzleId, score, timeSpent, moves } = puzzleData
    
    // Create completed puzzle record
    const params = {
      record: {
        userId,
        puzzleId,
        score,
        timeSpent,
        moves,
        completedOn: new Date().toISOString()
      }
    }
    
    const response = await apperClient.createRecord('completedPuzzles', params)
    
    // Update user profile statistics
    const profileParams = {
      fields: ['id', 'userId', 'totalScore', 'gamesPlayed', 'bestTime'],
      filter: {
        userId: userId
      }
    }
    
    const profileResponse = await apperClient.fetchRecords('userProfiles', profileParams)
    
    if (profileResponse && profileResponse.data && profileResponse.data.length > 0) {
      const profile = profileResponse.data[0]
      const newTotalScore = (profile.totalScore || 0) + score
      const newGamesPlayed = (profile.gamesPlayed || 0) + 1
      
      // Check if this is a new best time
      let updateParams = {
        record: {
          totalScore: newTotalScore,
          gamesPlayed: newGamesPlayed,
          lastActive: new Date().toISOString()
        }
      }
      
      // Update level based on total score
      if (newTotalScore >= 5000) {
        updateParams.record.level = 'Expert'
      } else if (newTotalScore >= 2000) {
        updateParams.record.level = 'Advanced'
      } else if (newTotalScore >= 500) {
        updateParams.record.level = 'Intermediate'
      } else {
        updateParams.record.level = 'Beginner'
      }
      
      // If this time is better than the current best time or there is no best time yet
      if (!profile.bestTime || timeSpent < profile.bestTime) {
        // Get puzzle name for reference
        const puzzleResponse = await apperClient.fetchRecords('puzzles', {
          fields: ['name'],
          filter: { id: puzzleId }
        })
        
        const puzzleName = puzzleResponse.data[0]?.name || 'Unknown Puzzle'
        
        updateParams.record.bestTime = timeSpent
        updateParams.record.bestPuzzle = puzzleName
      }
      
      await apperClient.updateRecord('userProfiles', profile.id, updateParams)
    }
    
    return response.data
  } catch (error) {
    console.error("Error recording puzzle completion:", error)
    throw error
  }
}

/**
 * Get available puzzles
 * @param {Object} options - Filter options
 * @returns {Promise<Array>} Array of puzzles
 */
export const getAvailablePuzzles = async (options = {}) => {
  try {
    const { ApperClient } = window.ApperSDK
    const apperClient = new ApperClient("YOUR_CANVAS_ID")
    
    const { difficulty, type, limit = 10, offset = 0 } = options
    
    const filter = {}
    if (difficulty) filter.difficulty = difficulty
    if (type) filter.type = type
    
    const params = {
      fields: ['id', 'name', 'description', 'type', 'difficulty', 'timeEstimate', 'imageUrl'],
      filter,
      pagingInfo: { limit, offset },
      orderBy: [{ field: 'difficulty', direction: 'asc' }]
    }
    
    const response = await apperClient.fetchRecords('puzzles', params)
    
    return response.data || []
  } catch (error) {
    console.error("Error fetching available puzzles:", error)
    throw error
  }
}