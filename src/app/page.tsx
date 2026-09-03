import { AppShell } from "@/components/app-shell"
import { MoodBoard } from "@/components/mood-board"
import { AmbientScene } from "@/components/ambient-scene"
export default function Home() {
  return (
    <AppShell appName="ATLAS">
      <div className="hero">
        <AmbientScene />
        <p className="eyebrow">Three.js / field notes</p>
        <h1>
          Ways of seeing
          <br />
          <em>in three dimensions.</em>
        </h1>
        <p className="intro">
          A study wall of experiments, interfaces, and small worlds made with
          Three.js. Browse the references; follow the instincts behind them.
        </p>
        <a href="#board" className="hero-link">
          Enter the board ↓
        </a>
      </div>
      <MoodBoard />
      <footer className="site-footer">
        <span>Built for looking closer.</span>
        <a href="/api/health">System health ↗</a>
      </footer>
    </AppShell>
  )
}
