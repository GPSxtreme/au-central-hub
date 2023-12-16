<template>
  <div>
    <h1>Assignments Portal</h1>
    <h2>Select Subject</h2>
    <ul>
      <li
        v-for="subject in subjects"
        :key="subject.id"
        @click="selectSubject(subject.id)"
      >
        {{ subject.name }}
      </li>
    </ul>
    <hr />
  </div>
  <div v-if="selectedSubject">
    <h2>Subject Name: {{ selectedSubjectName }}</h2>
    <h3>Available Assignments</h3>

    <ul v-if="assignments.length > 0">
      <li
        v-for="assignment in assignments"
        :key="assignment.id"
        @click.self="toggleAssignmentDetails(assignment)"
      >
        {{ assignment.name }}
        <div
          v-if="selectedAssignment && selectedAssignment.id === assignment.id"
        >
          <br />
          <table>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Posted On</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Upload PDF</th>
            </tr>
            <tr>
              <td>{{ assignment.name }}</td>
              <td>{{ assignment.description }}</td>
              <td>{{ formatDate(assignment.createdOn) }}</td>
              <td>{{ formatDate(assignment.endsOn) }}</td>
              <td>{{ checkSubmissionStatus(assignment) }}</td>
              <td>
                <input type="file" v-if="checkSubmissionStatus(assignment)" />
                <button
                  v-if="checkSubmissionStatus(assignment)"
                  @click="uploadPDF($event, assignment)"
                >
                  Upload
                </button>
              </td>
            </tr>
          </table>
          <!-- Placeholder for future upload button -->
        </div>
      </li>
    </ul>
    <p v-else>No assignments available.</p>
  </div>
</template>

<script>
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { auth } from "@/firebase";

export default {
  data() {
    return {
      subjects: [],
      selectedSubject: null,
      selectedSubjectName: "",
      assignments: [],
      selectedAssignment: null,
      deptId: null,
      sectionId: null,
    };
  },
  async created() {
    const db = getFirestore();
    const uid = auth.currentUser.uid;
    const profileRef = doc(db, `users/students/profileData/${uid}`);
    const profileSnap = await getDoc(profileRef);

    if (profileSnap.exists()) {
      const studentProfile = profileSnap.data();
      const course = studentProfile.course;
      const section = studentProfile.section;

      // Fetch deptId and sectionId based on student's course and section
      const departmentsRef = collection(db, "departments");
      const departmentsQuery = query(departmentsRef);
      const deptSnapshot = await getDocs(departmentsQuery);
      this.deptId = deptSnapshot.docs.find(
        (doc) => doc.data().deptCode === course
      ).id;

      const sectionsRef = collection(db, `departments/${this.deptId}/sections`);
      const sectionsQuery = query(sectionsRef);
      const sectionSnapshot = await getDocs(sectionsQuery);
      this.sectionId = sectionSnapshot.docs.find(
        (doc) => doc.data().name === section
      ).id;

      const subjectsRef = collection(
        db,
        `departments/${this.deptId}/sections/${this.sectionId}/subjects`
      );
      const subjectsQuery = query(subjectsRef);

      onSnapshot(subjectsQuery, (querySnapshot) => {
        this.subjects = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      });
    } else {
      console.log("Student profile not found");
    }
  },
  methods: {
    async selectSubject(subjectId) {
      this.selectedSubject = subjectId;
      const selectedSubject = this.subjects.find(
        (subject) => subject.id === subjectId
      );
      this.selectedSubjectName = selectedSubject ? selectedSubject.name : "";

      const db = getFirestore();
      const assignmentsRef = collection(
        db,
        `departments/${this.deptId}/sections/${this.sectionId}/subjects/${subjectId}/assignments`
      );
      const q = query(assignmentsRef);

      onSnapshot(q, (querySnapshot) => {
        this.assignments = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      });
    },
    toggleAssignmentDetails(assignment) {
      if (
        this.selectedAssignment &&
        this.selectedAssignment.id === assignment.id
      ) {
        this.selectedAssignment = null; // Close if the same assignment is clicked again
      } else {
        this.selectedAssignment = assignment; // Open the clicked assignment
      }
    },
    checkSubmissionStatus(assignment) {
      const uid = auth.currentUser.uid;
      return assignment.submitted.includes(uid) ? "Submitted" : "Not Submitted";
    },
    uploadPDF(event, assignment) {
      console.log(event.InstanceType, assignment.InstanceType);
      alert("Feature not implemented yet");
      // Logic to handle PDF upload
      // Remember to update the 'submitted' array in Firestore after successful upload
    },
    formatDate(timestamp) {
      if (!timestamp) return "";
      const date = timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date object
      return date.toLocaleDateString(); // Format date to readable format (e.g., 'MM/DD/YYYY')
    },
  },
};
</script>
