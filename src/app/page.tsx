import { AppShell } from "@/components/app-shell"
import { AmbientScene } from "@/components/ambient-scene"
import Link from "next/link"

export default function Home() {
  return (
    <AppShell appName="ATLAS">
      <div className="hero">
        <AmbientScene />
        <p className="eyebrow">Independent digital works</p>
        <h1>
          Two places
          <br />
          <em>to step inside.</em>
        </h1>
        <p className="intro">
          Atlas is a home for tactile, browser-native experiences—each one an
          invitation to look, move, and linger.
        </p>
      </div>
      <section aria-labelledby="projects-title" className="projects-section">
        <div className="projects-heading">
          <p className="eyebrow">Projects / 01—02</p>
          <h2 id="projects-title">Enter an experience.</h2>
        </div>
        <div className="project-grid">
          <Link className="project-card project-mirror" href="/mirror/">
            <span className="project-index">01</span>
            <span className="project-art" aria-hidden="true">
              <span className="mirror-orbit mirror-orbit-one" />
              <span className="mirror-orbit mirror-orbit-two" />
              <span className="mirror-core" />
            </span>
            <span className="project-info">
              <span>
                <strong>Mirror</strong>
                <small>Camera / gesture instrument</small>
              </span>
              <span className="project-arrow" aria-hidden="true">
                ↗
              </span>
            </span>
          </Link>
          <Link className="project-card project-world" href="/world">
            <span className="project-index">02</span>
            <span className="project-art" aria-hidden="true">
              <span className="world-moon" />
              <span className="world-ground" />
              <span className="world-stem world-stem-one" />
              <span className="world-stem world-stem-two" />
              <span className="world-stem world-stem-three" />
            </span>
            <span className="project-info">
              <span>
                <strong>World</strong>
                <small>The Moss Garden / interactive woodland</small>
              </span>
              <span className="project-arrow" aria-hidden="true">
                ↗
              </span>
            </span>
          </Link>
        </div>
      </section>
      <footer className="site-footer">
        <span>Atlas / Two interactive works</span>
        <a href="/api/health">System health ↗</a>
      </footer>
    </AppShell>
  )
}
