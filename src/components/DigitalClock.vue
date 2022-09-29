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
      audio: new Audio(process.env.BASE_URL + "alarm.wav"),
      lastAlarm: null,
      dayNames: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
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
  updated() {
    this.lastAlarm = localStorage.getItem("lastAlarm")
      ? JSON.parse(localStorage.getItem("lastAlarm"))
      : null;
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
      for (let i = 0; i < this.alarms.length; ++i) {
        if (
          this.alarms[i].status === "active" &&
          this.alarms[i].time === `${this.hours}:${this.minutes}`
        ) {
          if (this.lastAlarm !== this.alarms[i].time) {
            this.showToast();
            this.alarms[i].isRinging = true;
            localStorage.setItem("alarms", JSON.stringify(this.alarms));
            this.lastAlarm = this.alarms[i].time;
            localStorage.setItem("lastAlarm", JSON.stringify(this.lastAlarm));
          } else {
            if (this.alarms[i].isRinging) {
              this.audio.play();
              return;
            } else {
              this.audio.pause();
              this.audio.currentTime = 0;
            }
          }
        } else {
          this.audio.pause();
          this.audio.currentTime = 0;
        }
      }
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
          background: "linear-gradient(to right, #00b09b, #96c93d)",
          fontFamily: "Poppins",
        },
        onClick: function () {
          this.audio.pause();
          this.audio.currentTime = 0;
        },
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
  padding: 25px;
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
