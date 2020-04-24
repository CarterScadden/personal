<template>
  <div id="home">
    <PingPongWrapper 
      :canvasWidth="canvasWidth"
      :canvasHeight="canvasHeight"
    />
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
    const canvasWidth = 600;
    const canvasHeight = 300;
    return ({
      canvasWidth,
      canvasHeight,
    });
  },
});
</script>

<style lang="scss" scoped>
#home {
  width: 300px;
  height: 300px;
  background-color: #fff;
}
</style>
