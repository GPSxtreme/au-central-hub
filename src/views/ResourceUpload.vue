<template>
  <div class="container">
    <div class="upload-container">
      <div class="dropdown-container">
        <select v-model="selectedDepartment" class="dropdown">
          <option disabled value="">Select Department</option>
          <option value="computer-science">
            Computer Science & engineering
          </option>
        </select>

        <select v-model="selectedClass" class="dropdown">
          <option disabled value="">Select Class</option>
          <option value="a1">A1</option>
        </select>

        <select v-model="selectedSubject" class="dropdown">
          <option disabled value="">Select Subject</option>
          <option value="embedded-systems">Embedded Systems</option>
          <option value="distributed-systems">Distributed Systems</option>
          <option value="java">Java</option>
        </select>
      </div>

      <div class="file-upload-container">
        <input
          type="file"
          @change="handleFileUpload"
          class="file-input"
          ref="fileInput"
        />
        <label class="file-label">Choose a file</label>
      </div>

      <button
        @click="uploadFile"
        :disabled="!selectedFile"
        class="upload-button"
      >
        Upload Resources
      </button>
    </div>
  </div>
</template>

<script>
import "@/styles/resourceUpload.css";
import { getStorage, ref, uploadBytes } from "firebase/storage";

export default {
  data() {
    return {
      selectedDepartment: "",
      selectedClass: "",
      selectedSubject: "",
      selectedFile: null,
      uploadStatus: "",
    };
  },
  methods: {
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
      this.uploadStatus = "";
    },
    async uploadFile() {
      // Renamed to match the button's @click event
      if (
        !this.selectedFile ||
        !this.selectedDepartment ||
        !this.selectedClass ||
        !this.selectedSubject
      ) {
        this.uploadStatus =
          "Please select a department, class, subject and file.";
        return;
      }

      const maxFileSize = 10 * 1024 * 1024; // 10 MB
      if (this.selectedFile.size > maxFileSize) {
        this.uploadStatus = "File size exceeds 10 MB limit.";
        return;
      }

      try {
        const storage = getStorage();
        const fileName = this.selectedFile.name;
        const storagePath = `resources/${this.selectedDepartment}/${this.selectedClass}/${this.selectedSubject}/${fileName}`;
        const storageRef = ref(storage, storagePath);
        await uploadBytes(storageRef, this.selectedFile);
        alert("Resource Successfully Uploaded !");
        this.selectedClass = null;
        this.selectedDepartment = null;
        this.selectedSubject = null;
        this.selectedFile = null;
        this.uploadStatus = `Resource uploaded successfully to ${storagePath}!`;
      } catch (error) {
        console.error("Error uploading file: ", error);
        this.uploadStatus = "Error uploading file.";
      }
    },
  },
};
</script>
