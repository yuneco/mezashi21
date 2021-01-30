<template>
  <div class="GameStageRoot">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import * as PIXI from 'pixi.js'

const initPixiStage = (canvas: HTMLCanvasElement) => {
  const pixiApp = new PIXI.Application({
    width: 600,
    height: 600,
    view: canvas,
    backgroundColor: 0xcccccc,
    resolution: window.devicePixelRatio || 1,
    antialias: true,
    autoDensity: true,
    transparent: true
  })
}

export default defineComponent({
  name: 'GameStage',
  setup() {
    const canvas = ref<HTMLCanvasElement>()
    onMounted(() => {
      if (canvas.value) {
        initPixiStage(canvas.value)
      }
    })
    return {
      canvas
    }
  }
})
</script>
