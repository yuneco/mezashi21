<template>
  <div class="CenterMsg fulful">
    <div class="msg">
      <span
        class="letter"
        v-for="(letter, index) in letters"
        :key="`${state.msg}-${index}`"
        :style="{
          color: letterColor,
          animationDelay: index * 200 + 'ms'
        }"
        >{{ letter }}</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, watch } from 'vue'
import { State as StoreState } from '@/store'
import { useStore } from 'vuex'
import { num2cssColor } from '@/utils/colorUtil'
import { sleep } from '@/utils/sleep'

export default defineComponent({
  name: 'CenterMsg',
  setup() {
    const store = useStore<StoreState>()
    const state = reactive({
      msg: ''
    })

    const letterColor = computed(() => num2cssColor(store.state.appcolor.border))
    const gameState = computed(() => store.state.game.play)
    const gameLevel = computed(() => store.state.game.level)
    watch(
      () => gameState.value,
      () => {
        const st = gameState.value
        const isFirstLv = gameLevel.value === store.state.game.startLevel
        if (st === 'playing' && isFirstLv) state.msg = 'START!'
        if (st === 'over') state.msg = 'GAME OVER'
      }
    )
    watch(
      () => gameLevel.value,
      async () => {
        if (gameLevel.value === store.state.game.startLevel) return
        state.msg = 'LEVEL UP!'
        await sleep(3000)
        state.msg = ''
      }
    )

    const letters = computed(() => state.msg.split(''))
    return {
      state,
      letters,
      letterColor
    }
  }
})
</script>

<style lang="scss" scoped>
.CenterMsg {
  position: absolute;
  pointer-events: none;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: min(8vw, 5vh);
  font-weight: bold;
  letter-spacing: 0.2em;
  padding-left: 0.2em;
  .msg {
    position: relative;
    top: -20%;
    .letter {
      display: inline-block;
      animation: slidein 1s ease 0s 1 both;
    }
  }

  @keyframes slidein {
    0% {
      transform: translate(0, 10vh);
    }
    60% {
      transform: translate(0, 0);
    }
    90% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
}
</style>
