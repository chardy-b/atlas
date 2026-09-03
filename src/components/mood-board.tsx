"use client"
import { useState } from "react"
import { projects, categories, type ProjectCategory } from "@/data/projects"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
export function MoodBoard() {
  const [category, setCategory] = useState<ProjectCategory>("All")
  const [selected, setSelected] = useState<(typeof projects)[number] | null>(
    null,
  )
  const shown =
    category === "All"
      ? projects
      : projects.filter((p) => p.categories.includes(category as never))
  return (
    <section id="board" aria-labelledby="board-title" className="board-section">
      <div className="board-heading">
        <div>
          <p className="eyebrow">12 references / 01—05</p>
          <h2 id="board-title">A wall of moving ideas</h2>
        </div>
        <p className="board-count">{shown.length} shown</p>
      </div>
      <div className="filters" role="group" aria-label="Filter projects">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={category === c}
            className={category === c ? "filter active" : "filter"}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      {shown.length ? (
        <div className="project-grid">
          {shown.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={`project-card ${p.span}`}
              onClick={() => setSelected(p)}
            >
              <img src={p.image} alt={p.alt} />
              <span className="project-index">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="project-info">
                <strong>{p.title}</strong>
                <small>
                  {p.creator}
                  {p.year ? ` / ${p.year}` : ""}
                </small>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <p className="empty-board">No references in this category yet.</p>
      )}
      <Dialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="mood-dialog">
          {selected && (
            <>
              <DialogHeader>
                <p className="eyebrow">{selected.categories.join(" / ")}</p>
                <DialogTitle>{selected.title}</DialogTitle>
                <DialogDescription>{selected.note}</DialogDescription>
              </DialogHeader>
              <p className="dialog-credit">
                A reference by {selected.creator}.
              </p>
              <a
                className="source-link"
                href={selected.source}
                target="_blank"
                rel="noreferrer noopener"
              >
                Visit original source ↗
              </a>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
