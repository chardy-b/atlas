import * as T from "three"

/** Original geometry and painted textures; deterministic so resets and captures agree. */
export function buildWoodland(scene: T.Scene, mobile: boolean) {
  const geometries = new Set<T.BufferGeometry>()
  const materials = new Set<T.Material>()
  const textures = new Set<T.Texture>()
  const instances = new Set<T.InstancedMesh>()
  let seed = 239
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
  }
  const geo = <G extends T.BufferGeometry>(g: G) => {
    geometries.add(g)
    return g
  }
  const mat = (color: string, roughness = 0.85) => {
    const m = new T.MeshStandardMaterial({ color, roughness })
    materials.add(m)
    return m
  }
  const dispose = () => {
    instances.forEach((o) => o.dispose())
    geometries.forEach((g) => g.dispose())
    materials.forEach((m) => m.dispose())
    textures.forEach((t) => t.dispose())
  }
  try {
    const wood = mat("#694b32"),
      edge = mat("#b48b53"),
      darkWood = mat("#342e22")
    const moss = mat("#657b39"),
      green = mat("#3c654e"),
      cream = mat("#e1d6ad", 0.4)
    const clay = mat("#bb7250", 0.65),
      blue = mat("#6a9e98", 0.3),
      gold = mat("#c9a04d", 0.4)
    const soil = mat("#343d2e"),
      black = mat("#172824"),
      mushroom = mat("#bf633e")
    const sphere = geo(new T.SphereGeometry(1, 16, 12)),
      box = geo(new T.BoxGeometry(1, 1, 1))
    const root = new T.Group()
    scene.add(root)
    function mesh(
      g: T.BufferGeometry,
      m: T.Material,
      p: number[],
      s = [1, 1, 1],
      parent: T.Object3D = root,
    ) {
      const o = new T.Mesh(g, m)
      o.position.set(p[0], p[1], p[2])
      o.scale.set(s[0], s[1], s[2])
      o.castShadow = true
      o.receiveShadow = true
      parent.add(o)
      return o
    }
    const orb = (
      m: T.Material,
      p: number[],
      s: number[],
      parent?: T.Object3D,
    ) => mesh(sphere, m, p, s, parent)
    const plank = (
      m: T.Material,
      p: number[],
      s: number[],
      parent?: T.Object3D,
    ) => mesh(box, m, p, s, parent)
    function branch(
      a: number[],
      b: number[],
      radius: number,
      material = wood,
      parent: T.Object3D = root,
    ) {
      const start = new T.Vector3(...a),
        end = new T.Vector3(...b),
        direction = end.clone().sub(start)
      const cylinder = geo(
        new T.CylinderGeometry(radius * 0.65, radius, direction.length(), 9),
      )
      const o = mesh(
        cylinder,
        material,
        start.add(end).multiplyScalar(0.5).toArray(),
        [1, 1, 1],
        parent,
      )
      o.quaternion.setFromUnitVectors(
        new T.Vector3(0, 1, 0),
        direction.normalize(),
      )
      return o
    }
    function lathe(
      profile: number[][],
      material: T.Material,
      p: number[],
      scale: number,
      parent = root,
    ) {
      return mesh(
        geo(
          new T.LatheGeometry(
            profile.map(([x, y]) => new T.Vector2(x, y)),
            24,
          ),
        ),
        material,
        p,
        [scale, scale, scale],
        parent,
      )
    }
    function ring(
      radius: number,
      tube: number,
      material: T.Material,
      p: number[],
      parent = root,
    ) {
      return mesh(
        geo(new T.TorusGeometry(radius, tube, 8, 24)),
        material,
        p,
        [1, 1, 1],
        parent,
      )
    }
    function paintSign(
      title: string,
      subtitle: string,
      width: number,
      height: number,
      p: number[],
      color = "#253f32",
    ) {
      const canvas = document.createElement("canvas")
      canvas.width = 1024
      canvas.height = 384
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Canvas unavailable")
      ctx.fillStyle = color
      ctx.fillRect(0, 0, 1024, 384)
      ctx.strokeStyle = "#cfbf84"
      ctx.lineWidth = 3
      ctx.strokeRect(18, 18, 988, 348)
      ctx.strokeRect(27, 27, 970, 330)
      ctx.fillStyle = "#efe3b3"
      ctx.textAlign = "center"
      ctx.font = "italic 88px Georgia"
      ctx.fillText(title, 512, 170)
      ctx.font = "24px Georgia"
      ctx.fillText(subtitle, 512, 250)
      ctx.font = "38px Georgia"
      ctx.fillText("❧", 512, 316)
      const texture = new T.CanvasTexture(canvas)
      texture.colorSpace = T.SRGBColorSpace
      textures.add(texture)
      const material = new T.MeshStandardMaterial({
        map: texture,
        roughness: 0.9,
      })
      materials.add(material)
      plank(edge, [p[0], p[1], p[2] - 0.035], [width + 0.1, height + 0.1, 0.12])
      return mesh(geo(new T.PlaneGeometry(width, height)), material, p)
    }
    function cup(
      x: number,
      y: number,
      z: number,
      material: T.Material,
      scale = 1,
    ) {
      const g = new T.Group()
      g.position.set(x, y, z)
      g.scale.setScalar(scale)
      root.add(g)
      lathe(
        [
          [0.06, 0],
          [0.115, 0.025],
          [0.14, 0.19],
          [0.133, 0.205],
          [0.115, 0.19],
          [0.09, 0.045],
          [0.06, 0.04],
        ],
        material,
        [0, 0, 0],
        1,
        g,
      )
      const handle = ring(0.075, 0.018, material, [0.15, 0.11, 0], g)
      handle.scale.x = 0.85
      lathe(
        [
          [0, 0],
          [0.2, 0],
          [0.21, 0.025],
          [0.13, 0.04],
        ],
        cream,
        [0, -0.015, 0],
        1,
        g,
      )
      const tea = mesh(
        geo(new T.CircleGeometry(0.111, 24)),
        wood,
        [0, 0.172, 0],
        [1, 1, 1],
        g,
      )
      tea.rotation.x = -Math.PI / 2
    }
    function teapot(
      x: number,
      y: number,
      z: number,
      material: T.Material,
      scale = 1,
    ) {
      const g = new T.Group()
      g.position.set(x, y, z)
      g.scale.setScalar(scale)
      root.add(g)
      orb(material, [0, 0.2, 0], [0.26, 0.22, 0.23], g)
      lathe(
        [
          [0, 0.035],
          [0.13, 0.035],
          [0.16, 0],
        ],
        material,
        [0, 0.395, 0],
        1,
        g,
      )
      orb(gold, [0, 0.46, 0], [0.035, 0.04, 0.035], g)
      ring(0.18, 0.032, material, [-0.24, 0.22, 0], g)
      const path = new T.CatmullRomCurve3([
        new T.Vector3(0.17, 0.12, 0),
        new T.Vector3(0.33, 0.19, 0),
        new T.Vector3(0.39, 0.36, 0),
      ])
      mesh(
        geo(new T.TubeGeometry(path, 12, 0.05, 8, false)),
        material,
        [0, 0, 0],
        [1, 1, 1],
        g,
      )
    }
    function jar(
      x: number,
      y: number,
      z: number,
      material: T.Material,
      height = 0.38,
    ) {
      lathe(
        [
          [0, 0],
          [0.12, 0],
          [0.14, 0.06],
          [0.14, height - 0.07],
          [0.11, height],
          [0, height],
        ],
        material,
        [x, y, z],
        1,
      )
      plank(cream, [x, y + height * 0.52, z + 0.139], [0.16, 0.12, 0.006])
      mesh(geo(new T.CylinderGeometry(0.13, 0.13, 0.055, 20)), wood, [
        x,
        y + height + 0.02,
        z,
      ])
    }
    // Rounded earth island, stone lip, moss pillows and the winding stepping-stone path.
    orb(soil, [0, -0.23, 0], [4.7, 0.65, 3.8])
    orb(moss, [0, 0.02, 0], [4.65, 0.24, 3.73])
    const stone = mat("#7f8a72")
    for (let i = 0; i < 55; i++) {
      const a = (i / 55) * Math.PI * 2
      orb(
        i % 3 ? soil : stone,
        [Math.cos(a) * 4.45, -0.15 + random() * 0.12, Math.sin(a) * 3.5],
        [0.3 + random() * 0.22, 0.25, 0.25 + random() * 0.16],
      )
    }
    for (let i = 0; i < 8; i++) {
      const z = 1.15 + i * 0.31
      const o = orb(
        stone,
        [Math.sin(i * 0.7) * 0.32, 0.19, z],
        [0.43, 0.07, 0.24],
      )
      o.rotation.y = random()
    }
    // Weathered kiosk: panelled walls, deep shelf cubbies and a substantial green counter.
    plank(darkWood, [0, 1.68, -0.8], [3.65, 2.8, 0.22])
    for (let i = 0; i < 13; i++)
      plank(
        i % 3 === 0 ? green : wood,
        [-1.68 + i * 0.28, 1.65, -0.65],
        [0.26, 2.65, 0.09],
      )
    for (const x of [-1.85, 1.85]) {
      plank(wood, [x, 1.75, 0], [0.19, 3.4, 0.19])
      plank(edge, [x, 1.78, 0.12], [0.055, 3.35, 0.035])
    }
    for (const y of [1.4, 2.08, 2.75]) {
      plank(edge, [0, y, -0.3], [3.5, 0.1, 0.72])
      plank(darkWood, [0, y - 0.065, 0.04], [3.5, 0.06, 0.06])
    }
    for (const x of [-0.64, 0.6])
      plank(wood, [x, 2.09, -0.36], [0.075, 1.3, 0.5])
    for (let row = 0; row < 2; row++)
      for (let j = 0; j < 9; j++) {
        const x = -1.47 + j * 0.36,
          y = 1.47 + row * 0.68
        if (j % 4 === 0) teapot(x, y, -0.25, [blue, clay][row], 0.62)
        else if (j % 3 === 0) cup(x, y, -0.23, cream, 0.82)
        else
          jar(
            x,
            y,
            -0.3,
            [clay, cream, blue, green][(j + row) % 4],
            0.27 + random() * 0.15,
          )
      }
    plank(green, [0, 0.77, 0.58], [3.85, 1.16, 0.87])
    for (let i = 0; i < 16; i++) {
      plank(
        i % 4 === 0 ? moss : green,
        [-1.79 + i * 0.24, 0.77, 1.025],
        [0.22, 1.1, 0.06],
      )
      plank(edge, [-1.79 + i * 0.24, 0.23, 1.067], [0.012, 0.12, 0.008])
    }
    plank(edge, [0, 1.38, 0.59], [4.13, 0.17, 1.11])
    plank(wood, [0, 0.22, 0.59], [4, 0.12, 1])
    for (let i = 0; i < 4; i++)
      plank(wood, [0, 1.473, 0.16 + i * 0.25], [4, 0.012, 0.01])
    teapot(-0.8, 1.47, 0.5, blue, 1.12)
    cup(-0.15, 1.47, 0.75, cream, 1.1)
    cup(0.37, 1.47, 0.72, clay, 0.85)
    jar(1.45, 1.47, 0.32, cream, 0.44)
    paintSign(
      "The Moss Garden",
      "WILD TEAS  ·  SLOW AFTERNOONS",
      1.62,
      0.57,
      [0, 0.8, 1.069],
    )
    // Shingled roof with overlapping, rounded cedar tiles and a mossy ridge.
    const roof = new T.Group()
    root.add(roof)
    for (const side of [-1, 1])
      for (let row = 0; row < 5; row++)
        for (let col = 0; col < 14; col++) {
          const z = side * (0.05 + row * 0.25),
            y = 3.73 - row * 0.13
          const tile = plank(
            col % 3 ? green : moss,
            [-2.04 + col * 0.315, y, z],
            [0.325, 0.075, 0.39],
            roof,
          )
          tile.rotation.x = side * 0.48
          tile.rotation.z = (random() - 0.5) * 0.04
        }
    branch([-2.22, 3.8, 0], [2.24, 3.8, 0], 0.105, wood)
    branch([-2.2, 3.14, 1.23], [2.2, 3.14, 1.23], 0.085, edge)
    paintSign(
      "Chez Chardin",
      "TEA ROOM  /  EST. 1986",
      2.6,
      0.76,
      [0, 3.0, 1.28],
    )
    for (const x of [-1, 1])
      branch([x, 3.47, 1.28], [x, 3.3, 1.28], 0.016, darkWood)
    // Side benches, turned planters and a handwritten menu.
    for (const [x, z, angle] of [
      [-2.7, 1.1, -0.25],
      [2.7, 1.15, 0.3],
    ]) {
      const bench = new T.Group()
      bench.position.set(x, 0, z)
      bench.rotation.y = angle
      root.add(bench)
      for (const offset of [-0.18, 0, 0.18])
        plank(edge, [0, 0.57, offset], [1.35, 0.09, 0.15], bench)
      for (const leg of [-0.48, 0.48]) {
        plank(wood, [leg, 0.32, 0], [0.12, 0.55, 0.4], bench)
        plank(wood, [leg, 0.86, -0.25], [0.08, 0.8, 0.09], bench)
      }
      plank(edge, [0, 1.09, -0.25], [1.4, 0.17, 0.08], bench)
    }
    const menu = paintSign(
      "Today's tea",
      "NETTLE  ·  JASMINE  ·  WILD MINT",
      0.72,
      0.85,
      [2.22, 0.91, 0.45],
    )
    menu.rotation.z = -0.08
    for (const x of [1.94, 2.5])
      branch([x, 0.1, 0.35], [x, 1.35, 0.36], 0.035, wood)
    const potProfile = [
      [0, 0],
      [0.2, 0],
      [0.3, 0.45],
      [0.32, 0.47],
      [0.32, 0.53],
      [0.26, 0.53],
      [0.25, 0.46],
      [0.2, 0.06],
    ]
    for (const [x, z, s] of [
      [-2.18, 0.32, 1.3],
      [2.07, -0.62, 1],
      [-3.4, 1.86, 0.75],
      [3.25, 0.45, 1.2],
    ]) {
      lathe(potProfile, clay, [x, 0.12, z], s)
      orb(soil, [x, 0.12 + s * 0.47, z], [s * 0.255, 0.03, s * 0.255])
      for (let j = 0; j < 9; j++) {
        const a = j * 0.7
        branch(
          [x, 0.4, z],
          [
            x + Math.cos(a) * 0.34,
            0.95 + random() * 0.36,
            z + Math.sin(a) * 0.3,
          ],
          0.015,
          green,
        )
        const leaf = orb(
          moss,
          [
            x + Math.cos(a) * 0.27,
            0.87 + random() * 0.3,
            z + Math.sin(a) * 0.25,
          ],
          [0.12, 0.27, 0.05],
        )
        leaf.rotation.z = Math.cos(a) * 0.8
      }
    }
    // Old trunks and branching silhouettes anchor the layered canopy.
    const treePositions = [
      [-3.15, -1.1],
      [3.25, -1.3],
      [-1.9, -2.6],
      [1.5, -2.75],
      [-4, 0.15],
      [4, -0.2],
    ]
    const crowns: number[][] = []
    treePositions.forEach(([x, z], i) => {
      const height = 4.8 + (i % 3) * 0.5
      branch([x, 0, z], [x + 0.18, height, z - 0.14], 0.27 + (i % 2) * 0.09)
      for (let k = 0; k < 5; k++) {
        const a = k * 1.256 + i
        branch(
          [x, 0.2, z],
          [x + Math.cos(a) * 0.78, 0.12, z + Math.sin(a) * 0.62],
          0.095,
        )
      }
      for (let k = 0; k < 4; k++) {
        const dx = (k - 1.5) * 0.65,
          top = height + 0.3 + random() * 0.5
        branch([x, height * 0.58, z], [x + dx, top, z - 0.3], 0.1)
        crowns.push([x + dx, top, z - 0.3])
      }
      for (let k = 0; k < 4; k++)
        orb(
          moss,
          [x + (random() - 0.5) * 0.25, 0.35 + k * 0.23, z + 0.22],
          [0.23, 0.18, 0.12],
        )
    })
    // Thousands of individual leaves share one draw call; larger clusters provide depth.
    const leafGeometry = geo(new T.SphereGeometry(1, 7, 5)),
      leafMaterial = mat("#6c8b50")
    const leafCount = mobile ? 1700 : 2900
    const leaves = new T.InstancedMesh(leafGeometry, leafMaterial, leafCount)
    instances.add(leaves)
    root.add(leaves)
    const dummy = new T.Object3D(),
      color = new T.Color()
    for (let i = 0; i < leafCount; i++) {
      const crown = crowns[i % crowns.length],
        a = random() * Math.PI * 2,
        r = Math.sqrt(random()) * 1.18
      dummy.position.set(
        crown[0] + Math.cos(a) * r,
        crown[1] + (random() - 0.5) * 0.75,
        crown[2] + Math.sin(a) * r * 0.85,
      )
      dummy.rotation.set(random() * 2, random() * 6, random() * 2)
      dummy.scale.set(
        0.16 + random() * 0.2,
        0.045 + random() * 0.025,
        0.08 + random() * 0.14,
      )
      dummy.updateMatrix()
      leaves.setMatrixAt(i, dummy.matrix)
      color.setHSL(
        0.22 + random() * 0.12,
        0.23 + random() * 0.18,
        0.18 + random() * 0.2,
      )
      leaves.setColorAt(i, color)
    }
    leaves.castShadow = !mobile
    leaves.receiveShadow = true
    // Fern beds: each frond has paired tapered leaflets, with open space around the path.
    const fernCount = mobile ? 1500 : 2400
    const fern = new T.InstancedMesh(leafGeometry, leafMaterial, fernCount)
    instances.add(fern)
    root.add(fern)
    let index = 0
    for (let plant = 0; index < fernCount; plant++) {
      const a = random() * Math.PI * 2,
        r = 2.5 + random() * 1.8,
        x = Math.cos(a) * r,
        z = Math.sin(a) * r * 0.77
      if (z > 1.7 && Math.abs(x) < 1) continue
      for (let frond = 0; frond < 6 && index < fernCount; frond++) {
        const theta = (frond * Math.PI) / 3 + plant,
          length = 0.45 + random() * 0.4
        for (let k = 1; k < 8 && index < fernCount; k++)
          for (const side of [-1, 1]) {
            if (index >= fernCount) break
            const t = k / 8,
              spread = Math.sin(t * Math.PI) * 0.17
            dummy.position.set(
              x +
                Math.cos(theta) * t * length +
                Math.cos(theta + Math.PI / 2) * spread * side,
              0.2 + Math.sin(t * 2) * length * 0.7,
              z +
                Math.sin(theta) * t * length +
                Math.sin(theta + Math.PI / 2) * spread * side,
            )
            dummy.rotation.set(0.2, -theta + side * 0.65, 0.45)
            dummy.scale.set(0.12 * (1 - t) + 0.035, 0.017, 0.04)
            dummy.updateMatrix()
            fern.setMatrixAt(index, dummy.matrix)
            color.setHSL(0.23 + random() * 0.08, 0.38, 0.23 + random() * 0.17)
            fern.setColorAt(index++, color)
          }
      }
    }
    // Moss cushions, tiny flowers, fallen leaves and fly agarics at the forest floor.
    const groundCount = mobile ? 280 : 480
    const ground = new T.InstancedMesh(sphere, moss, groundCount)
    instances.add(ground)
    root.add(ground)
    for (let i = 0; i < groundCount; i++) {
      const a = random() * 6.28,
        r = Math.sqrt(random()) * 4.4,
        x = Math.cos(a) * r,
        z = Math.sin(a) * r * 0.78
      dummy.position.set(x, 0.12, z)
      dummy.rotation.set(0, random() * 6, 0)
      dummy.scale.set(
        0.1 + random() * 0.19,
        0.06 + random() * 0.09,
        0.1 + random() * 0.15,
      )
      dummy.updateMatrix()
      ground.setMatrixAt(i, dummy.matrix)
    }
    for (let i = 0; i < 22; i++) {
      const a = random() * 6.28,
        x = Math.cos(a) * (3 + random()),
        z = Math.sin(a) * (2.5 + random() * 0.6),
        h = 0.15 + random() * 0.2
      branch([x, 0.15, z], [x, 0.15 + h, z], 0.025, cream)
      orb(mushroom, [x, 0.15 + h, z], [h * 0.6, h * 0.23, h * 0.6])
      for (let j = 0; j < 3; j++)
        orb(
          cream,
          [
            x + (random() - 0.5) * h * 0.55,
            0.19 + h,
            z + (random() - 0.5) * h * 0.55,
          ],
          [0.018, 0.008, 0.018],
        )
    }
    // A rabbit visitor and a round, bright-eyed fox curled beside the bench.
    const rabbit = mat("#c9baa0"),
      fox = mat("#bc7542")
    orb(rabbit, [-1.65, 0.39, 2.3], [0.22, 0.3, 0.25])
    orb(rabbit, [-1.65, 0.7, 2.38], [0.19, 0.18, 0.17])
    for (const x of [-1.75, -1.56]) {
      const ear = orb(rabbit, [x, 0.98, 2.37], [0.055, 0.22, 0.065])
      ear.rotation.z = x === -1.75 ? 0.18 : -0.12
      orb(clay, [x, 1, 2.422], [0.025, 0.13, 0.013])
      orb(black, [x, 0.73, 2.53], [0.025, 0.03, 0.016])
    }
    orb(cream, [-1.86, 0.35, 2.19], [0.1, 0.1, 0.1])
    orb(clay, [-1.65, 0.66, 2.55], [0.026, 0.02, 0.02])
    orb(fox, [2.95, 0.4, 1.92], [0.42, 0.24, 0.32])
    orb(fox, [2.69, 0.63, 2.08], [0.23, 0.22, 0.21])
    for (const x of [2.53, 2.83])
      mesh(geo(new T.ConeGeometry(0.105, 0.24, 12)), fox, [x, 0.86, 2.07])
    orb(cream, [2.68, 0.55, 2.26], [0.15, 0.09, 0.1])
    orb(black, [2.68, 0.59, 2.35], [0.034, 0.026, 0.018])
    for (const x of [2.57, 2.8])
      orb(black, [x, 0.68, 2.24], [0.024, 0.029, 0.02])
    const tail = orb(fox, [3.1, 0.35, 2.2], [0.38, 0.13, 0.14])
    tail.rotation.y = -0.5
    orb(cream, [3.36, 0.35, 2.31], [0.15, 0.13, 0.13])
    // Warm lantern, wire bail and small emissive fireflies.
    const glow = mat("#ffe5a0")
    glow.emissive.set("#ffb84f")
    glow.emissiveIntensity = 3
    branch([1.6, 3.05, 0.88], [1.6, 2.72, 0.88], 0.014, darkWood)
    ring(0.11, 0.015, darkWood, [1.6, 2.65, 0.88])
    mesh(
      geo(new T.CylinderGeometry(0.14, 0.19, 0.34, 8)),
      glow,
      [1.6, 2.36, 0.88],
    )
    for (const y of [2.16, 2.56])
      mesh(geo(new T.CylinderGeometry(0.21, 0.21, 0.06, 8)), darkWood, [
        1.6,
        y,
        0.88,
      ])
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2
      branch(
        [1.6 + Math.cos(a) * 0.17, 2.17, 0.88 + Math.sin(a) * 0.17],
        [1.6 + Math.cos(a) * 0.13, 2.55, 0.88 + Math.sin(a) * 0.13],
        0.014,
        darkWood,
      )
    }
    const light = new T.PointLight("#ffc16b", 18, 6, 2)
    light.position.set(1.6, 2.3, 1.2)
    root.add(light)
    const motes = new T.Group()
    root.add(motes)
    for (let i = 0; i < 24; i++)
      orb(
        glow,
        [(random() - 0.5) * 7, 0.6 + random() * 4, (random() - 0.5) * 5],
        [0.012, 0.012, 0.012],
        motes,
      )
    const steam = new T.Group()
    root.add(steam)
    const steamMaterial = new T.MeshBasicMaterial({
      color: "#d9e5cb",
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    })
    materials.add(steamMaterial)
    for (let i = 0; i < 5; i++)
      orb(
        steamMaterial,
        [-0.8 + Math.sin(i) * 0.025, 2.06 + i * 0.085, 0.5],
        [0.04 + i * 0.012, 0.055, 0.04],
        steam,
      )
    return {
      update(time: number) {
        motes.rotation.y = Math.sin(time * 0.12) * 0.07
        motes.position.y = Math.sin(time * 0.6) * 0.06
        steam.position.x = Math.sin(time * 0.7) * 0.04
        steam.scale.y = 1 + Math.sin(time) * 0.08
      },
      dispose() {
        root.removeFromParent()
        dispose()
      },
    }
  } catch (error) {
    dispose()
    throw error
  }
}
