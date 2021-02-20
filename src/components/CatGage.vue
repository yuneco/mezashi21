<template>
  <div class="CatGage fulful">
    <div class="bar" :style="{ transform: `scaleX(${progress})` }"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { State as StoreState } from '@/store'
import { useStore } from 'vuex'
import { getCurrentStage } from '@/store/getCurrentStage'

export default defineComponent({
  name: 'CatGage',
  setup() {
    const store = useStore<StoreState>()
    const progress = computed(() => {
      const score = store.state.game.scoreInLevel
      const level = getCurrentStage()
      return score / level.scoreToClear
    })

    return {
      progress
    }
  }
})
</script>

<style lang="scss" scoped>
.CatGage {
  position: absolute;
  bottom: 0;
  width: 100%;
  .bar {
    position: absolute;
    bottom: 6px;
    height: 3px;
    width: 100%;
    left: 0;
    border-radius: 10px;
    background-color: currentColor;
    transition: transform 0.3s ease;
    transform-origin: left;
  }
}
</style>
