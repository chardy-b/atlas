"use client"

import { useEffect, useRef } from "react"

export function AmbientScene() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (
      !canvas ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return
    let renderer: import("three").WebGLRenderer | undefined
    let frame = 0
    let disposed = false
    const start = async () => {
      try {
        const THREE = await import("three")
        if (
          disposed ||
          (!canvas.getContext("webgl2") && !canvas.getContext("webgl"))
        )
          return
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
        })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10)
        camera.position.z = 3
        const geometry = new THREE.IcosahedronGeometry(1, 2)
        const material = new THREE.MeshBasicMaterial({
          color: 0xd6f36b,
          wireframe: true,
          transparent: true,
          opacity: 0.18,
        })
        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)
        const resize = () => {
          const w = canvas.clientWidth || 1
          const h = canvas.clientHeight || 1
          renderer?.setSize(w, h, false)
          camera.aspect = w / h
          camera.updateProjectionMatrix()
        }
        const draw = () => {
          if (disposed) return
          mesh.rotation.y += 0.002
          mesh.rotation.x += 0.001
          renderer?.render(scene, camera)
          frame = requestAnimationFrame(draw)
        }
        resize()
        window.addEventListener("resize", resize)
        draw()
        return () => {
          window.removeEventListener("resize", resize)
          cancelAnimationFrame(frame)
          geometry.dispose()
          material.dispose()
          renderer?.dispose()
        }
      } catch {
        /* WebGL is decorative; static page remains usable. */
      }
    }
    let cleanup: (() => void) | undefined
    void start().then((fn) => {
      cleanup = fn
    })
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      cleanup?.()
      renderer?.dispose()
    }
  }, [])
  return <canvas ref={ref} aria-hidden="true" className="ambient-scene" />
}
