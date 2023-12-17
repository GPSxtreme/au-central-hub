<template>
  <div class="main">
    <h2>
      Attendance Portal <br />
      {{ selectedDepartmentName }} <br />
      Section: {{ selectedSectionName }} <br />
      Date: {{ new Date().toLocaleDateString() }}
    </h2>
    <div v-if="!isAttendanceTaken">
      <div v-if="isWorkingDay">
        <div v-if="students.length > 0" class="content">
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Reg. No</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Is Present</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(student, index) in students" :key="student.uid">
                <td>{{ index + 1 }}</td>
                <td>{{ student.regNo }}</td>
                <td>{{ student.name }}</td>
                <td>{{ student.gender }}</td>
                <td>
                  <input type="checkbox" v-model="student.isPresent" />
                </td>
              </tr>
            </tbody>
          </table>
          <button @click="submitAttendance">Submit Attendance</button>
        </div>
        <div v-else style="text-align: center">Loading...</div>
      </div>
      <div v-else>
        <p>
          Today is not a working day. Attendance will be marked automatically.
        </p>
      </div>
    </div>
    <div v-else style="text-align: center; margin: 30px 0px">
      <p>Attendance is already marked for today. Please return tomorrow.</p>
      <table v-if="attendanceRecords.length > 0">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Reg. No</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Is Present</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in attendanceRecords" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ record.regNo }}</td>
            <td>{{ record.name }}</td>
            <td>{{ record.gender }}</td>
            <td>{{ record.isPresent ? "Yes" : "No" }}</td>
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
  query,
  where,
  getDocs,
  addDoc,
  limit,
} from "firebase/firestore";

export default {
  name: "TakeAttendance",
  data() {
    return {
      selectedDepartmentId: "",
      selectedSectionId: "",
      selectedDepartmentName: "",
      selectedSectionName: "",
      students: [],
      attendanceRecords: [],
      isWorkingDay: true,
      isAttendanceTaken: false,
    };
  },
  async created() {
    this.selectedDepartmentId = this.$route.params.selectedDepartmentId;
    this.selectedSectionId = this.$route.params.selectedSectionId;
    this.selectedDepartmentName = this.$route.params.selectedDepartmentName;
    this.selectedSectionName = this.$route.params.selectedSectionName;
    await this.checkAttendanceTaken();
    if (!this.isAttendanceTaken) this.fetchStudents();
  },
  methods: {
    async checkAttendanceTaken() {
      const db = getFirestore();
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0]; // Format to 'YYYY-MM-DD'

      // Fetch a few students from the section
      const studentsRef = collection(db, "users/students/profileData");
      const q = query(
        studentsRef,
        where("sectionId", "==", this.selectedSectionId),
        limit(5)
      );

      const studentsSnapshot = await getDocs(q);
      for (const studentDoc of studentsSnapshot.docs) {
        const attendanceRef = collection(
          db,
          `users/students/profileData/${studentDoc.id}/attendance`
        );
        const attendanceSnapshot = await getDocs(attendanceRef);

        for (const attendanceDoc of attendanceSnapshot.docs) {
          const attendanceDateStr = attendanceDoc
            .data()
            .date.toDate()
            .toISOString()
            .split("T")[0];
          if (attendanceDateStr === todayStr) {
            this.isAttendanceTaken = true;
            this.fetchAttendanceRecords();
            return; // Stop checking further if attendance is found for today
          }
        }
      }

      this.isAttendanceTaken = false; // Set to false if no attendance records are found for today
    },
    async fetchAttendanceRecords() {
      const db = getFirestore();
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0]; // 'YYYY-MM-DD'

      const studentsRef = collection(db, "users/students/profileData");
      const studentsSnapshot = await getDocs(
        query(studentsRef, where("sectionId", "==", this.selectedSectionId))
      );

      for (const studentDoc of studentsSnapshot.docs) {
        const studentData = studentDoc.data();
        const attendanceRef = collection(
          db,
          `users/students/profileData/${studentDoc.id}/attendance`
        );
        const attendanceSnapshot = await getDocs(attendanceRef);

        for (const attendanceDoc of attendanceSnapshot.docs) {
          const attendanceDateStr = attendanceDoc
            .data()
            .date.toDate()
            .toISOString()
            .split("T")[0];
          if (attendanceDateStr === todayStr) {
            this.attendanceRecords.push({
              regNo: studentData.regNo,
              name: studentData.name,
              gender: studentData.gender,
              isPresent: attendanceDoc.data().status,
            });
          }
        }
      }
    },
    async fetchStudents() {
      if (!this.isWorkingDay) {
        return; // Skip fetching students if it's not a working day
      }
      const db = getFirestore();
      const studentsRef = collection(db, "users/students/profileData/");
      const q = query(
        studentsRef,
        where("sectionId", "==", this.selectedSectionId)
      );

      const querySnapshot = await getDocs(q);
      this.students = querySnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
        isPresent: false,
      }));
    },
    async submitAttendance() {
      const db = getFirestore();

      for (const student of this.students) {
        const attendanceRef = collection(
          db,
          `users/students/profileData/${student.uid}/attendance`
        );
        await addDoc(attendanceRef, {
          date: new Date(),
          isWorkingDay: this.isWorkingDay,
          status: this.isWorkingDay ? student.isPresent : false,
        });
      }

      alert("Attendance submitted successfully!");
      this.isAttendanceTaken = true;
      this.fetchAttendanceRecords();
    },
  },
};
</script>

<style scoped>
/* Existing styles */
.main {
  margin: 30px;
  min-height: 80vh;
  align-items: center;
}

.main h2 {
  text-align: center;
  line-height: 40px;
}
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 30px;
  align-items: center;
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
</style>
