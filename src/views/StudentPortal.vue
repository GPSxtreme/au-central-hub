<template>
  <div class="portal-container">
    <h2>Welcome to the Student Portal!</h2>
    <div class="links">
      <router-link to="/student-profile" class="route-link"
        >My Profile</router-link
      >
      <router-link to="/student-attendance" class="route-link"
        >My Attendance</router-link
      >
      <a
        href="https://www.andhrauniversity.edu.in/img/news/calau.pdf"
        target="_blank"
        class="route-link"
        >College Calendar</a
      >
      <router-link to="/student-results" class="route-link"
        >Results</router-link
      >
      <router-link to="/student-resources" class="route-link"
        >Resources</router-link
      >
      <router-link to="/student-assignments" class="route-link"
        >Assignments</router-link
      >
      <router-link
        to="/logout"
        @click="logout"
        class="route-link"
        style="color: red"
        >Logout</router-link
      >
    </div>

    <h2 class="eventsHead">News and Events</h2>
    <div class="eventScroller">
      <marquee
        height="320px"
        direction="up"
        scrolldelay="0"
        scrollamount="3"
        onmouseover="this.stop();"
        onmouseout="this.start();"
        class="marquee-style"
      >
        <ul>
          <li>
            <a
              href="https://services.andhrauniversity.edu.in/au-sports/main.php"
              target="blank"
              ><span>07/12/2023 :: </span>Andhra University - Inter University
              South Zone Youth Festival (UNIFEST) 2023-24
            </a>
          </li>

          <li>
            <a
              href="https://www.andhrauniversity.edu.in/img/pdf/events/Brouchure- Ecomarine Project Training Program.pdf"
              target="blank"
              ><span>25/09/2023 :: </span> Training programme on "Microplastics
              in Marine Environment - analysis, mitigation and management" Phase
              I: 7th to 9th October 2023 &amp; Phase II: 10th to 12th November
              2023 organised by Department of Marine Living Resources , Andhra
              University
            </a>
          </li>

          <li>
            <a
              href="https://www.andhrauniversity.edu.in/img/nptel.jpg"
              target="blank"
              ><span>16/08/2023 :: </span>Andhra University has been awarded as
              "Best New LC" among the top 100 Local Chapters
            </a>
          </li>
        </ul>
      </marquee>
    </div>
  </div>
</template>

<script>
import "@/styles/studentPortal.css";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";

export default {
  name: "StudentPortal",
  methods: {
    logout() {
      signOut(auth)
        .then(() => {
          // Redirect to home page after successful logout
          this.$router.push("/");
        })
        .catch((error) => {
          // Handle any errors here
          console.error("Logout Failed:", error);
        });
    },
  },
};
</script>
