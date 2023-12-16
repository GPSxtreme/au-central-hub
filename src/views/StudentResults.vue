<template>
  <div class="main">
    <h1>Student Results</h1>
    <div class="semesters">
      <button class="sem-btn" @click="loadResults('Sem-1')">Sem-1</button>
      <button class="sem-btn" @click="loadResults('Sem-2')">Sem-2</button>
      <button class="sem-btn" @click="loadResults('Sem-3')">Sem-3</button>
      <button class="sem-btn" @click="loadResults('Sem-4')">Sem-4</button>
      <button class="sem-btn" @click="loadResults('Sem-5')">Sem-5</button>
      <button class="sem-btn" @click="loadResults('Sem-6')">Sem-6</button>
      <button class="sem-btn" @click="loadResults('Sem-7')">Sem-7</button>
      <button class="sem-btn" @click="loadResults('Sem-8')">Sem-8</button>
    </div>

    <div v-if="selectedSemester">
      <h2>{{ selectedSemester }}</h2>
      <template v-if="results && Object.keys(results).length > 0">
        <!-- Display results in a table -->
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Subject</th>
              <th>Marks</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(marks, subject, $index) in results" :key="subject">
              <template v-if="subject !== 'gpa'">
                <td>{{ $index + 1 }}</td>
                <td>{{ subject }}</td>
                <td>{{ marks.toString() }}</td>
              </template>
            </tr>
          </tbody>
        </table>

        <!-- Display GPA outside the table -->
        <div>
          <h2><strong>GPA:</strong> {{ results.gpa }}</h2>
        </div>
      </template>
      <template v-else>
        <h3>No records found for {{ selectedSemester }}.</h3>
      </template>
    </div>

    <div class="cgpa">
      <h2><strong>CGPA:</strong> {{ cgpa }}</h2>
    </div>
  </div>
</template>

<script>
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { auth } from "@/firebase";
import "@/styles/studentResults.css";
export default {
  name: "StudentResults",
  data() {
    return {
      selectedSemester: null,
      results: [],
      docId: null,
      cgpa: null,
      msg: null,
    };
  },
  methods: {
    async fetchAndStoreCGPA() {
      const db = getFirestore();
      const userId = auth.currentUser.uid;
      const docRef = collection(
        db,
        `users/students/profileData/${userId}/results`
      );
      const querySnapshot = await getDocs(docRef);
      querySnapshot.forEach((doc) => {
        this.docId = doc.id;
        this.cgpa = doc.data().cgpa;
      });
    },

    async loadResults(semester) {
      const db = getFirestore();
      const userId = auth.currentUser.uid;
      const resultsRef = collection(
        db,
        `users/students/profileData/${userId}/results/${this.docId}/${semester}`
      );
      const semesterCollectionExists = await getDocs(resultsRef);
      if (semesterCollectionExists) {
        const q = query(resultsRef);
        onSnapshot(q, (querySnapshot) => {
          const data = [];
          querySnapshot.forEach((doc) => {
            data.push({ ...doc.data() });
          });
          this.selectedSemester = semester;
          this.results = data[0];
        });
      } else {
        this.msg = "No records found!!";
      }
    },
  },
  async created() {
    // Load CGPA when the component is created (page is loaded)
    await this.fetchAndStoreCGPA();
    this.loadResults("Sem-1");
  },
};
</script>
