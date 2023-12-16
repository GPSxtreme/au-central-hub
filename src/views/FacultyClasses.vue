<template>
  <div class="main">
    <h1>My Classes</h1>
    <table>
      <thead>
        <tr>
          <th>S.No</th>
          <th>Class</th>
          <th>Subject</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(section, subject, index) in teachingSections"
          :key="subject"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ section }}</td>
          <td>{{ subject }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from "@/firebase";
import "@/styles/facultyClasses.css";

export default {
  name: "FacultySchedule",
  data() {
    return {
      teachingSections: {},
    };
  },
  methods: {
    async fetchTeachingSections() {
      try {
        const db = getFirestore();
        const userId = auth.currentUser.uid;
        const docRef = doc(db, `users/faculty/profileData/${userId}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          this.teachingSections = docSnap.data().teachingSections || {};
        }
      } catch (error) {
        console.error("Error fetching teaching sections:", error);
      }
    },
  },
  created() {
    // Fetch teaching sections when the component is created (page is loaded)
    this.fetchTeachingSections();
  },
};
</script>
