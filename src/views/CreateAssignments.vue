<template>
  <div class="container">
    <div class="assignment-form">
      <h2>Create Assignment</h2>
      <form @submit.prevent="submitAssignment">
        <div class="form-group">
          <label for="name">Assignment Name:</label>
          <input id="name" v-model="assignment.name" type="text" required />
        </div>
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea
            id="description"
            v-model="assignment.description"
            required
          ></textarea>
        </div>
        <div class="form-group">
          <label for="endsOn">Ends On:</label>
          <input
            id="endsOn"
            v-model="assignment.endsOn"
            type="datetime-local"
            required
          />
        </div>
        <button type="submit">Create Assignment</button>
      </form>
    </div>
  </div>
</template>

<script>
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";

export default {
  name: "CreateAssignments",
  data() {
    return {
      assignment: {
        name: "",
        description: "",
        endsOn: "",
      },
      selectedDepartmentId: "",
      selectedSectionId: "",
      selectedSubjectId: "",
    };
  },
  created() {
    this.selectedDepartmentId = this.$route.params.selectedDepartmentId;
    this.selectedSectionId = this.$route.params.selectedSectionId;
    this.selectedSubjectId = this.$route.params.selectedSubjectId;
  },
  methods: {
    async submitAssignment() {
      const db = getFirestore();
      const newAssignmentRef = doc(
        collection(
          db,
          `departments/${this.selectedDepartmentId}/sections/${this.selectedSectionId}/subjects/${this.selectedSubjectId}/assignments`
        )
      );

      await setDoc(newAssignmentRef, {
        ...this.assignment,
        submitted: [],
        createdOn: new Date(),
        endsOn: new Date(this.assignment.endsOn),
      });

      alert("Assignment created successfully");
      // Reset form or navigate away
      this.assignment = {
        name: "",
        description: "",
        endsOn: "",
      };
    },
  },
};
</script>
<style scoped>
.container {
  min-height: 80vh;
  margin: 30px;
}
.assignment-form {
  max-width: 500px;
  margin: auto;
  padding: 20px 40px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
input[type="datetime-local"],
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 15px;
  width: 100%;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
