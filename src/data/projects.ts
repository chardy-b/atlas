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
// Canonical URLs verified against the official threejs.org showcase on 2026-09-03.
const entries: Omit<Project, "image">[] = [
  {
    id: "snookersim",
    title: "Snooker Simulator",
    creator: "SnookerSim",
    source: "https://snookersim.com/",
    alt: "Snooker table simulator",
    categories: ["Play"],
    note: "A precise playable table turns familiar physics into a calm digital space.",
    span: "wide",
  },
  {
    id: "putt-day",
    title: "putt.day",
    creator: "putt.day",
    source: "https://putt.day/",
    alt: "Interactive miniature golf course",
    categories: ["Play", "Worlds"],
    note: "Miniature golf becomes a bright, navigable world with a clear physical rhythm.",
    span: "tall",
  },
  {
    id: "no-mercy-michel",
    title: "No Mercy Michel",
    creator: "No Mercy Michel",
    source: "https://no.merci-michel.com/",
    alt: "No Mercy Michel interactive scene",
    categories: ["Worlds", "Shaders", "Product"],
    note: "A playful branded world shows how art direction can carry an interaction.",
    span: "square",
  },
  {
    id: "firewood",
    title: "Firewood Splitting Simulator",
    creator: "screen.toys",
    source: "https://screen.toys/firewood/",
    alt: "Firewood splitting simulator",
    categories: ["Play"],
    note: "A tactile everyday action becomes an unexpectedly satisfying browser toy.",
    span: "square",
  },
  {
    id: "tiny-skies",
    title: "Tiny Skies",
    creator: "Tiny Skies",
    source: "https://tinyskies.vercel.app/",
    alt: "Tiny stylized sky world",
    categories: ["Worlds", "Particles"],
    note: "Scale and atmosphere make a small procedural scene feel expansive.",
    span: "wide",
  },
  {
    id: "wind-waker",
    title: "Wind Waker JS",
    creator: "Robin Payot",
    source: "https://wind-waker-threejs.com/",
    alt: "Wind Waker inspired 3D scene",
    categories: ["Worlds", "Shaders"],
    note: "A recognizable visual language is translated into an expressive web world.",
    span: "tall",
  },
  {
    id: "cyber-ocean",
    title: "Cyber Ocean",
    creator: "Cyber Ocean",
    source: "https://cyber-ocean.vercel.app/",
    alt: "Cyberpunk ocean scene",
    categories: ["Worlds", "Shaders"],
    note: "A limited neon palette gives a moving horizon a strong graphic identity.",
    span: "square",
  },
  {
    id: "bruno-simon",
    title: "Bruno Simon",
    creator: "Bruno Simon",
    source: "https://bruno-simon.com/",
    alt: "Bruno Simon interactive portfolio world",
    categories: ["Play", "Worlds"],
    note: "The portfolio itself becomes a game, making navigation the central material.",
    span: "wide",
  },
  {
    id: "three-doom",
    title: "Three.js Doom",
    creator: "Mr.doob",
    source: "https://mrdoob.github.io/three-doom/",
    alt: "Three.js Doom game",
    categories: ["Play", "Worlds"],
    note: "A classic game language demonstrates the reach of a WebGL canvas.",
    span: "square",
  },
  {
    id: "polytrack",
    title: "PolyTrack",
    creator: "Kodub",
    source: "https://www.kodub.com/apps/polytrack",
    alt: "Low-poly racing game",
    categories: ["Play", "Worlds"],
    note: "Low-poly geometry keeps speed, track, and playfulness immediately legible.",
    span: "tall",
  },
  {
    id: "slow-roads",
    title: "Slow Roads",
    creator: "Slow Roads",
    source: "https://slowroads.io/",
    alt: "Procedural road landscape",
    categories: ["Worlds", "Shaders"],
    note: "An endless road turns procedural terrain into a meditative journey.",
    span: "square",
  },
  {
    id: "softbodies",
    title: "Softbodies",
    creator: "Holtsetio",
    source: "https://holtsetio.com/lab/softbodies/",
    alt: "Soft body physics experiment",
    categories: ["Particles", "Shaders"],
    note: "Soft-body motion makes material and physics feel wonderfully close at hand.",
    span: "wide",
  },
]
export const projects: Project[] = entries.map((project) => ({
  ...project,
  image: `/moodboard/${project.id}.webp`,
}))
