<template>
  <div class="GameStageRoot">
    <div class="debug">
      <div class="info">LEVEL: {{ debug.level }} SCORE: {{ debug.score }}</div>
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
import { State as StoreState } from '@/store'

export default defineComponent({
  name: 'GameStage',
  setup() {
    const store = useStore<StoreState>()
    const debug = reactive({
      level: computed(() => store.state.game.level),
      score: computed(() => store.state.game.score)
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
