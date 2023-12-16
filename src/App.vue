<template>
  <div id="app">
    <!-- Global Header (if any) -->
    <header>
      <!-- Common header content (if any) -->
    </header>

    <!-- Main Content (Rendered by Vue Router) -->
    <router-view></router-view>

    <!-- Global Footer (if any) -->
    <footer>
      <!-- Common footer content (if any) -->
    </footer>
  </div>
</template>

<script>
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
