<template>
  <div class="GameStageRoot">
    <div class="debug">{{ debug.width }} * {{ debug.height }}</div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive } from 'vue'
import { PixiApp } from '@/logics/PixiApp'
import { Tama } from '@/sprites/Tama'
import { Cat } from '@/sprites/Cat'
import { Planet } from '@/sprites/Planet'
import { StarBg } from '@/sprites/StarBg'

const initStage = async (canvas: HTMLCanvasElement) => {
  const app = new PixiApp(canvas)

  const starBg = new StarBg()
  await starBg.load()
  app.stage.addChild(starBg)

  const planetSp = new Planet(700)
  await planetSp.load()
  planetSp.x = 375
  planetSp.y = 1200
  app.stage.addChild(planetSp)

  const tamaSp = new Tama()
  await tamaSp.load()
  app.stage.addChild(tamaSp)
  tamaSp.x = 375
  tamaSp.y = 1200 - 350

  const catSp = new Cat()
  await catSp.load()
  app.stage.addChild(catSp)
  catSp.x = 375
  catSp.y = 1200 - 350

}

export default defineComponent({
  name: 'GameStage',
  setup() {
    const debug = reactive({
      width: window.innerWidth,
      height: window.innerHeight
    })
    window.addEventListener('resize', () => {
      debug.width = window.innerWidth
      debug.height = window.innerHeight
    })
    const canvas = ref<HTMLCanvasElement>()
    onMounted(() => {
      if (canvas.value) {
        initStage(canvas.value)
      }
    })
    return {
      debug,
      canvas
    }
  }
})
</script>

<style lang="scss" scoped>
.GameStageRoot {
  position: relative;
  display: flex;
  height: 100%;
  canvas {
    box-sizing: border-box;
    border: 1px solid gray;
    margin: auto;
  }
  .debug {
    position: absolute;
  }
}
</style>
