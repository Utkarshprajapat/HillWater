import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Overview from './pages/Overview'
import ZoneMap from './pages/ZoneMap'
import ZoneDetail from './pages/ZoneDetail'
import Analytics from './pages/Analytics'
import Page2 from './pages/Page2'
import ControlCenter from './pages/ControlCenter'
import { DataProvider } from './context/DataContext'
import ErrorBoundary from './components/ErrorBoundary'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { AuthProvider, useAuth } from './context/AuthContext'

// Layout Wrapper Component
const DashboardLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
)

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children ? children : <Outlet />
}

const AdminRoute = ({ children }) => {
  const { isAdmin } = useAuth()
  if (!isAdmin) return <Navigate to="/overview" replace />
  return children ? children : <Outlet />
}

function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <Router>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Dashboard Routes */}
              <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route path="/overview" element={<Overview />} />
                <Route path="/zones" element={<ZoneMap />} />
                <Route path="/zone/:zoneId" element={<ZoneDetail />} />
                <Route path="/analytics" element={<Analytics />} />

                {/* Admin Only Route */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <ControlCenter />
                  </AdminRoute>
                } />
                <Route path="/page2" element={<Page2 />} />
              </Route>
            </Routes>
          </AuthProvider>
        </Router>
      </DataProvider>
    </ErrorBoundary>
  )
}

export default App
