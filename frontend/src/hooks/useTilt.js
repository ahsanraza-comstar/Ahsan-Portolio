import { useRef, useCallback } from 'react'

export function useTilt(max = 12) {
  const ref = useRef(null)

  const onMouseMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    const x = (e.clientX - left) / width  - 0.5   // -0.5 → 0.5
    const y = (e.clientY - top)  / height - 0.5
    el.style.transform = `perspective(700px) rotateY(${x * max * 2}deg) rotateX(${-y * max}deg) scale3d(1.02,1.02,1.02)`
    el.style.transition = 'transform 0.1s ease'
  }, [max])

  const onMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)'
    el.style.transition = 'transform 0.5s ease'
  }, [])

  return { ref, onMouseMove, onMouseLeave }
}
