import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, setLoading, setError } from '../store/userSlice'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, error } = useSelector(state => state.user)
  const [errorMessage, setErrorMessage] = useState('')
  
  // Get the page to redirect to after login
  const from = location.state?.from?.pathname || '/dashboard'
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])
  
  useEffect(() => {
    setErrorMessage(error || '')
  }, [error])
  
  useEffect(() => {
    // Initialize ApperUI for login
    const { ApperClient, ApperUI } = window.ApperSDK
    const apperClient = new ApperClient("YOUR_CANVAS_ID")
    
    dispatch(setLoading())
    
    ApperUI.setup(apperClient, {
      target: '#authentication',
      clientId: "YOUR_CANVAS_ID",
      hide: [],
      view: 'login',
      onSuccess: function(user, account) {
        dispatch(setUser(user))
        navigate(from, { replace: true })
      },
      onError: function(error) {
        console.error("Authentication error:", error)
        dispatch(setError("Authentication failed. Please try again."))
      }
    })
    
    ApperUI.showLogin("#authentication")
    
    return () => {
      // Clean up if needed
      try {
        ApperUI.destroy("#authentication")
      } catch (error) {
        console.log("ApperUI cleanup error (can be ignored):", error)
      }
    }
  }, [dispatch, navigate, from])
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-heading mb-2">Welcome Back</h1>
          <p className="text-surface-600 dark:text-surface-300">
            Login to track your puzzle progress and compete on the leaderboards
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
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:text-primary-dark dark:hover:text-primary-light font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login