<template>
  <div class="GameStatusView fulful">
    <div class="level">
      <span class="label">Level</span>
      <span class="value">{{ level }}</span>
    </div>
    <div class="score">
      <span class="label">Score</span>
      <span class="value">{{ score }}</span>
    </div>
    <div class="bullets">
      <div class="reloading" v-show="isReloading">RELOADING...</div>
      <div class="bulletsList" v-show="!isReloading">
        <span
          class="bullet"
          v-for="(bl, index) in ballets"
          :key="bl + index"
          :class="{ hasBullet: bl }"
          >{{ bl ? '●' : '○' }}</span
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { State as StoreState } from '@/store'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'GameStatusView',
  setup() {
    const store = useStore<StoreState>()

    const level = computed(() => store.state.game.level)
    const score = computed(() => store.state.game.score)
    const isReloading = computed(() => store.state.game.balletCount === 0)
    const ballets = computed(() => {
      return Array(6)
        .fill(false)
        .map((_, index) => index < store.state.game.balletCount)
    })

    return {
      level,
      score,
      isReloading,
      ballets
    }
  }
})
</script>

<style lang="scss" scoped>
.GameStatusView {
  position: absolute;
  pointer-events: none;
  width: 100%;
  display: grid;
  grid-template-columns: 25% 35% 40%;
  grid-template-rows: 1fr;
  grid-template-areas: 'level score bullets';
  .level {
    grid-area: level;
    padding: 5px;
    text-align: center;
  }
  .score {
    grid-area: score;
    padding: 5px;
    text-align: center;
  }
  .bullets {
    grid-area: bullets;
    padding: 5px;
    .reloading {
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: center;
    }
    .bulletsList {
      display: flex;
      height: 100%;
      width: 95%;
    }
    .bullet {
      display: block;
      flex-grow: 1;
      font-size: 0;
      background-color: currentColor;
      mask-image: url(/imgs/NoBullet.svg);
      mask-repeat: no-repeat;
      mask-size: contain;
      mask-position: center;
      &.hasBullet {
        mask-image: url(/imgs/Bullet.svg);
      }
    }
  }
  .label {
    font-size: min(3vw, 2vh);
    padding-right: 1vw;
  }
  .value {
    font-size: min(5vw, 3vh);
  }
}
</style>
