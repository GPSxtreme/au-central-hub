<template>
  <div class="main">
    <h1>Attendance Management</h1>
    <hr />
    <!-- Department Selection -->
    <div class="content">
      <div>
        <label for="department">Select Department:</label>
        <select
          id="department"
          v-model="selectedDepartment"
          @change="fetchSections"
        >
          <option disabled value="">Please select one</option>
          <option v-for="dept in departments" :key="dept.id" :value="dept.id">
            {{ dept.deptName }}
          </option>
        </select>
      </div>

      <!-- Section Selection -->
      <div v-if="sections.length > 0">
        <label for="section">Select Section:</label>
        <select id="section" v-model="selectedSection">
          <option disabled value="">Please select one</option>
          <option
            v-for="section in sections"
            :key="section.id"
            :value="section.id"
          >
            {{ section.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Action Buttons -->
    <button @click="takeAttendance" v-if="selectedSection">
      Take attendance
    </button>
  </div>
</template>

<script>
import { getFirestore, collection, onSnapshot } from "firebase/firestore";

export default {
  name: "AssignmentManagement",
  data() {
    return {
      departments: [],
      sections: [],
      selectedDepartment: "",
      selectedSection: "",
    };
  },
  async created() {
    await this.fetchDepartments();
  },
  methods: {
    async fetchDepartments() {
      const db = getFirestore();
      const departmentsRef = collection(db, "departments");

      onSnapshot(
        departmentsRef,
        (querySnapshot) => {
          this.departments = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        },
        (error) => {
          console.error("Error fetching departments: ", error);
        }
      );
    },
    fetchSections() {
      if (!this.selectedDepartment) {
        this.sections = [];
        return;
      }

      const db = getFirestore();
      const sectionsRef = collection(
        db,
        `departments/${this.selectedDepartment}/sections`
      );

      onSnapshot(
        sectionsRef,
        (querySnapshot) => {
          this.sections = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          this.selectedSection = ""; // Reset selected section
          this.selectedSubject = ""; // Reset subject selection
          this.subjects = []; // Reset subjects array
        },
        (error) => {
          console.error("Error fetching sections: ", error);
        }
      );
    },
    takeAttendance() {
      const selectedDepartment =
        this.departments.find((dept) => dept.id === this.selectedDepartment) ||
        {};
      const selectedSection =
        this.sections.find((section) => section.id === this.selectedSection) ||
        {};
      this.$router.push({
        name: "TakeAttendance",
        params: {
          selectedDepartmentId: this.selectedDepartment,
          selectedSectionId: this.selectedSection,
          selectedDepartmentName: selectedDepartment.deptName,
          selectedSectionName: selectedSection.name,
        },
      });
    },
  },
};
</script>

<style scoped>
.main {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  margin-top: 40px;
}

label {
  margin-right: 10px;
}

select {
  margin: 10px;
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button {
  margin: 10px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.content {
  margin-top: 30px;
}
</style>
