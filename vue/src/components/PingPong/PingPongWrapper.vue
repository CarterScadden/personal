<template>
  <PingPong :canvasWidth="canvasWidth" :canvasHeight="canvasHeight" />
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Vue from 'vue';
import { defineComponent } from '@vue/composition-api';
import PingPong from './PingPong.vue';
interface Props {
  canvasWidth: number
  canvasHeight: number
};

export default defineComponent<Props>({
  components: {
    PingPong,
  },
  props: {
    canvasWidth: Number,
    canvasHeight: Number,
  },
  setup() {
    return ({
  
    });
  },
});
</script>

<style lang="scss">
</style>
