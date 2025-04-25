// User Service to handle user profile operations

/**
 * Get user profile
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} User profile data
 */
export const getUserProfile = async (userId) => {
  try {
    const { ApperClient } = window.ApperSDK
    const apperClient = new ApperClient("YOUR_CANVAS_ID")
    
    const params = {
      fields: ['id', 'userId', 'displayName', 'totalScore', 'gamesPlayed', 'bestTime', 'level', 'lastActive'],
      filter: {
        userId: userId
      }
    }
    
    const response = await apperClient.fetchRecords('userProfiles', params)
    
    if (response && response.data && response.data.length > 0) {
      return response.data[0]
    } else {
      // Create a new profile if it doesn't exist
      const newProfile = await createUserProfile(userId)
      return newProfile
    }
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw error
  }
}

/**
 * Create a new user profile
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} The created user profile
 */
export const createUserProfile = async (userId) => {
  try {
    const { ApperClient } = window.ApperSDK
    const apperClient = new ApperClient("YOUR_CANVAS_ID")
    
    // First get user details from auth user
    const userResponse = await apperClient.fetchRecords('users', {
      fields: ['firstName', 'lastName', 'emailAddress'],
      filter: { userId: userId }
    })
    
    let displayName = 'Puzzler'
    if (userResponse.data && userResponse.data.length > 0) {
      const user = userResponse.data[0]
      displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim()
      if (!displayName) displayName = user.emailAddress.split('@')[0]
    }
    
    // Create user profile
    const params = {
      record: {
        userId: userId,
        displayName: displayName,
        totalScore: 0,
        gamesPlayed: 0,
        bestTime: null,
        level: 'Beginner',
        lastActive: new Date().toISOString()
      }
    }
    
    const response = await apperClient.createRecord('userProfiles', params)
    
    return response.data
  } catch (error) {
    console.error("Error creating user profile:", error)
    throw error
  }
}

/**
 * Update user profile
 * @param {string} profileId - The profile ID
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} The updated profile
 */
export const updateUserProfile = async (profileId, profileData) => {
  try {
    const { ApperClient } = window.ApperSDK
    const apperClient = new ApperClient("YOUR_CANVAS_ID")
    
    const params = {
      record: {
        ...profileData,
        lastActive: new Date().toISOString()
      }
    }
    
    const response = await apperClient.updateRecord('userProfiles', profileId, params)
    
    return response.data
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

/**
 * Get user achievements
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} Array of user achievements
 */
export const getUserAchievements = async (userId) => {
  try {
    const { ApperClient } = window.ApperSDK
    const apperClient = new ApperClient("YOUR_CANVAS_ID")
    
    const params = {
      fields: ['id', 'userId', 'achievementId', 'unlockedOn'],
      filter: {
        userId: userId
      }
    }
    
    const response = await apperClient.fetchRecords('userAchievements', params)
    
    if (response && response.data && response.data.length > 0) {
      // Fetch achievement details
      const achievementIds = response.data.map(record => record.achievementId)
      
      const achievementsResponse = await apperClient.fetchRecords('achievements', {
        fields: ['id', 'name', 'description', 'icon'],
        filter: {
          id: { $in: achievementIds }
        }
      })
      
      const achievementsMap = {}
      if (achievementsResponse.data) {
        achievementsResponse.data.forEach(achievement => {
          achievementsMap[achievement.id] = achievement
        })
      }
      
      // Combine user achievements with achievement details
      return response.data.map(userAchievement => ({
        id: userAchievement.id,
        userId: userAchievement.userId,
        unlockedOn: userAchievement.unlockedOn,
        name: achievementsMap[userAchievement.achievementId]?.name || 'Unknown Achievement',
        description: achievementsMap[userAchievement.achievementId]?.description || '',
        icon: achievementsMap[userAchievement.achievementId]?.icon || '🏆'
      }))
    }
    
    return []
  } catch (error) {
    console.error("Error fetching user achievements:", error)
    throw error
  }
}