<template>
  <div class="main">
    <div>
      <h1>Assignments Portal</h1>
      <h2>Select Subject</h2>
      <p
        v-for="subject in subjects"
        :key="subject.id"
        @click="selectSubject(subject.id)"
        class="sub"
      >
        {{ subject.name }}
      </p>
      <hr />
    </div>
    <div v-if="selectedSubject">
      <h2>Subject Name: {{ selectedSubjectName }}</h2>
      <h3>Available Assignments</h3>

      <table v-if="assignments.length > 0">
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Posted On</th>
          <th>Deadline</th>
          <th>Status</th>
          <th>Upload PDF</th>
        </tr>
        <tr v-for="assignment in assignments" :key="assignment.id">
          <td>{{ assignment.name }}</td>
          <td>{{ assignment.description }}</td>
          <td>{{ formatDate(assignment.createdOn) }}</td>
          <td>{{ formatDate(assignment.endsOn) }}</td>
          <td>
            <span v-if="checkSubmissionStatus(assignment) === 'Submitted'">
              Uploaded ({{ getUserFileName(assignment) }})
            </span>
            <span v-else>Not Submitted</span>
          </td>
          <td style="display: flex; flex-direction: column; gap: 5px">
            <input
              accept="application/pdf"
              type="file"
              @change="uploadPDF($event, assignment)"
            />
            <button>
              {{
                checkSubmissionStatus(assignment) === "Submitted"
                  ? "Reupload"
                  : "Upload"
              }}
            </button>
          </td>
        </tr>
      </table>
      <p v-else>No assignments available.</p>
    </div>
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
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { auth } from "@/firebase";
import "@/styles/studentAssignments.css";
import { getStorage, ref, uploadBytes } from "firebase/storage";
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
      studentProfile: null,
    };
  },
  async created() {
    const db = getFirestore();
    const uid = auth.currentUser.uid;
    const profileRef = doc(db, `users/students/profileData/${uid}`);
    const profileSnap = await getDoc(profileRef);

    if (profileSnap.exists()) {
      this.studentProfile = profileSnap.data();
      const course = this.studentProfile.course;
      const section = this.studentProfile.section;

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
    async uploadPDF(event, assignment) {
      const file = event.target.files[0];
      if (!file) return;

      // Check if the deadline has passed
      const deadline = new Date(assignment.endsOn.seconds * 1000);
      if (new Date() > deadline) {
        alert("The deadline for this assignment has passed.");
        return;
      }

      // Check file size (5 MB limit)
      const maxFileSize = 5 * 1024 * 1024; // 5 MB
      if (file.size > maxFileSize) {
        alert("File size exceeds 5 MB limit.");
        return;
      }

      try {
        const storage = getStorage();
        const userDocRef = doc(
          getFirestore(),
          `users/students/profileData/${auth.currentUser.uid}`
        );
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          console.error("User profile not found");
          return;
        }

        const regNo = userDocSnap.data().regNo;
        const fileName = `${regNo}.${file.name.split(".").pop()}`;
        const storageRef = ref(
          storage,
          `assignments/${assignment.id}/${fileName}`
        );

        // Upload file
        await uploadBytes(storageRef, file);

        // Update Firestore document after successful upload
        const assignmentRef = doc(
          getFirestore(),
          `departments/${this.deptId}/sections/${this.sectionId}/subjects/${this.selectedSubject}/assignments/${assignment.id}`
        );
        await updateDoc(assignmentRef, {
          submitted: arrayUnion(auth.currentUser.uid),
        });

        alert("Assignment submitted successfully!");
      } catch (error) {
        console.error("Error uploading file: ", error);
        alert("Error uploading file.");
      }
    },
    formatDate(timestamp) {
      if (!timestamp) return "";
      const date = timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date object
      return date.toLocaleDateString(); // Format date to readable format (e.g., 'MM/DD/YYYY')
    },
    getUserFileName(assignment) {
      // Assuming the file name format is 'regNo.extension'
      const regNo = this.studentProfile.regNo;
      return assignment.submitted.includes(auth.currentUser.uid)
        ? `${regNo}.pdf`
        : "";
    },
  },
};
</script>

<style scoped>
.main {
  margin: 30px;
}
hr {
  width: 100%;
}
.sub {
  text-decoration: underline;
  cursor: pointer;
  color: blue;
}
</style>
