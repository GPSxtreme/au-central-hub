<template>
  <div class="login">
    <div class="login-container">
      <h2>Student Login</h2>
      <form @submit.prevent="onSubmit">
        <div class="txt_field">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="txt_field">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button class="btn" type="submit">
          <span class="button-content">Login</span>
        </button>
      </form>

      <p v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { auth } from "@/firebase"; // Import the auth object
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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
        this.error = null;
        // Use Firebase auth to sign in with email and password
        await signInWithEmailAndPassword(auth, this.email, this.password);

        // Get the current user
        const user = auth.currentUser;

        if (user) {
          // Check if the user is an admin
          const isAdmin = await this.checkAdmin(user.uid);

          if (!isAdmin) {
            // If the user is not an admin, redirect to the student portal
            this.$router.push("/student-portal");
          } else {
            // If the user is an admin, perform a logout
            await auth.signOut();
            alert("User is not a student.\nPlease use valid credentials");
          }
        }
      } catch (error) {
        // Handle errors here (e.g., wrong password, no user found, etc.)
        this.error = error.message;
        console.error("Login failed:", error);
      }
    },
    async checkAdmin(userId) {
      try {
        const db = getFirestore();
        const docRef = doc(db, `users/students/profileData/${userId}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          return docSnap.data().isAdmin === true;
        }

        return true;
      } catch (error) {
        console.error("Error checking admin status:", error);
        return false;
      }
    },
  },
  created() {
    // Use onAuthStateChanged to check the user's admin status when the user state changes
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.checkAdmin(user.uid).then((isAdmin) => {
          if (!isAdmin) {
            // If the user is not an admin, redirect to the student portal
            this.$router.push("/student-portal");
          }
        });
      }
    });
  },
};
</script>
