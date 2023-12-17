<template>
  <div id="app">
    <!-- Global Header (if any) -->
    <header>
      <nav class="navbar">
        <a href="https://andhrauniversity.edu.in/" target="_blank">
          <img src="https://andhrauniversity.edu.in/Header.png" class="logo"
        /></a>
      </nav>
      <!-- Common header content (if any) -->
    </header>

    <!-- Main Content (Rendered by Vue Router) -->
    <router-view></router-view>

    <!-- Global Footer (if any) -->
    <section class="footer">
      <!-- Common footer content (if any) -->

      <p>Made with <i class="fa fa-heart"></i> By TechTitans</p>
    </section>
  </div>
</template>

<script>
import "@/styles/app.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

export default {
  data() {
    return {
      isAuthenticated: false,
    };
  },
  created() {
    onAuthStateChanged(auth, (user) => {
      this.isAuthenticated = !!user;
    });
  },
};
</script>
