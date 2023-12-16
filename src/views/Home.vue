<template>
<body>
  <div>
    <!-- Main Content -->
    <div class="main-content">
      <button class="portal-btn" @click="goToStudentLogin">
        <span class="button-content">Student Portal</span>
      </button>
      <button class="portal-btn" @click="goToFacultyLogin">
        <span class="button-content">Faculty Portal</span>
      </button>
    </div>
  </div>
</body>
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
