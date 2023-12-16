<template>
  <div class="profile-container">
    <h1>My Profile</h1>
    <div v-if="student">
      <p>Name: {{ student.name }}</p>
      <p>Reg. No: {{ student.regNo }}</p>
      <p>Section : {{ student.section }}</p>
      <p>gender: {{ student.gender }}</p>
      <p>joining: {{ student.joining }}</p>
      <p>dob: {{ student.dob }}</p>
      <p>Course: {{ student.course }}</p>
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
};
</script>
