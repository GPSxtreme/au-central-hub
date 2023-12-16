<template>
  <div class="portal-container">
    <h1>Welcome to the Faculty Portal!</h1>

    <div class="links">
      <router-link to="/faculty-profile" class="route-link"
        >My Profile</router-link
      >
      <router-link to="/my-class" class="route-link">My class</router-link>
      <router-link to="/events" class="route-link">Events</router-link>
      <a
        href="https://www.andhrauniversity.edu.in/img/news/calau.pdf"
        target="_blank"
        class="route-link"
        >College Calendar</a
      >
      <router-link to="/assignments" class="route-link"
        >Assignments</router-link
      >
      <router-link to="/attendance-management" class="route-link"
        >Attendance management</router-link
      >
      <router-link to="/logout" @click="logout" class="route-link"
        >Logout</router-link
      >
    </div>
  </div>
</template>

<script>
import "@/styles/facultyPortal.css";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";

export default {
  name: "FacultyPortal",
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
