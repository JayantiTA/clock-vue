<template>
  <DigitalClock />
  <AlarmClock />
</template>

<script>
import AlarmClock from "./components/AlarmClock.vue";
import DigitalClock from "./components/DigitalClock.vue";

export default {
  name: "App",
  components: {
    DigitalClock,
    AlarmClock,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
