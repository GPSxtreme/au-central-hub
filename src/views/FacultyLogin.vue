<template>
  <div class="login-container">
    <h2>Faculty Login</h2>
    <form @submit.prevent="onSubmit">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import "@/styles/facultyLogin.css";
import { auth } from "@/firebase"; // Import the auth object
import { signInWithEmailAndPassword } from "firebase/auth";

export default {
  name: "FacultyLogin",
  data() {
    return {
      email: "",
      password: "",
      error: "",
    };
  },
  methods: {
    async onSubmit() {
      try {
        // Use Firebase auth to sign in with email and password
        // we need to implement a checking mechanism to check if the
        // login credentials belong to a faculty member or not.
        await signInWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push("/faculty-portal"); // Redirect to student portal
      } catch (error) {
        // Handle errors here (e.g., wrong password, no user found, etc.)
        this.error = error.message;
        console.error("Login failed:", error);
      }
    },
  },
};
</script>
