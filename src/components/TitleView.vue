<template>
  <div class="TitleView">
    <div class="titleBlock">
      <h1 class="titleName fulful">
        Neko Mezashi Attack
        <div class="subtitle">ver 2021</div>
      </h1>
      <div class="description">
        ネコメザシアタックは猫にメザシを与えるゆるふわゲームです
      </div>
      <div class="howto">
        <ul>
          <li>地面をタップ ▶︎ ジャンプ → 二段ジャンプ → 緊急着地</li>
          <li>空をタップ ▶︎ めざし発射＆方向転換</li>
        </ul>
      </div>
    </div>
    <div class="controlBlock">
      <div class="startButtons fulful">
        <span class="label">START</span><br />
        <button @click="playNormal">Normal</button>
        <button @click="playRandom">Random</button>
      </div>
      <div class="rankingButtons fulful">
        <button @click="goRanking">Ranking</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { State as StoreState } from '@/store'
import { useStore } from 'vuex'
import playSound from '@/logics/playSound'

export default defineComponent({
  name: 'TitleView',
  emits: ['playNormal', 'playRandom', 'ranking'],
  setup(_, ctx) {
    const store = useStore<StoreState>()
    const playNormal = () => {
      store.commit('setInitialTap')
      playSound('btn')
      ctx.emit('playNormal')
    }
    const playRandom = () => {
      store.commit('setInitialTap')
      playSound('btn')
      ctx.emit('playRandom')
    }
    const goRanking = () => {
      store.commit('setInitialTap')
      playSound('btn')
      ctx.emit('ranking')
    }
    return {
      playNormal,
      playRandom,
      goRanking
    }
  }
})
</script>

<style lang="scss" scoped>
.TitleView {
  position: absolute;
  width: 80%;
  height: 80%;
  left: 10%;
  top: 10%;
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
    .titleName {
      font-size: min(5vw, 3vh);
      .subtitle {
        font-size: min(2vw, 1.5vh);
      }
    }
    .description {
      font-size: min(2vw, 1.5vh);
    }
    .howto {
      font-size: min(2vw, 1.5vh);
      text-align: left;
      font-weight: bold;
      ul {
        padding-left: 20px;
      }
    }
  }
  .controlBlock {
    button {
      font-size: min(4vw, 2.8vh);
      font-weight: bold;
      color: inherit;
      border: 3px solid currentColor;
      background-color: transparent;
      margin: 4px;
      border-radius: 4px;
    }
    text-align: center;
    .label {
      font-size: min(4vw, 2.5vh);
      font-weight: bold;
    }
  }
}
</style>
