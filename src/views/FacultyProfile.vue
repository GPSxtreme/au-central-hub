<template>
  <div class="profile-container">
    <h1>My Profile</h1>
    <div v-if="faculty">
      <p>Name: {{ faculty.name }}</p>
      <p>Is teaching staff: {{ faculty.isTeaching ? "Yes" : "No" }}</p>
      <p>Qualifications : {{ faculty.qualifications }}</p>
      <p>gender: {{ faculty.gender }}</p>
      <p>joining: {{ faculty.joining }}</p>
      <p>dob: {{ faculty.dob }}</p>
      <p>Is admin : {{ faculty.isAdmin ? "Yes" : "No" }}</p>
      <p>Department : {{ faculty.dept }}</p>
      <p>Joining year : {{ faculty.joining }}</p>
    </div>
    <div v-else>
      <p>loading...</p>
    </div>
  </div>
</template>

<script>
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from "@/firebase";
import "@/styles/facultyProfile.css";

export default {
  name: "FacultyProfile",
  data() {
    return {
      faculty: null,
    };
  },
  async created() {
    const db = getFirestore();
    const userId = auth.currentUser.uid; // Get the current user's ID
    const docRef = doc(db, `users/faculty/profileData/${userId}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this.faculty = docSnap.data();
    } else {
      console.log("No such document!");
    }
  },
};
</script>
