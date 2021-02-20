<template>
  <!-- 手描き感のあるラフな表現を加えるフィルターの定義 -->
  <filter
    v-if="active"
    :id="filterId"
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
      numOctaves="5"
      seed="1"
      stitchTiles="stitch"
    >
      <!-- ノイズのシードを変化させる -->
    </feTurbulence>
    <!-- ノイズを元に画像を歪める -->
    <feDisplacementMap in="SourceGraphic" :scale="scale" />
  </filter>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    active: { type: Boolean, default: false },
    filterId: { type: String, required: true },
    animated: { type: Boolean, default: false },
    noiseSeed: { type: Number, default: 1 },
    frequency: { type: Number, default: 0.1 },
    octaves: { type: Number, default: 5 },
    scale: { type: Number, default: 10 },
    areaW: { type: String, default: '105%' },
    areaH: { type: String, default: '105%' },
    filterUnits: { type: String, default: 'objectBoundingBox' }
  },
  setup() {
    return {}
  }
})
</script>

<style lang="scss" scoped></style>
