import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.user)
  const location = useLocation()

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If authenticated, render the protected component
  return children
}

export default RequireAuth