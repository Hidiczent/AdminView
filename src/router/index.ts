import { createRouter, createWebHistory } from "vue-router";
import AdminDashboard from "../Views/AdminDashboard.vue";

const routes = [
  { path: "/", name: "Home", component: AdminDashboard },
  // add more routes here
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
