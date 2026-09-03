"use client"
import { useEffect, useRef } from "react"
export function AmbientScene() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return
    let frame = 0
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const draw = () => {
      canvas.width = canvas.clientWidth * devicePixelRatio
      canvas.height = canvas.clientHeight * devicePixelRatio
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#d6f36b"
      for (let i = 0; i < 35; i++) {
        const x = (i * 97 + frame * 0.15) % canvas.width,
          y = (i * 53 + Math.sin(frame / 900 + i) * 30) % canvas.height
        ctx.globalAlpha = 0.18
        ctx.fillRect(x, y, 2, 2)
      }
      frame++
      return requestAnimationFrame(draw)
    }
    const id = draw()
    return () => cancelAnimationFrame(id)
  }, [])
  return <canvas ref={ref} aria-hidden="true" className="ambient-scene" />
}
