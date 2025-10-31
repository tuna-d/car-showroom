import {
  Engine,
  FreeCamera,
  MeshBuilder,
  PBRMaterial,
  Scene,
  Vector3,
  Texture,
  ImportMeshAsync,
  Axis,
  Space,
  SpotLight,
  PointLight,
  LightGizmo,
  GizmoManager,
  Light,
  ShadowGenerator,
  AbstractMesh,
  ShadowLight,
  AxesViewer,
  ISceneLoaderProgressEvent,
} from "@babylonjs/core"

import "@babylonjs/loaders"
import { CustomLoadingScreen } from "./CustomLoadingScreen"

export class CreateShowroom {
  scene: Scene
  engine: Engine
  mclaren!: AbstractMesh
  porsche!: AbstractMesh
  spotLights: ShadowLight[] = []
  loadingScreen: CustomLoadingScreen

  modelCount = 3
  taskProgress = [0, 0, 0]

  constructor(
    private canvas: HTMLCanvasElement,
    private loader: HTMLElement,
    private loadingBar: HTMLElement,
    private barPercent: HTMLElement
  ) {
    this.engine = new Engine(this.canvas, true)

    this.loadingScreen = new CustomLoadingScreen(
      this.loader,
      this.loadingBar,
      this.barPercent
    )

    this.engine.loadingScreen = this.loadingScreen
    this.engine.displayLoadingUI()

    this.scene = this.CreateScene()

    this.CreateEnvironment()

    this.engine.runRenderLoop(() => {
      this.scene.render()
    })
  }

  private calculatePercent(evt: ISceneLoaderProgressEvent): number {
    let loadStatus = 0
    if (evt.lengthComputable) {
      loadStatus = Math.floor((evt.loaded * 100) / evt.total)
    } else {
      const dlCount = evt.loaded / (1024 * 1024)
      loadStatus = Math.min(100, Math.floor(dlCount * 10))
    }

    return loadStatus
  }

  private updateOverallProgress() {
    const sum = this.taskProgress.reduce((a, b) => a + b, 0)
    const overall = Math.floor(sum / this.modelCount)
    this.loadingScreen.updateLoadStatus(overall.toString())
  }

  CreateScene(): Scene {
    const scene = new Scene(this.engine)
    const camera = new FreeCamera(
      "camera",
      new Vector3(0, 3.5, -15),
      this.scene
    )
    camera.attachControl()
    camera.speed = 0.2

    //Use this only if needed to visualize axes.
    //const axes = new AxesViewer(this.scene, 3)
    return scene
  }

  CreateEnvironment(): void {
    this.CreateGround()
    this.CreateSideWalls()
    this.CreateLights()

    const wallLamps = this.PositionWallLamps()
    const porsche = this.CreatePorscheModel()
    const mclaren = this.CreateMclarenModel()

    porsche.then(() => this.CreateShadows(this.spotLights[0], this.porsche))
    mclaren.then(() => this.CreateShadows(this.spotLights[1], this.mclaren))

    Promise.all([wallLamps, porsche, mclaren]).then(() => {
      this.engine.hideLoadingUI()
    })
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

    ground.receiveShadows = true
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

    wall.receiveShadows = true
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
    const model = await ImportMeshAsync("./models/mclaren.glb", this.scene, {
      onProgress: (evt) => {
        this.taskProgress[0] = this.calculatePercent(evt)
        this.updateOverallProgress()
      },
    })
    const mclarenRoot = model.meshes[0]

    if (mclarenRoot) this.mclaren = mclarenRoot

    mclarenRoot.position = new Vector3(4.5, 0, 4.5)
    mclarenRoot.rotate(Axis.Y, -(3 * Math.PI) / 4, Space.LOCAL)
  }

  async CreatePorscheModel(): Promise<void> {
    const model = await ImportMeshAsync("./models/911.glb", this.scene, {
      onProgress: (evt) => {
        this.taskProgress[1] = this.calculatePercent(evt)
        this.updateOverallProgress()
      },
    })
    const porscheRoot = model.meshes[0]

    if (porscheRoot) this.porsche = porscheRoot

    porscheRoot.position = new Vector3(-4.5, 0, -4.5)
    porscheRoot.rotate(Axis.Y, -Math.PI / 4, Space.LOCAL)
  }

  CreateLights(): void {
    const spotLight1 = new SpotLight(
      "spotLight",
      new Vector3(4.5, 3, -9),
      new Vector3(-4.5, 0, 2),
      Math.PI / 2,
      10,
      this.scene
    )

    spotLight1.intensity = 250

    spotLight1.shadowEnabled = true
    spotLight1.shadowMaxZ = 25
    spotLight1.shadowMinZ = 1

    const spotLight2 = new SpotLight(
      "spotLight",
      new Vector3(0.5, 2, -6),
      new Vector3(2, 0, 5.5),
      Math.PI / 2,
      10,
      this.scene
    )

    spotLight2.intensity = 250

    spotLight2.shadowEnabled = true
    spotLight2.shadowMaxZ = 50
    spotLight2.shadowMinZ = 1

    if (spotLight1 && spotLight2) this.spotLights.push(spotLight1, spotLight2)
  }

  async CreateWallLamp(position: Vector3, rotation: number): Promise<void> {
    const model = await ImportMeshAsync("./models/wall-lamp.glb", this.scene)
    const root = model.meshes[0]

    root.scaling = new Vector3(3, 3, 3)
    root.position = position //input
    root.rotate(Axis.X, -Math.PI / 2, Space.LOCAL)
    root.rotate(Axis.Z, rotation, Space.LOCAL) //input

    const pointLight = new PointLight(
      "pointLight",
      new Vector3(0, 0.13, -0.05),
      this.scene
    )

    pointLight.intensity = 0.6
    pointLight.parent = root
  }

  PositionWallLamps(): Promise<void> {
    return Promise.all([
      this.CreateWallLamp(new Vector3(-9, 4, -4.5), Math.PI / 2),
      this.CreateWallLamp(new Vector3(-9, 4, 4.5), Math.PI / 2),
      this.CreateWallLamp(new Vector3(9, 4, -4.5), -Math.PI / 2),
      this.CreateWallLamp(new Vector3(9, 4, 4.5), -Math.PI / 2),
    ]).then(() => {
      this.taskProgress[2] = 100
      this.updateOverallProgress()
    })
  }

  CreateShadows(spotLight: ShadowLight, model: AbstractMesh): void {
    const shadowGen = new ShadowGenerator(2048, spotLight)
    shadowGen.useBlurCloseExponentialShadowMap = true

    model.receiveShadows = true
    shadowGen.addShadowCaster(model)
  }

  //Use this only if needed to visualize and manipulate custom lights.
  CreateGizmos(customLight: Light): void {
    const lightGizmo = new LightGizmo()
    lightGizmo.scaleRatio = 2
    lightGizmo.light = customLight

    const gizmoManager = new GizmoManager(this.scene)
    gizmoManager.positionGizmoEnabled = true
    gizmoManager.rotationGizmoEnabled = true
    gizmoManager.usePointerToAttachGizmos = false
    gizmoManager.attachToMesh(lightGizmo.attachedMesh)
  }
}
