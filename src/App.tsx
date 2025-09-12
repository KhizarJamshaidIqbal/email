import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
// import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from './hooks/useAuth.tsx'
import { NetworkStatus } from './components/NetworkStatus'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import NewsletterEditor from './pages/NewsletterEditor'

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />
}

// Public Route Component (redirect to dashboard if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  return user ? <Navigate to="/dashboard" /> : <>{children}</>
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* Network Status Indicator */}
          <NetworkStatus />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            } />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Newsletter Editor */}
            <Route path="/editor/:projectId" element={
              <ProtectedRoute>
                <NewsletterEditor />
              </ProtectedRoute>
            } />
            
            <Route path="/templates" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Template Library</h1>
                    <p className="text-gray-600">Coming soon...</p>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/analytics" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Analytics Dashboard</h1>
                    <p className="text-gray-600">Coming soon...</p>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/brand-kit" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Brand Kit</h1>
                    <p className="text-gray-600">Coming soon...</p>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/preview/:projectId" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Newsletter Preview</h1>
                    <p className="text-gray-600">Coming soon...</p>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          
          {/* Toast notifications */}
          {/* <Toaster position="top-right" richColors /> */}
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
