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
  sounds: {
    default: new Audio(process.env.BASE_URL + "alarm.wav"),
    "clock short": new Audio(process.env.BASE_URL + "alarm-clock-short.mp3"),
    "morning joy": new Audio(process.env.BASE_URL + "morning-joy-alarm.mp3"),
    oversimplified: new Audio(
      process.env.BASE_URL + "oversimplified-alarm.mp3"
    ),
  },
});

export default function useAlarms() {
  return {
    ...toRefs(state), // convert to refs when returning
  };
}
