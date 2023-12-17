<template>
  <div class="assignments-container">
    <h2>View Assignments for {{ selectedSubjectName }}</h2>
    <table>
      <thead>
        <tr>
          <th>S.no</th>
          <th>Assignment Name</th>
          <th>Created on</th>
          <th>Description</th>
          <th>Deadline</th>
          <th>Submissions</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(assignment, $index) in assignments" :key="assignment.id">
          <td>{{ $index + 1 }}</td>
          <td>{{ assignment.name }}</td>
          <td>{{ formatDate(assignment.createdOn) }}</td>
          <td>{{ assignment.description }}</td>
          <td>{{ formatDate(assignment.endsOn) }}</td>
          <td>{{ assignment.submitted.length }}</td>
          <td>
            <button @click="viewDetails(assignment)">View Details</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="currentAssignment">
      <h2>Submissions for {{ currentAssignment.name }}</h2>
      <table>
        <thead>
          <tr>
            <th>S.no</th>
            <th>Reg No</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Uploaded file</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(submission, $index) in currentSubmissions"
            :key="submission.uid"
          >
            <td>{{ $index + 1 }}</td>
            <td>{{ submission.regNo }}</td>
            <td>{{ submission.name }}</td>
            <td>{{ submission.gender }}</td>
            <td>
              <a
                v-if="submission.fileUrl !== 'Unavailable'"
                :href="submission.fileUrl"
                target="_blank"
                >{{ `${submission.regNo}.pdf` }}</a
              >
              <span v-else>Unavailable</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {
  getFirestore,
  collection,
  onSnapshot,
  getDoc,
  doc,
} from "firebase/firestore";

import { getStorage, ref, getDownloadURL } from "firebase/storage";
export default {
  data() {
    return {
      assignments: [],
      selectedDepartmentId: "",
      selectedSectionId: "",
      selectedSubjectId: "",
      selectedSubjectName: "",
      currentSubmissions: [],
      currentAssignment: null,
    };
  },
  created() {
    this.selectedDepartmentId = this.$route.params.selectedDepartmentId;
    this.selectedSectionId = this.$route.params.selectedSectionId;
    this.selectedSubjectId = this.$route.params.selectedSubjectId;
    this.selectedSubjectName = this.$route.params.selectedSubjectName;
    this.fetchAssignments();
  },
  methods: {
    fetchAssignments() {
      const db = getFirestore();
      const locationString = `departments/${this.selectedDepartmentId}/sections/${this.selectedSectionId}/subjects/${this.selectedSubjectId}/assignments`;
      const assignmentsRef = collection(db, locationString);
      onSnapshot(assignmentsRef, (querySnapshot) => {
        this.assignments = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      });
    },
    formatDate(timestamp) {
      if (!timestamp) return "";
      const date = timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date object
      return date.toLocaleDateString(); // Format date to readable format (e.g., 'MM/DD/YYYY')
    },

    async viewDetails(assignment) {
      this.currentAssignment = assignment;
      const db = getFirestore();
      const storage = getStorage();
      const submissionDetails = [];

      for (const uid of assignment.submitted) {
        const studentRef = doc(db, `users/students/profileData/${uid}`);
        const studentSnap = await getDoc(studentRef);
        if (studentSnap.exists()) {
          const studentData = studentSnap.data();
          const fileRef = ref(
            storage,
            `assignments/${assignment.id}/${studentData.regNo}.pdf`
          );
          const fileUrl = await getDownloadURL(fileRef).catch(
            () => "Unavailable"
          );
          submissionDetails.push({ ...studentData, fileUrl });
        }
      }

      this.currentSubmissions = submissionDetails;
    },
  },
};
</script>

<style scoped>
.assignments-container {
  min-height: 80vh;
  margin: 30px;
}
table {
  margin-top: 30px;
}
</style>
