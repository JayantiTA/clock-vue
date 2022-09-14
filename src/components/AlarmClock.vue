<script>
export default {
  name: "AlarmClock",
  data() {
    return {
      tempAlarm: null,
      alarms: [],
    };
  },
  mounted() {
    if (localStorage.alarms) {
      this.alarms = localStorage.alarms.split(",");
    }
  },
  methods: {
    setAlarm() {
      this.alarms.push(this.tempAlarm);
      localStorage.alarms = this.alarms;

      console.log(this.alarms);
    },
    removeAlarm(index) {
      this.alarms.splice(index, 1);
      localStorage.alarms = this.alarms;
    },
  },
};
</script>

<template>
  <h2>Alarm</h2>
  <form @submit="setAlarm">
    <input type="time" v-model="tempAlarm" required />
    <button type="submit">add alarm</button>
  </form>
  <h4>List Alarms</h4>
  <li v-for="(alarm, index) in alarms" :key="index">
    {{ alarm }}
    <button>edit alarm</button>
    <button @click="removeAlarm(index)">remove alarm</button>
  </li>
</template>
