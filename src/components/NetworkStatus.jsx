import React, { useState, useEffect } from 'react'

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showOfflineMessage, setShowOfflineMessage] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineMessage(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineMessage(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isOnline && showOfflineMessage) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffc107',
        color: '#856404',
        padding: '10px',
        textAlign: 'center',
        zIndex: 9999,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span>📡</span>
          <strong>You're offline</strong>
          <span>•</span>
          <span>Some features may not work properly</span>
        </div>
      </div>
    )
  }

  if (isOnline && showOfflineMessage) {
    // Show brief "back online" message
    setTimeout(() => setShowOfflineMessage(false), 3000)
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#d4edda',
        color: '#155724',
        padding: '10px',
        textAlign: 'center',
        zIndex: 9999,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span>✅</span>
          <strong>You're back online!</strong>
        </div>
      </div>
    )
  }

  return null
}

export default NetworkStatus
