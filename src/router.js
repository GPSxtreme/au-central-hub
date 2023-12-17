import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import NotAuthorized from "./views/NotAuthorized.vue";
import StudentLogin from "./views/StudentLogin.vue";
import FacultyLogin from "./views/FacultyLogin.vue";
import StudentPortal from "./views/StudentPortal.vue";
import FacultyPortal from "./views/FacultyPortal.vue";
import StudentProfile from "./views/StudentProfile.vue";
import StudentAssignments from "./views/StudentAssignments.vue";
import StudentResults from "./views/StudentResults.vue";
import StudentAttendance from "./views/StudentAttendance.vue";
import FacultyProfile from "./views/FacultyProfile.vue";
import AttendanceManagement from "./views/AttendanceManagement.vue";
import FacultyClasses from "./views/FacultyClasses.vue";
import AssignmentManagement from "./views/AssignmentManagement.vue";
import ViewAssignments from "./views/ViewAssignments.vue";
import ResourceUpload from "./views/ResourceUpload.vue";
import CreateAssignments from "./views/CreateAssignments.vue";
import StudentResources from "./views/StudentResources.vue";

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/not-authorized",
      name: "NotAuthorized",
      component: NotAuthorized,
    },
    {
      path: "/student-login",
      name: "StudentLogin",
      component: StudentLogin,
    },
    {
      path: "/student-resources",
      name: "StudentResources",
      component: StudentResources,
    },
    {
      path: "/faculty-login",
      name: "FacultyLogin",
      component: FacultyLogin,
    },
    {
      path: "/student-portal",
      name: "StudentPortal",
      component: StudentPortal,
      meta: { requiresAuth: true },
    },
    {
      path: "/faculty-portal",
      name: "FacultyPortal",
      component: FacultyPortal,
      meta: { requiresAuth: true },
    },
    {
      path: "/resource-upload",
      name: "ResourceUpload",
      component: ResourceUpload,
      meta: { requiresAuth: true },
    },
    {
      path: "/student-profile",
      name: "StudentProfile",
      component: StudentProfile,
      meta: { requiresAuth: true },
    },
    {
      path: "/faculty-profile",
      name: "FacultyProfile",
      component: FacultyProfile,
      meta: { requiresAuth: true },
    },
    {
      path: "/student-assignments",
      name: "StudentAssignments",
      component: StudentAssignments,
      meta: { requiresAuth: true },
    },
    {
      path: "/student-results",
      name: "StudentResults",
      component: StudentResults,
      meta: { requiresAuth: true },
    },
    {
      path: "/student-attendance",
      name: "StudentAttendance",
      component: StudentAttendance,
      meta: { requiresAuth: true },
    },
    {
      path: "/attendance-management",
      name: "AttendanceManagement",
      component: AttendanceManagement,
      meta: { requiresAuth: true },
    },
    {
      path: "/my-class",
      name: "FacultyClasses",
      component: FacultyClasses,
      meta: { requiresAuth: true },
    },
    {
      path: "/assignment-management",
      name: "AssignmentManagement",
      component: AssignmentManagement,
      meta: { requiresAuth: true },
    },
    {
      path: "/view-assignments/:selectedDepartmentId/:selectedSectionId/:selectedSubjectId/:selectedSubjectName",
      name: "ViewAssignments",
      component: ViewAssignments,
      meta: { requiresAuth: true },
    },
    {
      path: "/create-assignments/:selectedDepartmentId/:selectedSectionId/:selectedSubjectId/:selectedSubjectName",
      name: "CreateAssignments",
      component: CreateAssignments,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  // Only check auth status if the route requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, proceed to the route
        next();
      } else {
        // User is not signed in, redirect to login
        next("/not-authorized");
      }
    });
  } else {
    // Route does not require auth, proceed as normal
    next();
  }
});
export default router;
