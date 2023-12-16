<template>
  <div class="portal-container">
    <h1>Welcome to the Student Portal!</h1>

    <div class="links">
      <router-link to="/student-profile">My Profile</router-link>
      <router-link to="/student-attendance">My Attendance</router-link>
      <router-link to="/events">Events</router-link>
      <router-link to="/college-calendar">College Calendar</router-link>
      <router-link to="/student-results">Results</router-link>
      <router-link to="/student-assignments">Assignments</router-link>
      <router-link to="/logout" @click="logout">Logout</router-link>
    </div>
  </div>
</template>

<script>
import "@/styles/studentPortal.css";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";

export default {
  name: "StudentPortal",
  methods: {
    logout() {
      signOut(auth)
        .then(() => {
          // Redirect to home page after successful logout
          this.$router.push("/");
        })
        .catch((error) => {
          // Handle any errors here
          console.error("Logout Failed:", error);
        });
    },
  },
};
</script>
