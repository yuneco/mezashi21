<template>
  <svg style="display:none">
    <defs>
      <filter
        id="fulful-default"
        filterUnits="objectBoundingBox"
        x="0"
        y="0"
        width="105%"
        height="105%"
      >
        <!-- ノイズを生成する原始フィルター -->
        <feTurbulence
          type="turbulence"
          baseFrequency="0.2 0.2"
          numOctaves="1"
          seed="1"
          stitchTiles="stitch"
        >
          <!-- ノイズのシードを変化させる -->
        </feTurbulence>
        <!-- ノイズを元に画像を歪める -->
        <feDisplacementMap in="SourceGraphic" scale="1" />
      </filter>
    </defs>
  </svg>
  <div class="home">
    <GameStage />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import GameStage from '@/components/GameStage.vue'

export default defineComponent({
  name: 'Home',
  components: {
    GameStage
  },
  setup() {
    const filterActive = ref(false)
    const activate = () => {
      filterActive.value = true
    }

    return {
      filterActive,
      activate
    }
  }
})
</script>

<style lang="scss" scoped>
.home {
  position: inherit;
  height: 100%;
  width: 100%;
}
</style>

<style lang="scss">
.fulful {
  filter: url(#fulful-default);
}
</style>
