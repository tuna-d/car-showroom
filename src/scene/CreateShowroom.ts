import { Engine, FreeCamera, Scene, Vector3 } from "@babylonjs/core"

export class CreateShowroom {
  scene: Scene
  engine: Engine

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true)
    this.scene = this.CreateScene()

    this.engine.runRenderLoop(() => {
      this.scene.render()
    })
  }

  CreateScene(): Scene {
    const scene = new Scene(this.engine)
    const camera = new FreeCamera("camera", new Vector3(0, 1, -5), this.scene)
    camera.attachControl()
    camera.speed = 0.2

    return scene
  }
}
