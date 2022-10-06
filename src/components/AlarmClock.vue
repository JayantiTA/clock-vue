<script>
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import useAlarms from "../store/alarms";

export default {
  name: "AlarmClock",
  data() {
    return {
      tempName: null,
      tempAlarm: null,
      tempDays: [],
      tempSound: null,
      tempUpdateName: null,
      tempUpdateAlarm: null,
      tempUpdateDay: null,
      tempUpdateSound: null,
      selectedIndex: -1,
      edited: false,
      dialog: false,
      ringDialog: false,
      playSound: false,
      ...useAlarms(),
    };
  },
  methods: {
    setAlarm() {
      for (let alarm in this.alarms) {
        if (
          this.alarms[alarm].time === this.tempAlarm &&
          this.alarms[alarm].name === this.tempName &&
          this.alarms[alarm].days === this.tempDays
        ) {
          this.showToast("Alarm is already exists");
          return;
        }
      }
      this.alarms.push({
        days: this.tempDays.sort(),
        name: this.tempName,
        time: this.tempAlarm,
        status: "active",
        isRinging: false,
        snooze: 0,
        sound: this.tempSound,
      });
      console.log(this.alarms);
      localStorage.setItem("alarms", JSON.stringify(this.alarms));
      this.dialog = false;
    },
    editAlarm(index) {
      this.edited = true;
      console.log(Object.values(this.alarms[index].days).includes("Monday"));
      this.selectedIndex = index;
      this.tempUpdateAlarm = this.alarms[index].time;
      this.tempUpdateName = this.alarms[index].name;
      this.tempUpdateDay = this.alarms[index].days;
      this.tempUpdateSound = this.alarms[index].sound;
      this.dialog = true;
    },
    updateAlarm() {
      for (let alarm in this.alarms) {
        if (
          this.alarms[alarm].time === this.tempUpdateAlarm &&
          this.alarms[alarm].name === this.tempUpdateName &&
          this.alarms[alarm].days === this.tempUpdateDay
        ) {
          this.showToast("Alarm is already exists");
          return;
        }
      }
      this.alarms[this.selectedIndex].time = this.tempUpdateAlarm;
      this.alarms[this.selectedIndex].name = this.tempUpdateName;
      this.alarms[this.selectedIndex].days = this.tempUpdateDay;
      this.alarms[this.selectedIndex].sound = this.tempUpdateSound;
      this.alarms.snooze = 0;
      localStorage.setItem("alarms", JSON.stringify(this.alarms));
      this.selectedIndex = -1;
      this.dialog = false;
    },
    cancelUpdate() {
      this.dialog = false;
      this.edited = false;
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
    snoozeAlarm(index) {
      this.alarms[index].isRinging = false;
      this.alarms[index].snooze += 5;
      console.log(this.alarms[index].snooze);
      localStorage.setItem("alarms", JSON.stringify(this.alarms));
    },
    stopRinging(index) {
      this.alarms[index].isRinging = false;
      this.alarms[index].snooze = 0;
      localStorage.setItem("alarms", JSON.stringify(this.alarms));
    },
    showForm() {
      this.dialog = true;
    },
    testSound() {
      if (this.tempSound === null && this.tempUpdateSound === null) {
        this.showToast("Please select sound first!");
        return;
      }
      if (this.edited) {
        this.sounds[this.tempUpdateSound].play();
      } else {
        this.sounds[this.tempSound].play();
      }
      this.playSound = true;
    },
    stopSound() {
      if (this.edited) {
        this.sounds[this.tempUpdateSound].pause();
      } else {
        this.sounds[this.tempSound].pause();
      }
      this.playSound = false;
    },
    showToast(message) {
      Toastify({
        text: `${message}`,
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
  <v-btn class="mx-2 my-7" fab dark color="indigo" @click="showForm()">
    new alarm
  </v-btn>
  <v-dialog v-model="dialog" width="500">
    <v-card>
      <v-card-title primary-title> alarm </v-card-title>
      <v-card-text class="pa-5">
        <form @submit="setAlarm">
          <v-text-field
            v-model="$data[edited ? 'tempUpdateName' : 'tempName']"
            label="Name"
            color="primary"
            outlined
            required
          ></v-text-field>
          <input
            type="time"
            v-model="$data[edited ? 'tempUpdateAlarm' : 'tempAlarm']"
            required
          />
          <v-combobox
            v-model="$data[edited ? 'tempUpdateDay' : 'tempDays']"
            :items="dayNames"
            label="Day"
            multiple
            outlined
            dense
            color="primary"
          ></v-combobox>
          <v-select
            v-model="$data[edited ? 'tempUpdateSound' : 'tempSound']"
            :items="Object.keys(sounds)"
            :error-messages="selectErrors"
            label="Sound"
            required
          ></v-select>
          <v-btn
            v-if="!playSound"
            class="mx-15"
            fab
            dark
            color="indigo"
            @click="testSound()"
          >
            <v-icon dark> mdi-bell-ring </v-icon>
            play
          </v-btn>
          <v-btn
            v-else
            class="mx-15"
            fab
            dark
            color="blue-grey"
            @click="stopSound()"
          >
            <v-icon dark> mdi-bell-ring </v-icon>
            stop
          </v-btn>
          <v-btn @click="cancelUpdate()" class="mx-4" fab dark color="grey">
            cancel
          </v-btn>
          <v-btn
            v-if="!edited"
            type="submit"
            class="mx-2"
            fab
            dark
            color="success"
          >
            save
          </v-btn>
          <v-btn
            v-else
            @click="updateAlarm"
            class="mx-2"
            fab
            dark
            color="warning"
          >
            update
          </v-btn>
        </form>
      </v-card-text>
    </v-card>
  </v-dialog>
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
        <li class="alarm-text">
          <p class="alarm-day" v-for="(day, idx) in alarm.days" :key="idx">
            {{ day }}
          </p>
          <p class="alarm-name">{{ alarm.name }}</p>
          <p class="alarm-time">{{ alarm.time }}</p>
        </li>
        <li>
          <div v-if="alarm.isRinging === true">
            <v-btn
              class="mx-4 my-11"
              fab
              dark
              color="grey"
              @click="snoozeAlarm(index)"
            >
              <v-icon dark> mdi-bell-sleep </v-icon>
              snooze
            </v-btn>
            <v-btn
              class="mx-4 my-11"
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
            <v-btn
              class="mx-8 my-11"
              fab
              dark
              color="warning"
              @click="editAlarm(index)"
            >
              <v-icon dark> mdi-pencil </v-icon>
              edit
            </v-btn>
            <v-btn
              class="mx-2 my-11"
              fab
              dark
              color="error"
              @click="removeAlarm(index)"
            >
              <v-icon dark> mdi-delete </v-icon>
              delete
            </v-btn>
          </div>
        </li>
      </ul>
    </div>
  </li>
</template>

<style>
.alarm-time {
  margin: 0px;
  font-size: 50px;
}

.alarm-name {
  margin: 0px;
  font-size: 18px;
  background: #7155d3;
  color: #ffffff;
  border-radius: 5px;
}

.alarm-day {
  padding: 0px;
  font-size: 12px;
  background: #a78362;
  color: #ffffff;
  border-radius: 5px;
  display: inline;
}

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  margin: 45px 25px;
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

v-card-title {
  font-family: "Poppins", sans-serif;
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
  margin: 0px 20px 20px 20px;
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

.alarm-card {
  position: relative;
  background-color: rgb(241, 232, 232);
  border-radius: 25px;
  color: #202229;
  font-weight: bold;
  margin: 0px 0px 30px 0px;
  max-width: 1200px;
  height: 120px;
}
</style>
