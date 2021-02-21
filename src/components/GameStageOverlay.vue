<template>
  <div class="GameStageOverlay" :style="style">
    <slot></slot>
    <div class="borderLine fulful" :style="borderStyle"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { State as StoreState } from '@/store'
import { useStore } from 'vuex'
import { num2cssColor } from '@/utils/colorUtil'

export default defineComponent({
  name: 'GameStageOverlay',
  props: {
    clickable: {
      type: Boolean,
      default: false
    },
    blured: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const store = useStore<StoreState>()
    const style = computed(() => ({
      color: num2cssColor(store.state.appcolor.border),
      left: `calc(50% - ${store.state.stageSetting.width / 2}px)`,
      top: `calc(50% - ${store.state.stageSetting.height / 2}px)`,
      width: store.state.stageSetting.width + 'px',
      height: store.state.stageSetting.height + 'px',
      pointerEvents: props.clickable ? 'auto' : 'none',
      backdropFilter: props.blured ? 'blur(8px)' : 'blur(0)'
    }))

    const borderStyle = computed(() => ({
      borderColor: num2cssColor(store.state.appcolor.border)
    }))

    return {
      style,
      borderStyle
    }
  }
})
</script>

<style lang="scss" scoped>
.GameStageOverlay {
  position: absolute;
  transition: backdrop-filter 0.5s 0.3s;
  .borderLine {
    position: absolute;
    pointer-events: none;
    width: calc(100% + 8px);
    height: calc(100% + 8px);
    top: -4px;
    left: -4px;
    border: 8px solid transparent;
  }
}
</style>
