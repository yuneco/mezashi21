<template>
  <div class="GameStageRoot">
    <div class="debug">
      <div class="info">{{ debug.width }} * {{ debug.height }}</div>
      <button @click="tamaLeft" :disabled="tamaDir === 'left'">◀︎</button>
      <button @click="tamaRight" :disabled="tamaDir === 'right'">▶︎</button>
    </div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, computed } from 'vue'
import { GameStage as GameStageClass } from '@/logics/GameStage'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'GameStage',
  setup() {
    const store = useStore()
    const debug = reactive({
      width: window.innerWidth,
      height: window.innerHeight
    })
    window.addEventListener('resize', () => {
      debug.width = window.innerWidth
      debug.height = window.innerHeight
    })

    const tamaLeft = () => {
      store.commit('setTamaDirection', { dir: 'left' })
    }
    const tamaRight = () => {
      store.commit('setTamaDirection', { dir: 'right' })
    }
    const tamaDir = computed(() => store.state.tama.dir)

    const canvas = ref<HTMLCanvasElement>()
    onMounted(() => {
      if (canvas.value) {
        new GameStageClass(canvas.value).load()
      }
    })
    return {
      debug,
      tamaLeft,
      tamaRight,
      tamaDir,
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
