import { reactive, toRefs } from "vue";

const state = reactive({
  alarms: [],
  dayNames: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
});

export default function useAlarms() {
  return {
    ...toRefs(state), // convert to refs when returning
  };
}
