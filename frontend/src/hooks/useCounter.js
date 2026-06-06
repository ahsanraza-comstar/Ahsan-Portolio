import { useState, useEffect, useRef } from 'react'

export function useCounter(target, duration = 1500) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isVisible = useRef(false)
  const rafId = useRef(null)

  const animate = (to) => {
    if (rafId.current) cancelAnimationFrame(rafId.current)
    const start = performance.now()
    const from  = 0
    const tick  = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      setCount(Math.floor(from + progress * to))
      if (progress < 1) rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)
  }

  // Start animation when element becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        isVisible.current = true
        if (target > 0) animate(target)
      }
    }, { threshold: 0.3 })

    if (ref.current) observer.observe(ref.current)
    return () => { observer.disconnect(); cancelAnimationFrame(rafId.current) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Re-animate whenever target changes AND element is already visible
  useEffect(() => {
    if (isVisible.current && target > 0) animate(target)
  }, [target]) // eslint-disable-line react-hooks/exhaustive-deps

  return { count, ref }
}
