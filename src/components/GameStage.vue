<template>
  <div class="GameStageRoot">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import * as PIXI from 'pixi.js'
import { PixiApp } from '@/logics/PixiApp'
import { loadSvg } from '@/logics/loadImgs'

import { TweenMax, Power2 } from 'gsap'

const initStage = async (canvas: HTMLCanvasElement) => {
  const app = new PixiApp(canvas)

  const sizes = [50, 80, 120, 200, 300, 500]
  const tasks = sizes.map(s => loadSvg('/imgs/tama.svg', s))
  const textures = (await Promise.all(tasks)).sort(
    (t1, t2) => t1.width - t2.width
  )
  const sprites = textures.map(tx => new PIXI.Sprite(tx))
  sprites.forEach((sp, index) => {
    sp.anchor.x = 0.5
    sp.anchor.y = 1
    sp.x = index > 0 ? sprites[index - 1].x + sprites[index - 1].width + 10 : 50
    sp.y = 900
    sp.angle = -20
    TweenMax.to(sp, {
      pixi: { angle: 30 },
      duration: 2,
      repeat: -1,
      ease: Power2.easeInOut,
      yoyo: true
    })
  })
  app.stage.addChild(...sprites)
}

export default defineComponent({
  name: 'GameStage',
  setup() {
    const canvas = ref<HTMLCanvasElement>()
    onMounted(() => {
      if (canvas.value) {
        initStage(canvas.value)
      }
    })
    return {
      canvas
    }
  }
})
</script>

<style lang="scss" scoped>
.GameStageRoot {
  position: relative;
  height: 100%;
}
</style>
