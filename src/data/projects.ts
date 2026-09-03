export const categories = [
  "All",
  "Worlds",
  "Particles",
  "Product",
  "Play",
  "Shaders",
] as const
export type ProjectCategory = (typeof categories)[number]
export interface Project {
  id: string
  title: string
  creator: string
  source: string
  image: string
  alt: string
  categories: Exclude<ProjectCategory, "All">[]
  year?: number
  note: string
  span: string
}
const entries: Omit<Project, "image">[] = [
  {
    id: "aer",
    title: "AER",
    creator: "Three.js Showcase",
    source: "https://threejs.org/",
    alt: "Abstract atmospheric 3D landscape",
    categories: ["Worlds", "Shaders"],
    year: 2024,
    note: "A quiet horizon shows how scale can create emotion before interaction begins.",
    span: "wide",
  },
  {
    id: "particles",
    title: "Particle Playground",
    creator: "Three.js Examples",
    source: "https://threejs.org/examples/",
    alt: "Glowing particles in a dark field",
    categories: ["Particles", "Play"],
    year: 2024,
    note: "Dense points become a material language when their motion stays legible.",
    span: "tall",
  },
  {
    id: "webgl-fluid",
    title: "WebGL Fluid Simulation",
    creator: "PavelDoGreat",
    source: "https://paveldogreat.github.io/WebGL-Fluid-Simulation/",
    alt: "Colorful fluid simulation",
    categories: ["Shaders", "Play"],
    note: "A responsive field turns a shader into an instrument rather than a backdrop.",
    span: "square",
  },
  {
    id: "rolex",
    title: "Rolex Submariner",
    creator: "Three.js Showcase",
    source: "https://threejs.org/",
    alt: "Precision watch rendered in 3D",
    categories: ["Product"],
    note: "Product detail is earned through restrained lighting and slow discovery.",
    year: 2023,
    span: "square",
  },
  {
    id: "galaxy",
    title: "Galaxy Generator",
    creator: "Bruno Simon",
    source: "https://threejs.org/examples/",
    alt: "Procedural galaxy of stars",
    categories: ["Particles", "Worlds"],
    note: "Procedural systems feel authored when a simple palette gives them a point of view.",
    span: "wide",
  },
  {
    id: "portal",
    title: "Portal Scene",
    creator: "Three.js Examples",
    source: "https://threejs.org/examples/",
    alt: "A portal glowing in a 3D scene",
    categories: ["Worlds", "Shaders"],
    note: "A single luminous threshold can make a small scene feel expansive.",
    span: "tall",
  },
  {
    id: "game",
    title: "WebGL Game",
    creator: "Three.js Examples",
    source: "https://threejs.org/examples/",
    alt: "Low-poly game environment",
    categories: ["Play", "Worlds"],
    note: "Playful geometry keeps the rules visible and invites a second look.",
    span: "square",
  },
  {
    id: "type",
    title: "3D Type",
    creator: "Three.js Examples",
    source: "https://threejs.org/examples/",
    alt: "Three-dimensional letters",
    categories: ["Product", "Shaders"],
    note: "Typography becomes architecture when light reveals its edges.",
    span: "wide",
  },
  {
    id: "waves",
    title: "Ocean Waves",
    creator: "Three.js Examples",
    source: "https://threejs.org/examples/",
    alt: "Animated ocean waves",
    categories: ["Worlds", "Shaders"],
    note: "A familiar subject becomes uncanny through a deliberately limited horizon.",
    span: "square",
  },
  {
    id: "cloth",
    title: "Cloth Simulation",
    creator: "Three.js Examples",
    source: "https://threejs.org/examples/",
    alt: "Fabric folded in a 3D simulation",
    categories: ["Product", "Play"],
    note: "Physics is most persuasive when the material keeps a trace of gravity.",
    span: "tall",
  },
  {
    id: "lines",
    title: "Flowing Lines",
    creator: "Three.js Examples",
    source: "https://threejs.org/examples/",
    alt: "Fine lines flowing through space",
    categories: ["Particles", "Shaders"],
    note: "Line work can suggest movement without asking the viewer to follow a path.",
    span: "square",
  },
  {
    id: "terrain",
    title: "Infinite Terrain",
    creator: "Three.js Examples",
    source: "https://threejs.org/examples/",
    alt: "A low-poly terrain under a dark sky",
    categories: ["Worlds", "Play"],
    note: "Repetition becomes a horizon trick: the eye supplies the world beyond the frame.",
    span: "wide",
  },
]
export const projects: Project[] = entries.map((project) => ({
  ...project,
  image: `/moodboard/${project.id}.svg`,
}))
