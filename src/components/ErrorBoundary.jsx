import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-municipal-gray-50 p-6">
          <div className="max-w-md w-full bg-white rounded-lg border border-municipal-gray-200 p-6">
            <h1 className="text-xl font-bold text-municipal-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-municipal-gray-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-municipal-blue-600 text-white rounded-lg hover:bg-municipal-blue-700 transition-colors"
            >
              Reload Page
            </button>
            <details className="mt-4">
              <summary className="text-xs text-municipal-gray-500 cursor-pointer">
                Error Details
              </summary>
              <pre className="mt-2 text-xs bg-municipal-gray-100 p-2 rounded overflow-auto">
                {this.state.error?.stack}
              </pre>
            </details>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
