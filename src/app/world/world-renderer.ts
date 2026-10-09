import * as T from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js"
import { RenderPass } from "three/addons/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js"
import { OutputPass } from "three/addons/postprocessing/OutputPass.js"
import { buildWoodland } from "./world-scene"
import { createFrameLoop, viewSettings } from "./world-runtime"

export type WorldController = ReturnType<typeof createWorld>

export function createWorld(
  canvas: HTMLCanvasElement,
  initiallyPaused: boolean,
  onError: () => void,
) {
  let renderer: T.WebGLRenderer | undefined
  let controls: OrbitControls | undefined
  let composer: EffectComposer | undefined
  let woodland: ReturnType<typeof buildWoodland> | undefined
  let observer: ResizeObserver | undefined
  let loop: ReturnType<typeof createFrameLoop> | undefined
  let disposed = false
  let lost = false
  const scene = new T.Scene()
  const camera = new T.PerspectiveCamera(38, 1, 0.1, 90)
  let portrait: boolean | undefined
  const passes: Array<RenderPass | UnrealBloomPass | OutputPass> = []
  const cleanup = () => {
    if (disposed) return
    disposed = true
    loop?.dispose()
    observer?.disconnect()
    document.removeEventListener("visibilitychange", visibility)
    canvas.removeEventListener("webglcontextlost", contextLost)
    canvas.removeEventListener("keydown", keydown)
    controls?.removeEventListener("change", changed)
    controls?.dispose()
    woodland?.dispose()
    passes.forEach((pass) => pass.dispose())
    composer?.dispose()
    scene.traverse((object) => {
      if (object instanceof T.Light) object.dispose()
    })
    renderer?.dispose()
  }
  const changed = () => loop?.invalidate()
  const visibility = () => loop?.visibility(document.hidden || lost)
  const contextLost = (event: Event) => {
    event.preventDefault()
    lost = true
    loop?.visibility(true)
    onError()
  }
  const reset = () => {
    if (!controls) return
    const settings = viewSettings(
      canvas.clientWidth,
      canvas.clientHeight,
      window.devicePixelRatio,
    )
    controls.target.set(0, 2.25, 0)
    camera.position
      .set(0.39, 0.29, 0.875)
      .normalize()
      .multiplyScalar(settings.distance)
      .add(controls.target)
    controls.update()
    changed()
  }
  const zoom = (direction: number) => {
    if (!controls) return
    const offset = camera.position.clone().sub(controls.target)
    offset.setLength(
      T.MathUtils.clamp(
        offset.length() * (direction > 0 ? 0.86 : 1.16),
        controls.minDistance,
        controls.maxDistance,
      ),
    )
    camera.position.copy(controls.target).add(offset)
    controls.update()
    changed()
  }
  const keydown = (event: KeyboardEvent) => {
    if (!controls || event.altKey || event.ctrlKey || event.metaKey) return
    if (["+", "=", "-"].includes(event.key)) {
      event.preventDefault()
      zoom(event.key === "-" ? -1 : 1)
      return
    }
    if (
      !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(
        event.key,
      )
    )
      return
    event.preventDefault()
    if (event.key === "Home") {
      reset()
      return
    }
    const spherical = new T.Spherical().setFromVector3(
      camera.position.clone().sub(controls.target),
    )
    spherical.theta +=
      event.key === "ArrowLeft" ? 0.12 : event.key === "ArrowRight" ? -0.12 : 0
    spherical.phi = T.MathUtils.clamp(
      spherical.phi +
        (event.key === "ArrowUp"
          ? -0.08
          : event.key === "ArrowDown"
            ? 0.08
            : 0),
      controls.minPolarAngle,
      controls.maxPolarAngle,
    )
    camera.position
      .copy(controls.target)
      .add(new T.Vector3().setFromSpherical(spherical))
    controls.update()
    changed()
  }
  try {
    renderer = new T.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "low-power",
    })
    renderer.setClearColor("#102f2e")
    renderer.toneMapping = T.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    const mobile = canvas.clientWidth < 700
    renderer.shadowMap.enabled = !mobile
    renderer.shadowMap.type = T.PCFSoftShadowMap
    scene.fog = new T.FogExp2("#102f2e", 0.033)
    scene.add(new T.HemisphereLight("#c1e1ce", "#546149", 2.4))
    const sun = new T.DirectionalLight("#ffdda0", 3.5)
    sun.position.set(-3, 8, 5)
    sun.castShadow = !mobile
    sun.shadow.mapSize.set(1024, 1024)
    sun.shadow.camera.left = -6
    sun.shadow.camera.right = 6
    sun.shadow.camera.top = 7
    sun.shadow.camera.bottom = -5
    sun.shadow.normalBias = 0.04
    scene.add(sun)
    const rim = new T.DirectionalLight("#6cc4c0", 2)
    rim.position.set(4, 5, -4)
    scene.add(rim)
    woodland = buildWoodland(scene, mobile)
    controls = new OrbitControls(camera, canvas)
    controls.enablePan = false
    controls.enableDamping = false
    controls.minDistance = 8
    controls.maxDistance = 24
    controls.minPolarAngle = 0.55
    controls.maxPolarAngle = 1.48
    controls.rotateSpeed = 0.65
    controls.zoomSpeed = 0.7
    controls.addEventListener("change", changed)
    if (!mobile) {
      composer = new EffectComposer(renderer)
      passes.push(
        new RenderPass(scene, camera),
        new UnrealBloomPass(new T.Vector2(1, 1), 0.19, 0.4, 1.2),
        new OutputPass(),
      )
      passes.forEach((pass) => composer!.addPass(pass))
    }
    loop = createFrameLoop((time) => {
      try {
        woodland?.update(time)
        if (composer) composer.render()
        else renderer?.render(scene, camera)
      } catch {
        lost = true
        loop?.visibility(true)
        onError()
      }
    })
    const resize = () => {
      if (disposed || lost || !renderer) return
      const width = Math.max(1, canvas.clientWidth),
        height = Math.max(1, canvas.clientHeight)
      const settings = viewSettings(width, height, window.devicePixelRatio || 1)
      renderer.setPixelRatio(settings.dpr)
      renderer.setSize(width, height, false)
      composer?.setPixelRatio(settings.dpr)
      composer?.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      if (portrait !== settings.portrait) {
        portrait = settings.portrait
        reset()
      }
      changed()
    }
    observer = new ResizeObserver(resize)
    observer.observe(canvas)
    document.addEventListener("visibilitychange", visibility)
    canvas.addEventListener("webglcontextlost", contextLost)
    canvas.addEventListener("keydown", keydown)
    resize()
    loop.pause(initiallyPaused)
    visibility()
    return {
      reset,
      zoom,
      pause: (value: boolean) => loop?.pause(value),
      dispose: cleanup,
    }
  } catch (error) {
    cleanup()
    throw error
  }
}
