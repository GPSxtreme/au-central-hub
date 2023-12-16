<template>
  <div class="not-authorized">
    <h1>Access Denied</h1>
    <h2>Not authenticated</h2>
    <p>You do not have permission to view this page.</p>
    <router-link to="/">Go to Home</router-link>
  </div>
</template>

<script>
import "@/styles/notAuthorized.css";
export default {
  name: "NotAuthorized",
};
</script>
