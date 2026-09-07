import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check localStorage on initial load
    const savedUser = localStorage.getItem('hillwater_user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [loading, setLoading] = useState(false)

  // Demo login function
  const login = async (email, password) => {
    setLoading(true)
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 600))

      // Determine role based on email or default to admin
      let role = 'admin'
      let name = 'Operations Officer'

      if (email.toLowerCase().includes('viewer')) {
        role = 'viewer'
        name = 'Field Observer'
      } else if (email.toLowerCase().includes('engineer')) {
        role = 'admin'
        name = 'Hydraulic Engineer'
      }

      const userData = {
        email,
        name,
        role,
        token: `hillwater-jwt-token-${Date.now()}`,
        loginTime: new Date().toISOString()
      }

      setUser(userData)
      localStorage.setItem('hillwater_user', JSON.stringify(userData))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('hillwater_user')
  }

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
