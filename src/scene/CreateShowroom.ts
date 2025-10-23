import {
  Engine,
  FreeCamera,
  HemisphericLight,
  MeshBuilder,
  PBRMaterial,
  Scene,
  Vector3,
  Texture,
  ImportMeshAsync,
  Axis,
  Space,
} from "@babylonjs/core"

import "@babylonjs/loaders"

export class CreateShowroom {
  scene: Scene
  engine: Engine

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true)
    this.scene = this.CreateScene()

    this.CreateEnvironment()

    this.engine.runRenderLoop(() => {
      this.scene.render()
    })
  }

  CreateScene(): Scene {
    const scene = new Scene(this.engine)
    const camera = new FreeCamera("camera", new Vector3(0, 10, -15), this.scene)
    camera.attachControl()
    camera.speed = 0.2

    const hemiLight = new HemisphericLight(
      "hemiLight",
      new Vector3(0, 1, 0),
      this.scene
    )
    hemiLight.intensity = 0.75

    return scene
  }

  CreateEnvironment(): void {
    this.CreateGround()
    this.CreateSideWalls()
    this.CreateMclarenModel()
    this.CreatePorscheModel()
  }

  CreateGround(): void {
    const ground = MeshBuilder.CreateGround(
      "ground",
      {
        width: 18,
        height: 18,
      },
      this.scene
    )

    ground.position = new Vector3(0, 0, 0)

    ground.material = this.CreateGroundMat()
  }

  CreateGroundMat(): PBRMaterial {
    const pbr = new PBRMaterial("pbr", this.scene)

    const uvScale = 15
    const texArray: Texture[] = []

    pbr.roughness = 0.65

    const albedoTex = new Texture(
      "./textures/granite/granite_diff.jpg",
      this.scene
    )
    pbr.albedoTexture = albedoTex
    texArray.push(albedoTex)

    const bumpTexture = new Texture(
      "./textures/granite/granite_nor.jpg",
      this.scene
    )
    pbr.bumpTexture = bumpTexture
    texArray.push(bumpTexture)

    pbr.useAmbientOcclusionFromMetallicTextureRed = true
    pbr.useRoughnessFromMetallicTextureGreen = true
    pbr.useMetallnessFromMetallicTextureBlue = true

    const metallicTex = new Texture(
      "./textures/granite/granite_arm.jpg",
      this.scene
    )

    pbr.metallicTexture = metallicTex

    texArray.forEach((tex) => {
      tex.uScale = uvScale
      tex.vScale = uvScale
    })

    return pbr
  }

  CreateSideWalls(): void {
    this.CreateWall(new Vector3(0, 3, 9), 0)
    this.CreateWall(new Vector3(9, 3, 0), Math.PI / 2)
    this.CreateWall(new Vector3(-9, 3, 0), -Math.PI / 2)
  }

  CreateWall(position: Vector3, rotation: number): void {
    const wall = MeshBuilder.CreatePlane(
      "wall",
      { width: 18, height: 6 },
      this.scene
    )
    wall.position = position

    wall.rotation.y = rotation

    wall.material = this.CreateWallMat()
  }

  CreateWallMat(): PBRMaterial {
    const pbr = new PBRMaterial("pbr", this.scene)

    const uvScale = 4
    const texArray: Texture[] = []

    pbr.roughness = 0.65

    const albedoTex = new Texture(
      "./textures/stone-wall/stone_wall_diff.jpg",
      this.scene
    )
    pbr.albedoTexture = albedoTex
    texArray.push(albedoTex)

    const bumpTexture = new Texture(
      "./textures/stone-wall/stone_wall_nor.jpg",
      this.scene
    )
    pbr.bumpTexture = bumpTexture
    texArray.push(bumpTexture)

    pbr.useAmbientOcclusionFromMetallicTextureRed = true
    pbr.useRoughnessFromMetallicTextureGreen = true
    pbr.useMetallnessFromMetallicTextureBlue = true

    const metallicTex = new Texture(
      "./textures/stone-wall/stone_wall_arm.jpg",
      this.scene
    )

    pbr.metallicTexture = metallicTex

    texArray.forEach((tex) => {
      tex.uScale = uvScale
      tex.vScale = uvScale
    })

    return pbr
  }

  async CreateMclarenModel(): Promise<void> {
    const model = await ImportMeshAsync("./models/mclaren.glb", this.scene)
    const root = model.meshes[0]

    root.position = new Vector3(4.5, 0, 4.5)
    root.rotate(Axis.Y, -(3 * Math.PI) / 4, Space.LOCAL)
  }
  async CreatePorscheModel(): Promise<void> {
    const model = await ImportMeshAsync("./models/911.glb", this.scene)
    const root = model.meshes[0]

    root.position = new Vector3(-4.5, 0, -4.5)
    root.rotate(Axis.Y, -Math.PI / 4, Space.LOCAL)
  }
}
