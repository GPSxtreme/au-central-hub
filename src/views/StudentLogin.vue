<template>
   <body>
  <nav class="navbar">
      <a href="https://andhrauniversity.edu.in/"> <img src="https://andhrauniversity.edu.in/Header.png" class="logo"></a>
    </nav>
  <div class="login-container">
    <h1>Student Login</h1>
    <form @submit.prevent="onSubmit">
      <div class="txt_field">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="txt_field">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button class="btn" type="submit"><span class="button-content">Login</span></button>
    </form>

    <p v-if="error">{{ error }}</p>
  </div>
</body>
</template>

<script>
import { auth } from "@/firebase"; // Import the auth object
import { signInWithEmailAndPassword } from "firebase/auth";

export default {
  name: "StudentLogin",
  data() {
    return {
      email: "",
      password: "",
      error: "", // Add an error property to handle login errors
    };
  },
  methods: {
    async onSubmit() {
      try {
        // Use Firebase auth to sign in with email and password
        await signInWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push("/student-portal"); // Redirect to student portal
      } catch (error) {
        // Handle errors here (e.g., wrong password, no user found, etc.)
        this.error = error.message;
        console.error("Login failed:", error);
      }
    },
  },
};
</script>
