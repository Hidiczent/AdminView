<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <aside class="w-64 bg-[#FFFF] text-white flex flex-col p-6 space-y-6">
      <h2 class="text-2xl font-bold mb-4 text-[#0a5a9a] text-center">
        Admin Panel
      </h2>
      <nav class="flex flex-col space-y-2">
        <RouterLink
          to="/"
          class="py-2 px-4 text-[#0a5a9a] rounded block hover:bg-[#0a5a9a] hover:text-white transition"
          active-class="bg-[#0a5a9a] text-white"
        >
          🏠 Dashboard
        </RouterLink>

        <RouterLink
          to="/show-package"
          class="py-2 px-4 text-[#0a5a9a] rounded block hover:bg-[#0a5a9a] hover:text-white transition"
          active-class="bg-[#0a5a9a] text-white"
        >
          📦 Packages
        </RouterLink>

        <RouterLink
          to="/add-package"
          class="py-2 px-4 text-[#0a5a9a] rounded block hover:bg-[#0a5a9a] hover:text-white transition"
          active-class="bg-[#0a5a9a] text-white"
        >
          ➕ Add Package
        </RouterLink>
        <RouterLink
          to="/confirmOrder"
          class="py-2 px-4 text-[#0a5a9a] rounded block hover:bg-[#0a5a9a] hover:text-white transition"
          active-class="bg-[#0a5a9a] text-white"
        >
        ✅ ConfirmOrder
        </RouterLink>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8 bg-gray-100">
      <h1 class="text-3xl font-bold mb-6 text-gray-800 text-center">
        Admin Dashboard
      </h1>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        <div class="bg-white p-6 rounded-2xl shadow-lg">
          <p class="text-gray-500 mb-2">Total Users</p>
          <p class="text-4xl font-bold text-blue-600">{{ stats.total }}</p>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-lg">
          <p class="text-gray-500 mb-2">Admins</p>
          <p class="text-4xl font-bold text-green-600">{{ stats.admins }}</p>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-lg">
          <p class="text-gray-500 mb-2">Users</p>
          <p class="text-4xl font-bold text-purple-600">{{ stats.users }}</p>
        </div>
      </div>

      <!-- Recent Users Table -->
      <div class="bg-white p-6 rounded-2xl shadow-lg">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">
          📋 Recent Registered Users
        </h2>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm text-left text-gray-700">
            <thead class="bg-[#084886] text-white">
              <tr>
                <th class="p-3">#</th>
                <th class="p-3">Name</th>
                <th class="p-3">Email</th>
                <th class="p-3">Role</th>
                <th class="p-3">Created</th>
                <th class="p-3">Updated</th>
                <th class="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(user, i) in users"
                :key="user.id"
                class="border-t hover:bg-gray-50 transition"
              >
                <td class="p-3">{{ i + 1 }}</td>
                <td class="p-3 font-medium">
                  {{ user.first_name }} {{ user.lastname }}
                </td>
                <td class="p-3">{{ user.email }}</td>
                <td class="p-3 capitalize">{{ user.role }}</td>
                <td class="p-3">{{ formatDate(user.created_at) }}</td>
                <td class="p-3">{{ formatDate(user.updated_at) }}</td>
                <td class="p-3">
                  <button
                    @click="deleteUser(user.user_id)"
                    class="text-white bg-red-400 hover:bg-red-600 font-semibold rounded-2xl cursor-pointer w-20 h-10"
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { RouterLink } from "vue-router";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const stats = ref({ total: 0, admins: 0, users: 0 });
const users = ref([]);
console.log("API_BASE_URL:", API_BASE_URL);
console.log("VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
onMounted(async () => {
  const res = await axios.get("http://172.20.10.2:5001/users/gets/user");
  users.value = res.data;

  stats.value.total = users.value.length;
  stats.value.admins = users.value.filter((u) => u.role === "admin").length;
  stats.value.users = users.value.filter((u) => u.role === "user").length;
});

async function deleteUser(id) {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "Do you want to delete this user?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e3342f",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    showCloseButton: true,
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`http://172.20.10.2/users/delete/${id}`);
      users.value = users.value.filter((u) => u.user_id !== id);
      Swal.fire(
        "Successful!",
        "The user has been successfully removed.",
        "success"
      );
    } catch (error) {
      Swal.fire("Error!", "ไม่สามารถลบผู้ใช้ได้", "error");
      console.error("❌ Error deleting user:", error);
    }
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return isNaN(date) ? "N/A" : date.toLocaleString();
}
</script>

<style scoped>
table th,
table td {
  text-align: left;
  white-space: nowrap;
}
</style>
