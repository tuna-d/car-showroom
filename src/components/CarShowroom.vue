<template>
  <main>
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

    new CreateShowroom(canvas)
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas {
  width: 80%;
  height: 80%;
}
</style>
