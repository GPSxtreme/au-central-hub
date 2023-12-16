<template>
  <div class="profile-container">
    <h1>My Profile</h1>
    <hr />
    <div v-if="student">
      <p><span class="label">Name:</span> {{ student.name }}</p>
      <p><span class="label">Reg. No:</span> {{ student.regNo }}</p>
      <p><span class="label">Section :</span> {{ student.section }}</p>
      <p><span class="label">Gender:</span> {{ student.gender }}</p>
      <p><span class="label">Joining:</span> {{ student.joining }}</p>
      <p>
        <span class="label">Date of birth:</span> {{ formatDate(student.dob) }}
      </p>
      <p><span class="label">Course:</span> {{ student.course }}</p>
    </div>
    <div v-else>
      <p>loading...</p>
    </div>
  </div>
</template>

<script>
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from "@/firebase";
import "@/styles/studentProfile.css";

export default {
  name: "StudentProfile",
  data() {
    return {
      student: null,
    };
  },
  async created() {
    const db = getFirestore();
    const userId = auth.currentUser.uid; // Get the current user's ID
    const docRef = doc(db, `users/students/profileData/${userId}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this.student = docSnap.data();
    } else {
      console.log("No such document!");
    }
  },
  methods: {
    formatDate(timestamp) {
      if (!timestamp) return "";
      const date = timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date object
      return date.toLocaleDateString(); // Format date to readable format (e.g., 'MM/DD/YYYY')
    },
  },
};
</script>
