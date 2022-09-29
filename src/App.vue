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
@import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&family=Poppins:wght@400;500;600;700&family=Roboto:wght@900&display=swap");

#app {
  /* font-family: "Poppins", sans-serif; */
  font-family: "Roboto", sans-serif;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
body {
  height: 100vh;
  /* background-color: #304d63 !important; */
  background: url("../public/background.jpg") no-repeat center center fixed;
}
</style>
