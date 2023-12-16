<template>
  <div class="portal-container">
    <h1>Welcome to the Student Portal!</h1>
    <div class="links">
      <router-link to="/student-profile" class="route-link"
        >My Profile</router-link
      >
      <router-link to="/student-attendance" class="route-link"
        >My Attendance</router-link
      >
      <router-link to="/events" class="route-link">Events</router-link>
      <a
        href="https://www.andhrauniversity.edu.in/img/news/calau.pdf"
        target="_blank"
        class="route-link"
        >College Calendar</a
      >
      <router-link to="/student-results" class="route-link"
        >Results</router-link
      >
      <router-link to="/student-assignments" class="route-link"
        >Assignments</router-link
      >
      <router-link
        to="/logout"
        @click="logout"
        class="route-link"
        style="color: red"
        >Logout</router-link
      >
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
