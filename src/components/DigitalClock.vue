<script>
export default {
  name: "DigitalClock",
  data() {
    return {
      years: 0,
      months: "",
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      alarms: [],
      audio: new Audio(process.env.BASE_URL + "alarm.wav"),
      monthNames: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    };
  },
  beforeMount() {
    this.setTime();
  },
  mounted() {
    this.alarms = localStorage.getItem("alarms")
      ? JSON.parse(localStorage.getItem("alarms"))
      : [];
    setInterval(() => this.setTime(), 1000);
  },
  updated() {
    this.alarms = localStorage.getItem("alarms")
      ? JSON.parse(localStorage.getItem("alarms"))
      : [];
  },
  methods: {
    setTime() {
      const date = new Date();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      let days = date.getDate();
      let months = date.getMonth();
      let years = date.getFullYear();
      this.hours = hours <= 9 ? `${hours}`.padStart(2, 0) : hours;
      this.minutes = minutes <= 9 ? `${minutes}`.padStart(2, 0) : minutes;
      this.seconds = seconds <= 9 ? `${seconds}`.padStart(2, 0) : seconds;
      this.days = days <= 9 ? `${days}`.padStart(2, 0) : days;
      this.months = this.monthNames[months];
      this.years = years;
      for (let i = 0; i < this.alarms.length; ++i) {
        if (
          this.alarms[i].status === "active" &&
          this.alarms[i].time === `${this.hours}:${this.minutes}`
        ) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      }
    },
  },
};
</script>

<template>
  <div class="container">
    <h2 class="title">Digital Clock</h2>
    <div class="time-card">
      <h1 class="time">{{ hours }} : {{ minutes }} : {{ seconds }}</h1>
    </div>
    <h2 class="date">{{ months }} {{ days }}, {{ years }}</h2>
  </div>
</template>

<style scoped>
h1 {
  font-size: 100px;
  font-weight: bold;
  margin: auto;
}
h2 {
  font-size: 50px;
  margin: auto;
}
.title {
  color: #b2e7e8;
  margin: 30px;
}
.time {
  color: #304d63;
}
.date {
  font-family: "Dancing Script", cursive;
  color: #f2d096;
}
.container {
  margin-top: 5vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.time-card {
  background: #f2d096;
  border-radius: 30px;
  width: 550px;
  margin: 10px;
}
</style>
