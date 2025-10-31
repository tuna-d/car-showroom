import { ILoadingScreen } from "@babylonjs/core"

export class CustomLoadingScreen implements ILoadingScreen {
  constructor(
    private loader: HTMLElement,
    private loadingBar: HTMLElement,
    private barPercent: HTMLElement
  ) {}
  loadingUIText!: string
  loadingUIBackgroundColor!: string

  displayLoadingUI(): void {
    this.loadingBar.style.width = "0%"
    this.barPercent.innerHTML = "0%"
  }
  hideLoadingUI(): void {
    this.loader.id = "loaded"
    setTimeout(() => {
      this.loader.style.display = "none"
    }, 1000)
  }

  updateLoadStatus(status: string) {
    this.loadingBar.style.width = `${status}%`
    this.barPercent.innerHTML = `${status}%`
  }
}
