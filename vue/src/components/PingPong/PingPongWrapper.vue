<template>
  <Flex style="flex-direction: column;">
    <Flex style="max-width: fit-content; margin: 0em 0em 0.5em 0em;">
      <v-btn 
        style="width: fit-content;"
        @click="toggleOnline"
        :style="online ? 'background-color: green;' : ''"
        :disabled="gaming"
      >Go Online</v-btn>
    </Flex>
    <PingPong 
      :online="online"
      
      :gaming="gaming"
      @toggle-gaming-on="setGaming(true)"
      @toggle-gaming-off="setGaming(false)"
      @toggle-online-off="toggleOnline"
    />
  </Flex>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Vue from 'vue';
import { defineComponent } from '@vue/composition-api';
import PingPong from './PingPong.vue';
import Flex from '../Flex/Flex.vue';

import { useOnline } from './useOnline';
import { useGaming } from './useGaming';

interface Props {
};

export default defineComponent<Props>({
  components: {
    Flex,
    PingPong,
  },
  props: {
  },
  setup() {
    const [online, setOnline] = useOnline(false);
    const toggleOnline = () => {
      if (online.value) {
        setOnline(false);
        return;
      }

      setOnline(true);
    };

    const [gaming, setGaming] = useGaming();

    return ({
      online,
      toggleOnline,

      gaming,
      setGaming,
    });
  },
});
</script>

<style lang="scss">
</style>
