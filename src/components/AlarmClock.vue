<script>
export default {
  name: "AlarmClock",
  data() {
    return {
      tempAlarm: null,
      tempUpdateAlarm: null,
      selectedIndex: -1,
      alarms: [],
    };
  },
  mounted() {
    this.alarms = localStorage.getItem("alarms")
      ? JSON.parse(localStorage.getItem("alarms"))
      : [];
  },
  methods: {
    setAlarm() {
      this.alarms.push(this.tempAlarm);
      localStorage.setItem("alarms", JSON.stringify(this.alarms));
    },
    editAlarm(index) {
      this.selectedIndex = index;
      this.tempUpdateAlarm = this.alarms[index];
    },
    updateAlarm() {
      this.alarms.splice(this.selectedIndex, 1, this.tempUpdateAlarm);
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
  },
};
</script>

<template>
  <h2>Alarm</h2>
  <form @submit="setAlarm">
    <input type="time" v-model="tempAlarm" required />
    <button class="add-button" type="submit">add alarm</button>
  </form>
  <li v-for="(alarm, index) in alarms" :key="index">
    <div class="alarm-card">
      <input
        type="time"
        v-model="tempUpdateAlarm"
        required
        v-if="index === this.selectedIndex"
      />
      <p v-else>{{ alarm }}</p>
      <div v-if="index === this.selectedIndex">
        <button class="add-button" @click="updateAlarm">update</button>
        <button class="add-button" @click="cancelUpdate">cancel</button>
      </div>
      <div v-else>
        <button class="edit-button" @click="editAlarm(index)">edit</button>
        <button class="remove-button" @click="removeAlarm(index)">
          remove
        </button>
      </div>
    </div>
  </li>
</template>

<style>
h2 {
  color: #b2e7e8;
  margin: 100px 0px 20px 0px;
  font-size: 40px;
}
input {
  font-family: "Poppins", sans-serif;
  font-size: 20px;
  border-radius: 15px;
  padding: 6px;
  margin: 10px;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
  width: 250px;
  background-color: #ffffff;
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
.add-button {
  background-color: #8fb9aa;
  border: 2px solid #f9f9f9;
}
.edit-button {
  background-color: #f2d096;
  border: 2px solid #f9f9f9;
}
.remove-button {
  background-color: #ed8975;
  border: 2px solid #f9f9f9;
}
li {
  list-style-type: none;
}
p {
  margin: auto;
  padding: auto;
}
.alarm-card {
  position: relative;
  align-items: center;
  display: flex;
  background-color: #ccc;
  border-radius: 25px;
  color: rgb(115, 50, 50);
  font-size: 70px;
  font-weight: bold;
  margin: 10px;
}
</style>
