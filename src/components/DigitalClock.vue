<script>
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import useAlarms from "../store/alarms";

export default {
  name: "DigitalClock",
  data() {
    return {
      years: 0,
      months: "",
      day: null,
      dates: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      ...useAlarms(),
      lastAlarm: null,
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
    this.lastAlarm = localStorage.getItem("lastAlarm")
      ? JSON.parse(localStorage.getItem("lastAlarm"))
      : null;
    this.alarms = localStorage.getItem("alarms")
      ? JSON.parse(localStorage.getItem("alarms"))
      : [];
    setInterval(() => this.setTime(), 1000);
  },
  methods: {
    setTime() {
      const date = new Date();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      let dates = date.getDate();
      let months = date.getMonth();
      let years = date.getFullYear();
      let day = date.getDay();
      this.hours = hours <= 9 ? `${hours}`.padStart(2, 0) : hours;
      this.minutes = minutes <= 9 ? `${minutes}`.padStart(2, 0) : minutes;
      this.seconds = seconds <= 9 ? `${seconds}`.padStart(2, 0) : seconds;
      this.dates = dates;
      this.months = this.monthNames[months];
      this.years = years;
      this.day = this.dayNames[day];
      this.checkAlarm();
    },
    checkAlarm() {
      let time = `${this.hours}:${this.minutes}`;
      for (let i = 0; i < this.alarms.length; ++i) {
        if (this.alarms[i].status === "active") {
          let check = this.alarms[i].time === time;
          check |=
            this.alarms[i].snooze &&
            this.timeSnoozedAlarm(this.alarms[i]) === time;
          check &= Object.values(this.alarms[i].days).includes(this.day);
          check &= this.lastAlarm !== this.alarms[i].time;
          if (check) {
            this.showToast();
            this.alarms[i].isRinging = true;
            localStorage.setItem("alarms", JSON.stringify(this.alarms));
            this.lastAlarm = this.alarms[i].time;
            localStorage.setItem("lastAlarm", JSON.stringify(this.lastAlarm));
          }
        } else {
          this.alarms[i].isRinging = false;
          this.stopRinging();
        }
        if (this.alarms[i].isRinging) {
          this.startRinging();
          return;
        } else {
          this.stopRinging();
        }
      }
    },
    timeSnoozedAlarm(alarm) {
      let hours = parseInt(alarm.time.split(":")[0]);
      let minutes = parseInt(alarm.time.split(":")[1]) + alarm.snooze;
      if (minutes >= 60) {
        hours += 1;
        minutes -= 60;
      }
      if (hours >= 24) {
        hours -= 24;
      }
      return `${hours <= 9 ? `${hours}`.padStart(2, 0) : hours}:${
        minutes <= 9 ? `${minutes}`.padStart(2, 0) : minutes
      }`;
    },
    startRinging() {
      this.audio.play();
    },
    stopRinging() {
      this.audio.pause();
      this.audio.currentTime = 0;
    },
    showToast() {
      Toastify({
        text: `It is ${this.hours}:${this.minutes}`,
        duration: 30000,
        newWindow: false,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #241b15, #725bd3)",
          fontFamily: "Poppins",
          borderRadius: "10px",
        },
        onClick: function () {},
      }).showToast();
    },
  },
};
</script>

<template>
  <div class="container">
    <h1 class="date">{{ day }}</h1>
    <div class="time-card">
      <h1 class="time">{{ hours }} : {{ minutes }} : {{ seconds }}</h1>
    </div>
    <h2 class="date">{{ months }} {{ dates }}, {{ years }}</h2>
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
  color: #202229;
}
.date {
  font-family: "Dancing Script", cursive;
  color: #f2d096;
}
.container {
  padding: 20px;
  border-radius: 40px;
  max-width: fit-content;
  background-color: rgba(0, 0, 0, 0.5);
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
