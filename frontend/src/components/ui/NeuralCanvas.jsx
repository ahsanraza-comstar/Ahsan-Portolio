import { useEffect, useRef } from 'react'
import { useTheme } from '../../context/ThemeContext'

export default function NeuralCanvas({ className = '' }) {
  const canvasRef = useRef(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const isDark = theme === 'dark'

    // Dark: electric aqua + warm gold nodes
    // Light: forest green + clay terracotta nodes
    const NODE_COLORS = isDark
      ? ['rgba(52,211,153,', 'rgba(251,191,36,', 'rgba(52,211,153,', 'rgba(52,211,153,']
      : ['rgba(4,120,87,',   'rgba(194,65,12,',  'rgba(4,120,87,',   'rgba(4,120,87,']

    const EDGE_COLOR  = isDark ? '52,211,153'  : '4,120,87'
    const MOUSE_COLOR = isDark ? '251,191,36'  : '194,65,12'

    let width  = canvas.offsetWidth
    let height = canvas.offsetHeight
    canvas.width  = width
    canvas.height = height

    let mouse = { x: width / 2, y: height / 2 }
    let animId

    const NODE_COUNT = Math.floor((width * height) / 14000)
    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x:   Math.random() * width,
      y:   Math.random() * height,
      vx:  (Math.random() - 0.5) * 0.4,
      vy:  (Math.random() - 0.5) * 0.4,
      r:   Math.random() * 2.5 + 1,
      color: NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    }))

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    const onResize = () => {
      width  = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width  = width
      canvas.height = height
    }
    window.addEventListener('resize', onResize, { passive: true })

    const MAX_DIST   = 160
    const MOUSE_DIST = 200

    function draw() {
      ctx.clearRect(0, 0, width, height)

      for (const n of nodes) {
        n.pulse += n.pulseSpeed
        n.x += n.vx
        n.y += n.vy

        const dx = mouse.x - n.x
        const dy = mouse.y - n.y
        const dist = Math.hypot(dx, dy)
        if (dist < MOUSE_DIST) {
          n.vx += dx * 0.00006
          n.vy += dy * 0.00006
        }

        n.vx *= 0.995
        n.vy *= 0.995

        if (n.x < 0 || n.x > width)  n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1
        n.x = Math.max(0, Math.min(width, n.x))
        n.y = Math.max(0, Math.min(height, n.y))

        const r = n.r + Math.sin(n.pulse) * 0.8

        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4)
        grd.addColorStop(0, n.color + '0.6)')
        grd.addColorStop(1, n.color + '0)')
        ctx.beginPath()
        ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()

        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fillStyle = n.color + '0.9)'
        ctx.fill()
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < MAX_DIST) {
            const opacity = (1 - d / MAX_DIST) * 0.20
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(${EDGE_COLOR},${opacity})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      for (const n of nodes) {
        const dx = mouse.x - n.x, dy = mouse.y - n.y
        const d = Math.hypot(dx, dy)
        if (d < MOUSE_DIST) {
          const opacity = (1 - d / MOUSE_DIST) * 0.45
          ctx.beginPath()
          ctx.moveTo(n.x, n.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.strokeStyle = `rgba(${MOUSE_COLOR},${opacity})`
          ctx.lineWidth = 0.8
          ctx.stroke()
        }
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  )
}
