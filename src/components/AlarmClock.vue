<script>
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import useAlarms from "../store/alarms";

export default {
  name: "AlarmClock",
  data() {
    return {
      tempAlarm: null,
      tempUpdateAlarm: null,
      selectedIndex: -1,
      ...useAlarms(),
    };
  },
  methods: {
    setAlarm() {
      for (let alarm in this.alarms) {
        if (this.alarms[alarm].time === this.tempAlarm) {
          this.showToast();
          return;
        }
      }
      this.alarms.push({
        time: this.tempAlarm,
        status: "active",
        isRinging: false,
      });
      localStorage.setItem("alarms", JSON.stringify(this.alarms));
    },
    editAlarm(index) {
      this.selectedIndex = index;
      this.tempUpdateAlarm = this.alarms[index].time;
    },
    updateAlarm() {
      for (let alarm in this.alarms) {
        if (this.alarms[alarm].time === this.tempUpdateAlarm) {
          this.showToast();
          return;
        }
      }
      this.alarms[this.selectedIndex].time = this.tempUpdateAlarm;
      localStorage.setItem("alarms", JSON.stringify(this.alarms));
      this.selectedIndex = -1;
    },
    cancelUpdate() {
      this.selectedIndex = -1;
    },
    removeAlarm(index) {
      this.alarms.splice(index, 1);
      localStorage.setItem("alarms", JSON.stringify(this.alarms));
    },
    changeStatus(index) {
      this.alarms[index].status =
        this.alarms[index].status === "active" ? "inactive" : "active";
      localStorage.setItem("alarms", JSON.stringify(this.alarms));
    },
    stopRinging(index) {
      this.alarms[index].isRinging = false;
      localStorage.setItem("alarms", JSON.stringify(this.alarms));
    },
    showToast() {
      Toastify({
        text: `Alarm is already exists`,
        duration: 6000,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #b13021, #f88c2b)",
          fontFamily: "Poppins",
          borderRadius: "10px",
        },
        onClick: function () {}, // Callback after click
      }).showToast();
    },
  },
};
</script>

<template>
  <div class="alarm-container">
    <h2>alarm</h2>
    <form class="input-alarm" @submit="setAlarm">
      <input type="time" v-model="tempAlarm" required />
      <v-btn type="submit" class="mx-2" fab dark color="indigo">
        <v-icon dark> mdi-plus </v-icon>
      </v-btn>
    </form>
    <div class="alarm-form"></div>
  </div>
  <li v-for="(alarm, index) in alarms" :key="index">
    <div class="alarm-card">
      <ul>
        <li>
          <label class="switch">
            <input
              type="checkbox"
              :checked="alarm.status === 'active'"
              @change="
                (event) => {
                  changeStatus(index, event.target.checked);
                }
              "
            />
            <span class="slider round"></span>
          </label>
        </li>
        <li>
          <input
            type="time"
            v-model="tempUpdateAlarm"
            required
            v-if="index === this.selectedIndex"
          />
          <p v-else>{{ alarm.time }}</p>
        </li>
        <li>
          <div v-if="alarm.isRinging === true">
            <v-btn
              class="mx-9 my-7"
              fab
              dark
              color="indigo"
              @click="stopRinging(index)"
            >
              <v-icon dark> mdi-close </v-icon>
              turn off
            </v-btn>
          </div>
          <div v-else>
            <div v-if="index === this.selectedIndex">
              <v-btn
                class="mx-4 my-7"
                fab
                dark
                color="indigo"
                @click="updateAlarm"
              >
                <v-icon dark> mdi-check </v-icon>
              </v-btn>
              <v-btn
                class="mx-2 my-7"
                fab
                dark
                color="grey"
                @click="cancelUpdate"
              >
                <v-icon dark> mdi-cancel </v-icon>
              </v-btn>
            </div>
            <div v-else>
              <v-btn
                class="mx-4 my-7"
                fab
                dark
                color="warning"
                @click="editAlarm(index)"
              >
                <v-icon dark> mdi-pencil </v-icon>
                edit
              </v-btn>
              <v-btn
                class="mx-2 my-7"
                fab
                dark
                color="error"
                @click="removeAlarm(index)"
              >
                <v-icon dark> mdi-delete </v-icon>
                delete
              </v-btn>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </li>
</template>

<style>
/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  margin: 30px 25px;
}
/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}
.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}
input:checked + .slider {
  background-color: #7155d3;
}
input:focus + .slider {
  box-shadow: 0 0 1px #7155d3;
}
input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}
/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}
.slider.round:before {
  border-radius: 50%;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
}

h2 {
  color: #f2d096;
  font-size: 40px;
  margin: 0;
  font-family: "Poppins";
}

.input-alarm {
  margin: 0 0 15px 15px;
}

input[type="time"] {
  font-family: "Poppins", sans-serif;
  font-size: 20px;
  border-radius: 15px;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
  width: 250px;
  background-color: #ffffff;
  padding: 6px;
  margin-top: 0px;
}

input[type="time"]::-webkit-datetime-edit-fields-wrapper {
  display: flex;
}

/* The space between the fields - between hour and minute, the minute and
      second, second and am/pm */
input[type="time"]::-webkit-datetime-edit-text {
  padding: 6px 4px;
}

/* The naming convention for the hour, minute, second, and am/pm field is
      `-webkit-datetime-edit-{field}-field` */

/* Hour */
input[type="time"]::-webkit-datetime-edit-hour-field {
  background-color: #f2f4f5;
  border-radius: 15%;
  padding: 6px 13px;
}

/* Minute */
input[type="time"]::-webkit-datetime-edit-minute-field {
  background-color: #f2f4f5;
  border-radius: 15%;
  padding: 6px 13px;
}

/* AM/PM */
input[type="time"]::-webkit-datetime-edit-ampm-field {
  background-color: #7155d3;
  border-radius: 15%;
  color: #fff;
  padding: 6px 13px;
  font-size: 40px;
}

li {
  list-style-type: none;
}

p {
  margin: 10px 25px;
}

.alarm-container {
  background-color: rgba(0, 0, 0, 0.5);
  margin: 30px 0px 0px 0px;
  border-radius: 30px;
}

.alarm-card {
  position: relative;
  background-color: rgb(241, 232, 232);
  border-radius: 25px;
  color: #202229;
  font-size: 50px;
  font-weight: bold;
  margin: 10px;
  width: 550px;
  height: 90px;
}
</style>
