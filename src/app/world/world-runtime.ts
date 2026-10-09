/** One RAF owner. Static/reduced-motion scenes redraw only on interaction. */
export function createFrameLoop(draw: (time: number) => void) {
  let frame = 0
  let paused = false
  let hidden = false
  let disposed = false
  let elapsed = 0
  let previous = 0
  function cancel() {
    cancelAnimationFrame(frame)
    frame = 0
    previous = 0
  }
  function tick(now: number) {
    frame = 0
    if (disposed || hidden) return
    if (!paused && previous) elapsed += Math.min((now - previous) / 1000, 0.05)
    previous = now
    draw(elapsed)
    if (!paused) frame = requestAnimationFrame(tick)
  }
  function invalidate() {
    if (!disposed && !hidden && !frame) frame = requestAnimationFrame(tick)
  }
  return {
    invalidate,
    pause(value: boolean) {
      paused = value
      cancel()
      invalidate()
    },
    visibility(value: boolean) {
      hidden = value
      cancel()
      invalidate()
    },
    dispose() {
      disposed = true
      cancel()
    },
  }
}

export function viewSettings(width: number, height: number, dpr: number) {
  const portrait = width / height < 0.85
  const mobile = width < 700
  return {
    portrait,
    mobile,
    dpr: Math.min(dpr, mobile ? 1.25 : 1.75),
    distance: portrait ? 19.3 : 15.2,
  }
}
