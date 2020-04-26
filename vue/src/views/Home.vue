<template>
  <div id="home">
    <PingPongWrapper />
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Vue from 'vue';
import { defineComponent } from '@vue/composition-api';
import PingPongWrapper from '../components/PingPong/PingPongWrapper.vue';
interface Props {
  
};

export default defineComponent<Props>({
  components: {
    PingPongWrapper,
  },
  props: {
    
  },
  setup() {
    return ({

    });
  },
});
</script>

<style lang="scss" scoped>
</style>
