import { useEffect, useCallback, useRef } from 'react'

const useInfiniteScroll = (callback, hasMore, isLoading) => {
  const observerRef = useRef()
  const lastElementRef = useCallback(
    (node) => {
      if (isLoading) return
      if (observerRef.current) observerRef.current.disconnect()
      
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          callback()
        }
      }, {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '100px' // Start loading 100px before the element comes into view
      })
      
      if (node) observerRef.current.observe(node)
    },
    [isLoading, hasMore, callback]
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
