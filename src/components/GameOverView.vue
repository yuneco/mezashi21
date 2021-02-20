<template>
  <div class="GameOverView">
    <div class="titleBlock">
      <div class="title fulful">
        GAME OVER
      </div>
      <div class="result fulful">
        <span class="text">あなたは</span>
        <span class="score">{{ score }}<span class="suffix">ひきの</span></span
        ><br />
        <span class="text">ネコにメザシをあたえました！</span>
      </div>
    </div>
    <div class="controlBlock">
      <div class="buttons fulful">
        <button @click="back">TOP</button>
        <button @click="replay">Replay</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { State as StoreState } from '@/store'
import { useStore } from 'vuex'
import playSound from '@/logics/playSound'

export default defineComponent({
  name: 'GameOverView',
  emits: ['back', 'replayNormal', 'replayRandom'],
  setup(_, ctx) {
    const store = useStore<StoreState>()

    const score = computed(() => store.state.game.score)

    const replay = () => {
      playSound('btn')
      const isRandomMode = store.state.game.isRandomLevel
      ctx.emit(isRandomMode ? 'replayRandom' : 'replayNormal')
    }
    const back = () => {
      playSound('btn')
      ctx.emit('back')
    }
    return {
      score,
      replay,
      back
    }
  }
})
</script>

<style lang="scss" scoped>
.GameOverView {
  position: absolute;
  width: 80%;
  height: 80%;
  left: 10%;
  top: 20%;
  animation: slide 2s ease-in-out 1.5s 1 both;
  display: grid;
  row-gap: 5vh;
  grid-template-rows: 3fr 3fr 3fr;
  grid-template-columns: 1fr;
  grid-template-areas:
    'title'
    'control';
  .titleBlock {
    grid: title;
    text-align: center;
    font-weight: bold;
    .title {
      font-size: min(5vw, 3vh);
    }
    .result {
      .text {
        font-size: min(4vw, 3vh);
      }
      .suffix {
        font-size: min(4vw, 3vh);
      }
      .score {
        font-size: min(12vw, 7vh);
      }
    }
  }
  .controlBlock {
    button {
      font-size: min(4vw, 3vh);
      font-weight: bold;
      border: 3px solid currentColor;
      background-color: transparent;
      margin: 4px;
      border-radius: 4px;
      color: inherit;
    }
    text-align: center;
  }
}

@keyframes slide {
  from {
    transform: translateY(50%);
    opacity: 0;
  }
  to {
    transform: translateY(0%);
    opacity: 1;
  }
}
</style>
