import { reactive, toRefs } from "vue";

const state = reactive({
  alarms: [],
});

export default function useAlarms() {
  return {
    ...toRefs(state), // convert to refs when returning
  };
}
