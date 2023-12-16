<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar">
      <h1>Andhra University</h1>
    </nav>

    <!-- Main Content -->
    <div class="main-content">
      <button class="portal-btn" @click="goToStudentLogin">
        Student Portal
      </button>
      <button class="portal-btn" @click="goToFacultyLogin">
        Faculty Portal
      </button>
    </div>
  </div>
</template>

<script>
import "@/styles/home.css";
export default {
  name: "HomeView",
  methods: {
    goToStudentLogin() {
      this.$router.push("/student-login");
    },
    goToFacultyLogin() {
      this.$router.push("/faculty-login");
    },
  },
};
</script>
