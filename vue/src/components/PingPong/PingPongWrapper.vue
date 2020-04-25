<template>
  <PingPong />
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Vue from 'vue';
import { defineComponent } from '@vue/composition-api';
import PingPong from './PingPong.vue';
interface Props {
};

export default defineComponent<Props>({
  components: {
    PingPong,
  },
  props: {
  },
  setup() {
    return ({
  
    });
  },
});
</script>

<style lang="scss">
</style>
