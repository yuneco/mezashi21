<template>
  <div class="home">
    <GameStage />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GameStage from "@/components/GameStage.vue"; // @ is an alias to /src

export default defineComponent({
  name: "Home",
  components: {
    GameStage
  }
});
</script>
