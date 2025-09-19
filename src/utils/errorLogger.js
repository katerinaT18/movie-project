// Error logging utility for monitoring and debugging

class ErrorLogger {
  constructor() {
    this.errors = []
    this.maxErrors = 100 // Keep only last 100 errors
  }

  log(error, context = {}) {
    const errorEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      message: error.message || error,
      stack: error.stack,
      type: error.name || 'Error',
      context: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        ...context
      }
    }

    this.errors.push(errorEntry)

    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Logged')
      console.error('Message:', errorEntry.message)
      console.error('Type:', errorEntry.type)
      console.error('Context:', errorEntry.context)
      if (errorEntry.stack) {
        console.error('Stack:', errorEntry.stack)
      }
      console.groupEnd()
    }

    // In production, you might want to send errors to a monitoring service
    // this.sendToMonitoringService(errorEntry)
  }

  getErrors() {
    return [...this.errors]
  }

  clearErrors() {
    this.errors = []
  }

  // Method to send errors to external monitoring service
  sendToMonitoringService(errorEntry) {
    // Example: Send to Sentry, LogRocket, or custom endpoint
    if (process.env.NODE_ENV === 'production') {
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorEntry)
      // }).catch(console.error)
    }
  }

  // Log API errors with additional context
  logApiError(error, apiUrl, requestData = {}) {
    this.log(error, {
      type: 'API_ERROR',
      apiUrl,
      requestData,
      timestamp: new Date().toISOString()
    })
  }

  // Log network errors
  logNetworkError(error, url) {
    this.log(error, {
      type: 'NETWORK_ERROR',
      url,
      online: navigator.onLine
    })
  }

  // Log component errors
  logComponentError(error, componentName, props = {}) {
    this.log(error, {
      type: 'COMPONENT_ERROR',
      componentName,
      props: Object.keys(props) // Only log prop keys for privacy
    })
  }
}

// Create singleton instance
const errorLogger = new ErrorLogger()

// Global error handler
window.addEventListener('error', (event) => {
  errorLogger.log(event.error, {
    type: 'GLOBAL_ERROR',
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  })
})

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  errorLogger.log(event.reason, {
    type: 'UNHANDLED_PROMISE_REJECTION'
  })
})

export default errorLogger
