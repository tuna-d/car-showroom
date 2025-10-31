<template>
  <main>
    <div id="loader">
      <span>Loading...</span>
      <div id="barContainer">
        <div id="loadingBar"></div>
      </div>
      <span id="barPercent">0%</span>
    </div>

    <canvas></canvas>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { CreateShowroom } from "@/scene/CreateShowroom"

export default defineComponent({
  name: "CarShowroom",

  mounted() {
    const canvas = document.querySelector("canvas")!
    const loader = document.getElementById("loader") as HTMLElement
    const loadingBar = document.getElementById("loadingBar") as HTMLElement
    const barPercent = document.getElementById("barPercent") as HTMLElement
    new CreateShowroom(canvas, loader, loadingBar, barPercent)
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
:global(body) {
  background: #101820;
  background: radial-gradient(
    circle,
    rgba(16, 24, 32, 1) 0%,
    rgba(74, 74, 88, 1) 100%
  );
}

canvas {
  width: 80vw;
  height: 80vh;
}

main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#loader {
  width: 80vw;
  height: 80vh;
  background-image: url("https://www.senna.com/wp-content/uploads/2017/12/Hero-ext_front-3_4_dark__doors_FINAL-1.jpg-2-1-2048x1218.jpg");
  background-size: cover;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#loaded {
  width: 80vw;
  height: 80vh;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.8s ease;
}

#barContainer {
  width: 30%;
  height: 2rem;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 6px;
  margin: 0.5rem;
}

#loadingBar {
  height: 100%;
  background: green;
  border-radius: 6px;
}

span {
  color: white;
  background: none;
  margin-bottom: 1rem;
  font-weight: 400;
  font-size: 2rem;
  text-align: center;
}

#barPercent {
  margin-top: 1rem;
}
</style>
