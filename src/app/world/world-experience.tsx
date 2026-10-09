"use client"

import { useEffect, useRef, useState } from "react"
import { Minus, Pause, Play, Plus, RotateCcw, MoveUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { WorldController } from "./world-renderer"
import styles from "./world.module.css"

export function WorldExperience() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const controller = useRef<WorldController | null>(null)
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [paused, setPaused] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let disposed = false
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const motion = () => {
      setPaused(media.matches)
      controller.current?.pause(media.matches)
    }
    media.addEventListener("change", motion)
    void import("./world-renderer")
      .then(({ createWorld }) => {
        if (disposed || !canvas.current) return
        controller.current = createWorld(canvas.current, media.matches, () => {
          if (!disposed) setStatus("error")
        })
        setPaused(media.matches)
        setStatus("ready")
      })
      .catch(() => {
        if (!disposed) setStatus("error")
      })
    return () => {
      disposed = true
      media.removeEventListener("change", motion)
      controller.current?.dispose()
      controller.current = null
    }
  }, [attempt])

  const unavailable = status !== "ready"
  return (
    <section
      className={styles.experience}
      aria-label="Explore the woodland tea house"
    >
      <canvas
        key={attempt}
        ref={canvas}
        className={styles.canvas}
        tabIndex={status === "ready" ? 0 : -1}
        aria-label="Woodland diorama. Use arrow keys to orbit, plus and minus to zoom, or drag and pinch."
        aria-describedby="world-description world-help"
        data-status={status}
      />
      <div className={styles.sceneLabel} aria-hidden="true">
        <span className={styles.dot} /> THE CLEARING <span>48° N · 02° E</span>
      </div>
      <div className={styles.note}>
        <span className={styles.noteIndex}>A PLACE TO PAUSE</span>
        <h2>Chez Chardin</h2>
        <p id="world-description">
          A moss-covered tea counter beneath an old forest canopy. Hand-thrown
          cups, a warm lantern, and a few curious woodland regulars.
        </p>
        <span className={styles.open}>
          <span /> Open until the fireflies sleep
        </span>
      </div>
      {status !== "ready" && (
        <div className={styles.fallback} role="status">
          <span className={styles.fallbackLeaf} aria-hidden="true">
            ❧
          </span>
          <h2>
            {status === "loading"
              ? "Finding the forest…"
              : "A quiet moment in the clearing"}
          </h2>
          <p>
            {status === "loading"
              ? "Setting the cups out and lighting the lantern."
              : "The interactive woodland couldn’t open. It needs a browser with WebGL 2 available. You can try opening it again."}
          </p>
          {status === "error" && (
            <Button
              className={styles.control}
              onClick={() => {
                setStatus("loading")
                setAttempt((n) => n + 1)
              }}
            >
              Try again
            </Button>
          )}
        </div>
      )}
      <noscript>
        <p className={styles.fallback}>
          Enable JavaScript to explore the woodland. Chez Chardin is a tiny tea
          kiosk surrounded by ferns, pottery, and forest creatures.
        </p>
      </noscript>
      <div className={styles.bottomBar}>
        <p id="world-help">
          <MoveUpRight size={14} aria-hidden="true" /> Drag to wander{" "}
          <span>·</span> Scroll or pinch to look closer
        </p>
        <div
          className={styles.controls}
          role="group"
          aria-label="Scene controls"
        >
          <Button
            className={styles.control}
            disabled={unavailable}
            onClick={() => controller.current?.zoom(1)}
            aria-label="Zoom in"
          >
            <Plus />
          </Button>
          <Button
            className={styles.control}
            disabled={unavailable}
            onClick={() => controller.current?.zoom(-1)}
            aria-label="Zoom out"
          >
            <Minus />
          </Button>
          <span className={styles.divider} />
          <Button
            className={styles.control}
            disabled={unavailable}
            onClick={() => controller.current?.reset()}
            aria-label="Reset view"
          >
            <RotateCcw />
            <span>Reset</span>
          </Button>
          <Button
            className={styles.control}
            disabled={unavailable}
            aria-pressed={paused}
            aria-label={paused ? "Resume animation" : "Pause animation"}
            onClick={() => {
              controller.current?.pause(!paused)
              setPaused(!paused)
            }}
          >
            {paused ? <Play /> : <Pause />}
            <span>{paused ? "Resume" : "Pause"}</span>
          </Button>
        </div>
      </div>
      <span className={styles.srOnly} role="status">
        {status === "ready"
          ? paused
            ? "Woodland ready. Animation paused."
            : "Woodland ready. Animation playing."
          : ""}
      </span>
    </section>
  )
}
