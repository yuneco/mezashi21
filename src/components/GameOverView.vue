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
      <div class="rankin fulful" v-show="state.showRankRegister">
        <div class="rankinMsg">{{ state.rank }}位くらいにランクインしました！</div>
        <input type="text" placeholder="なまえをいれてね" v-model="state.name" />
        <button @click="registerScore">OK</button>
      </div>
      <div class="buttons fulful">
        <button @click="back">TOP</button>
        <button @click="replay">Replay</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, watch } from 'vue'
import { State as StoreState } from '@/store'
import { useStore } from 'vuex'
import playSound from '@/logics/playSound'
import AuthApi from '@/api/AuthApi'
import RankingItem from '@/api/RankingItem'
import DocApi from '@/api/DocApi'

export default defineComponent({
  name: 'GameOverView',
  emits: ['ranking', 'back', 'replayNormal', 'replayRandom'],
  setup(_, ctx) {
    const store = useStore<StoreState>()
    const score = computed(() => store.state.game.score)
    const playState = computed(() => store.state.game.play)
    const state = reactive({
      name: '',
      showRankRegister: false,
      rank: -1
    })

    watch(
      () => playState.value,
      async () => {
        if (playState.value !== 'over') return
        const rank = await DocApi.getRank(score.value, 10, true)
        state.rank = rank
        state.showRankRegister = rank !== -1
      }
    )

    const sendResult = async (wishToAddRanking: boolean) => {
      if (store.state.game.play !== 'over') return
      const uid = AuthApi.uid
      if (!uid) {
        return
      }
      const lv = store.state.game.level
      const score = store.state.game.score
      const mode = store.state.game.isRandomLevel ? 'random' : 'normal'
      const name = state.name
      const item = new RankingItem(uid, name, score, lv, mode)
      if (wishToAddRanking) {
        await DocApi.addRanking(item)
      }
      DocApi.pushPlaylog(item)
    }

    const registerScore = () => {
      playSound('btn')
      sendResult(true)
      ctx.emit('ranking')
    }
    const replay = () => {
      playSound('btn')
      const isRandomMode = store.state.game.isRandomLevel
      sendResult(false)
      ctx.emit(isRandomMode ? 'replayRandom' : 'replayNormal')
    }
    const back = () => {
      playSound('btn')
      sendResult(false)
      ctx.emit('back')
    }

    return {
      state,
      score,
      replay,
      back,
      registerScore
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
  row-gap: 3vh;
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
    .rankin {
      padding-bottom: 3vh;
      input {
        height: 2em;
      }
    }
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
