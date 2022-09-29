<script>
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import useAlarms from "../store/alarms"

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
          console.log("Alarm already exists");
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
          console.log("Alarm already exists");
          return;
        }
      }
      this.alarms[this.selectedIndex].time = this.tempUpdateAlarm;
      console.log(this.alarms[this.selectedIndex].isRinging);
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
          background: "linear-gradient(to right, #00b09b, #96c93d)",
          fontFamily: "Poppins",
        },
        onClick: function () {}, // Callback after click
      }).showToast();
    },
  },
};
</script>

<template>
  <div class="alarm-container">
    <h2>Alarm</h2>
    <div class="alarm-form">
      <input class="input-alarm" type="time" v-model="tempAlarm" required />
      <v-btn class="mx-2" fab dark color="indigo" @click="setAlarm">
        <v-icon dark> mdi-plus </v-icon>
      </v-btn>
    </div>
  </div>
  <li v-for="(alarm, index) in alarms" :key="index">
    <div class="alarm-card">
      <ul>
        <li>
          <v-switch
            v-model="status"
            inset
            input-value="alarm.status === 'active'"
            @change="
              (event) => {
                changeStatus(index);
              }
            "
          ></v-switch>
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
              class="mx-2"
              fab
              dark
              color="indigo"
              @click="stopRinging(index)"
            >
              <v-icon dark> mdi-close </v-icon>
            </v-btn>
          </div>
          <div v-else>
            <div v-if="index === this.selectedIndex">
              <v-btn class="mx-2" fab dark color="indigo" @click="updateAlarm">
                <v-icon dark> mdi-check </v-icon>
              </v-btn>
              <v-btn class="mx-2" fab dark color="grey" @click="cancelUpdate">
                <v-icon dark> mdi-cancel </v-icon>
              </v-btn>
            </div>
            <div v-else>
              <v-btn
                class="mx-2"
                fab
                dark
                color="warning"
                @click="editAlarm(index)"
              >
                <v-icon dark> mdi-pencil </v-icon>
                edit
              </v-btn>
              <v-btn
                class="mx-2"
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
  margin: 10px;
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

button {
  font-family: "Poppins", sans-serif;
  border-radius: 10px;
  padding: 6px 12px;
  margin: 10px;
  cursor: pointer;
  color: #111e28;
  font-size: 20px;
  max-height: 50px;
}

li {
  list-style-type: none;
  padding: 10px;
}

p {
  margin: auto;
  padding: auto;
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
