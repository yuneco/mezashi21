<template>
  <div class="LoadGage fulful">
    <div class="cap">{{ Math.ceil(progress) + '%' }}</div>
    <div class="bar" :style="{ transform: `scaleX(${progress / 100})` }"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'LoadGage',
  props: {
    progress: { type: Number, default: 0 }
  }
})
</script>

<style lang="scss" scoped>
.LoadGage {
  position: absolute;
  bottom: 0;
  width: 100%;
  .cap {
    position: absolute;
    bottom: 16px;
    width: 100%;
    text-align: center;
  }
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
