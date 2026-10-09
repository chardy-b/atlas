import { AppShell } from "@/components/app-shell"
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
        <div className="flex flex-wrap items-center gap-4">
          <a href="#board" className="hero-link">
            Enter the board ↓
          </a>
          <a
            href="/world"
            className="hero-link"
            aria-label="Explore The Moss Garden woodland world"
          >
            Explore The Moss Garden ↗
          </a>
        </div>
      </div>
      <section id="board" aria-labelledby="projects-title" className="board-section">
        <div className="board-heading">
          <div>
            <p className="eyebrow">Atlas / selected projects</p>
            <h2 id="projects-title">Small worlds, made tangible.</h2>
          </div>
          <p className="board-count">02 projects</p>
        </div>
        <div className="project-grid">
          <a className="project-card span-wide" href="/mirror/">
            <span className="project-index">01</span>
            <span className="project-info"><strong>Mirror</strong><small>Camera / gesture instrument</small></span>
          </a>
          <a className="project-card span-tall" href="/world">
            <span className="project-index">02</span>
            <span className="project-info"><strong>The Moss Garden</strong><small>Three.js / woodland world</small></span>
          </a>
        </div>
      </section>
      <footer className="site-footer">
        <span>Built for looking closer.</span>
        <a href="/api/health">System health ↗</a>
      </footer>
    </AppShell>
  )
}
