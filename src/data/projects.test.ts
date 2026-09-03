import { describe, expect, it } from "vitest"
import { categories, projects } from "./projects"

describe("mood board catalogue", () => {
  it("contains twelve distinct canonical references with local images", () => {
    expect(projects).toHaveLength(12)
    expect(new Set(projects.map((p) => p.source)).size).toBe(12)
    for (const project of projects) {
      expect(project.source).toMatch(/^https:\/\//)
      expect(project.image).toBe(`/moodboard/${project.id}.webp`)
      expect(project.title.length).toBeGreaterThan(2)
      expect(project.creator.length).toBeGreaterThan(1)
      expect(project.note.length).toBeGreaterThan(20)
      expect(project.alt.length).toBeGreaterThan(5)
    }
  })
  it("exposes the complete filter taxonomy", () => {
    expect(categories).toEqual([
      "All",
      "Worlds",
      "Particles",
      "Product",
      "Play",
      "Shaders",
    ])
    for (const category of categories.slice(1)) {
      expect(
        projects.filter((project) =>
          project.categories.includes(
            category as Exclude<typeof category, "All">,
          ),
        ).length,
      ).toBeGreaterThan(0)
    }
  })
})
