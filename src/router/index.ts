import { createRouter, createWebHistory } from "vue-router";
import AdminDashboard from "../Views/AdminDashboard.vue";
import AddPackage from "../Views/AddPackage.vue";
import ShowPackage from "../Views/ShowPackages.vue";
import EditPackage from "../Views/EditPackage.vue";

const routes = [
  { path: "/", name: "Dashboard", component: AdminDashboard }, // ✅ เพิ่ม path นี้
  { path: "/home", name: "Home", component: AdminDashboard },
  { path: "/add-package", name: "AddPackage", component: AddPackage },
  { path: "/show-package", name: "Showpackage", component: ShowPackage },
  { path: '/edit-package/:id', name: 'EditPackage', component: EditPackage }, // ✅ สำคัญ

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
