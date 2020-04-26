import { ref } from '@vue/composition-api';
import { useRef } from '../../types/useTypes';

export const useOnline: useRef<boolean> = (b) => {
  const online = ref(b !== undefined ? b : false);
  const setOnline = (b: boolean) => { online.value = b; };
  return [online, setOnline];
};
