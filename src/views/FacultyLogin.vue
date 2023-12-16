<template>
  <div class="login">
    <div class="login-container">
      <h2>Faculty Login</h2>
      <form @submit.prevent="onSubmit">
        <div class="txt_field">
          <p style="font-size: 14px; margin: 0">Email</p>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="txt_field">
          <p style="font-size: 14px; margin: 0">Password</p>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button class="btn" type="submit">
          <span class="button-content">Login</span>
        </button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import "@/styles/facultyLogin.css";
import { auth } from "../firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import the auth object
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
        this.error = null;
        // Use Firebase auth to sign in with email and password
        await signInWithEmailAndPassword(auth, this.email, this.password);

        // Get the current user
        const user = auth.currentUser;
        if (user) {
          const isAdmin = await this.checkAdmin(auth.currentUser.uid);
          if (isAdmin) {
            this.$router.push("/faculty-portal");
          } else {
            await auth.signOut();
            alert(
              "User is not a faculty member.\nPlease use valid credentials"
            );
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
        const docRef = doc(db, `users/faculty/profileData/${userId}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          return docSnap.data().isAdmin === true;
        }

        return false;
      } catch (error) {
        console.error("Error checking admin status:", error);
        return false;
      }
    },
  },
};
</script>
