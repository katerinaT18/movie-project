import { useEffect, useCallback, useRef } from 'react'

const useInfiniteScroll = (callback, hasMore, isLoading, isTyping = false) => {
  const observerRef = useRef()
  const lastElementRef = useCallback(
    (node) => {
      if (isLoading || isTyping) return
      if (observerRef.current) observerRef.current.disconnect()
      
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isTyping) {
          console.log('🔄 Infinite scroll triggered!', { hasMore, isLoading, isTyping })
          callback()
        }
      }, {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '100px' // Start loading 100px before the element comes into view
      })
      
      if (node) {
        console.log('👀 Observing last element for infinite scroll', { isTyping })
        observerRef.current.observe(node)
      }
    },
    [isLoading, hasMore, isTyping, callback]
  )

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return lastElementRef
}

export default useInfiniteScroll
