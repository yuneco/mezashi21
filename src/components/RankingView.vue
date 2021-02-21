<template>
  <div class="RankingView fulful">
    <div class="titleBlock">
      <h1 class="titleName fulful">
        Neko Mezashi Attack
        <div class="subtitle">RANKING</div>
      </h1>
    </div>
    <div class="rankingBlock">
      <div class="rankRow header">
        <div class="col num rank">#</div>
        <div class="col name">Name</div>
        <div class="col num level">Lv</div>
        <div class="col num score">Score</div>
        <div class="col mode">Mode</div>
      </div>
      <div
        class="rankRow body"
        v-for="(item, index) in state.ranking"
        :key="item.uid + '-' + item.created"
        :style="{ animationDelay: `${index * 100}ms` }"
      >
        <div class="col num rank">{{ index + 1 }}</div>
        <div class="col name">{{ item.name }}</div>
        <div class="col num level">{{ item.level }}</div>
        <div class="col num score">{{ item.score }}</div>
        <div class="col mode">{{ item.playmode }}</div>
      </div>
    </div>
    <div class="controlBlock">
      <div class="uuttons fulful">
        <button @click="goHome">BACK</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue'
import DocApi from '@/api/DocApi'
import RankingItem from '@/api/RankingItem'
import playSound from '@/logics/playSound'

type State = {
  ranking: RankingItem[]
}

export default defineComponent({
  name: 'RankingView',
  props: {},
  emits: ['back'],
  setup(_, ctx) {
    const state = reactive<State>({
      ranking: []
    })

    const goHome = () => {
      playSound('btn')
      ctx.emit('back')
    }

    onMounted(async () => {
      const entries = await DocApi.getRanking()
      state.ranking = [...entries]
    })
    return {
      state,
      goHome
    }
  }
})
</script>

<style lang="scss" scoped>
.RankingView {
  position: absolute;
  width: 80%;
  height: 80%;
  left: 10%;
  top: 10%;
  display: grid;
  row-gap: 5vh;
  grid-template-rows: 2fr 3fr 2fr 3fr;
  grid-template-columns: 1fr;
  grid-template-areas:
    'title'
    'ranking'
    'control'
    '.';
  .titleBlock {
    grid: title;
    text-align: center;
    .titleName {
      font-size: min(5vw, 3vh);
      .subtitle {
        font-size: min(2vw, 1.5vh);
      }
    }
  }
  .rankingBlock {
    grid: ranking;
    .rankRow {
      font-weight: bold;
      display: flex;
      width: 100%;
      font-size: min(3vw, 2vh);
      &.header {
        border-bottom: 1px solid currentColor;
      }
      &.body {
        animation: slide 0.5s both;
      }
      .col {
        padding: 2px 4px;
      }
      .num {
        text-align: right;
      }
      .rank {
        width: 10%;
      }
      .name {
        width: 40%;
      }
      .level {
        width: 10%;
      }
      .score {
        width: 20%;
      }
      .mode {
        width: 20%;
      }
    }
  }
  .controlBlock {
    grid: control;
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

@keyframes slide {
  0% {
    opacity: 0;
    transform: translateX(50%);
  }
  100% {
    opacity: 1;
    transform: translateX(0%);
  }
}
</style>
