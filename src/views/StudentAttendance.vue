<template>
  <div class="main">
    <h1>My Attendance</h1>
    <table v-if="attendanceRecords.length">
      <thead>
        <tr>
          <th>S.No</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(record, index) in attendanceRecords" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ formatDate(record.date) }}</td>
          <td>{{ record.status }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>No attendance records found.</p>
  </div>
</template>

<script>
import "@/styles/studentAttendance.css";
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
} from "firebase/firestore";
import { auth } from "@/firebase";
export default {
  name: "StudentAttendance",
  data() {
    return {
      attendanceRecords: [],
    };
  },
  created() {
    const db = getFirestore();
    const uid = auth.currentUser.uid; // Get the current user's UID
    const attendanceRef = collection(
      db,
      `users/students/profileData/${uid}/attendance`
    );

    const q = query(attendanceRef);

    onSnapshot(q, (querySnapshot) => {
      this.attendanceRecords = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        let status = data.isWorkingDay
          ? data.status
            ? "Present"
            : "Absent"
          : "Not Working Day";
        return {
          date: data.date,
          status: status,
        };
      });
    });
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
