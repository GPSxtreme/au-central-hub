<template>
  <h3>RESOURCES</h3>
  <div class="container">
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
        <select id="section" v-model="selectedSection" @change="fetchSubjects">
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
      <!-- Subject Selection -->
      <div v-if="subjects.length > 0">
        <label for="subject">Select Subject:</label>
        <select id="subject" v-model="selectedSubject">
          <option disabled value="">Please select one</option>
          <option
            v-for="subject in subjects"
            :key="subject.id"
            :value="subject.id"
          >
            {{ subject.name }}
          </option>
        </select>
      </div>
    </div>
    <button @click="viewResources" class="upload-button">View Resources</button>

    <!-- List of Resources -->
    <div v-if="resources.length">
      <ul>
        <li v-for="resource in resources" :key="resource.name">
          {{ resource.name }}
          <a :href="resource.url" target="_blank">Download</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import "@/styles/studentResources.css";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";

export default {
  data() {
    return {
      departments: [],
      sections: [],
      subjects: [],
      selectedDepartment: "",
      selectedClass: "",
      selectedSubject: "",
      resources: [],
    };
  },
  //   computed: {
  //     selectedFields() {
  //       return (
  //         this.selectedDepartment && this.selectedClass && this.selectedSubject
  //       );
  //     },
  //   },
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
    fetchSubjects() {
      if (!this.selectedSection) {
        this.subjects = [];
        return;
      }

      const db = getFirestore();
      const subjectsRef = collection(
        db,
        `departments/${this.selectedDepartment}/sections/${this.selectedSection}/subjects`
      );

      onSnapshot(
        subjectsRef,
        (querySnapshot) => {
          this.subjects = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          this.selectedSubject = ""; // Reset selected subject
        },
        (error) => {
          console.error("Error fetching subjects: ", error);
        }
      );
    },
    async viewResources() {
      const storage = getStorage();
      const resourcesPath = `resources/${this.selectedDepartment}/${this.selectedClass}/${this.selectedSubject}`;
      const listRef = ref(storage, resourcesPath);

      try {
        const res = await listAll(listRef);
        const resourceDetails = await Promise.all(
          res.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            return { name: itemRef.name, url };
          })
        );
        this.resources = resourceDetails;
        console.log(this.resources);
      } catch (error) {
        console.error("Error fetching resources:", error);
        this.resources = [];
      }
    },
  },
};
</script>
