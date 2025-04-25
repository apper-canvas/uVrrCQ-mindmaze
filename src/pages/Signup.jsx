import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, setLoading, setError } from '../store/userSlice'

const Signup = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, error } = useSelector(state => state.user)
  const [errorMessage, setErrorMessage] = useState('')
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])
  
  useEffect(() => {
    setErrorMessage(error || '')
  }, [error])
  
  useEffect(() => {
    // Initialize ApperUI for signup
    const { ApperClient, ApperUI } = window.ApperSDK
    const apperClient = new ApperClient("YOUR_CANVAS_ID")
    
    dispatch(setLoading())
    
    ApperUI.setup(apperClient, {
      target: '#authentication',
      clientId: "YOUR_CANVAS_ID",
      hide: [],
      view: 'signup',
      onSuccess: function(user, account) {
        dispatch(setUser(user))
        
        // Create initial user profile
        const createUserProfile = async () => {
          try {
            const params = {
              record: {
                userId: user.userId,
                displayName: user.firstName + ' ' + user.lastName,
                totalScore: 0,
                gamesPlayed: 0,
                bestTime: null,
                level: 'Beginner'
              }
            }
            
            await apperClient.createRecord('userProfiles', params)
          } catch (error) {
            console.error("Error creating user profile:", error)
          }
        }
        
        createUserProfile()
        navigate('/dashboard', { replace: true })
      },
      onError: function(error) {
        console.error("Registration error:", error)
        dispatch(setError("Registration failed. Please try again."))
      }
    })
    
    ApperUI.showSignup("#authentication")
    
    return () => {
      // Clean up if needed
      try {
        ApperUI.destroy("#authentication")
      } catch (error) {
        console.log("ApperUI cleanup error (can be ignored):", error)
      }
    }
  }, [dispatch, navigate])
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-heading mb-2">Create Account</h1>
          <p className="text-surface-600 dark:text-surface-300">
            Join MindMaze to track your progress and compete with other puzzle enthusiasts
          </p>
        </div>
        
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg text-red-600 dark:text-red-400 text-sm">
            {errorMessage}
          </div>
        )}
        
        <div 
          id="authentication" 
          className="min-h-[400px] flex items-center justify-center"
        />
        
        <div className="mt-6 text-center">
          <p className="text-surface-600 dark:text-surface-300">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-dark dark:hover:text-primary-light font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup