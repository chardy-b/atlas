import type { Metadata } from "next"
import Link from "next/link"
import { WorldExperience } from "./world-experience"
import styles from "./world.module.css"

export const metadata: Metadata = {
  title: "The Moss Garden · Atlas Worlds",
  description:
    "A little tea house, deep in the woods. Explore an original interactive woodland diorama.",
}

export default function WorldPage() {
  return (
    <main className={styles.world}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Atlas home">
          ATLAS<span> / WORLDS</span>
        </Link>
        <span className={styles.edition}>FIELD STUDY — 001</span>
        <Link href="/" className={styles.back}>
          ← Back to the collection
        </Link>
      </header>
      <section className={styles.intro} aria-labelledby="world-title">
        <p className={styles.eyebrow}>
          <span /> Somewhere off the beaten path
        </p>
        <h1 id="world-title">
          The Moss <em>Garden.</em>
        </h1>
        <p>A little tea. A little stillness. A world of its own.</p>
      </section>
      <WorldExperience />
      <footer className={styles.footer}>
        <span>01 / THE WOODLAND SERIES</span>
        <p>Stay awhile. The kettle is always on.</p>
        <span>MADE OF SMALL WONDERS</span>
      </footer>
    </main>
  )
}
