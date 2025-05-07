<template>
    <div class="flex min-h-screen bg-gray-100">
      <!-- Sidebar -->
      <aside class="w-64 bg-white text-[#0a5a9a] p-6 shadow-md">
        <h2 class="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
        <nav class="flex flex-col space-y-2">
          <RouterLink
            to="/home"
            class="py-2 px-4 rounded hover:bg-[#0a5a9a] hover:text-white transition"
            active-class="bg-[#0a5a9a] text-white"
          >
            🏠 Dashboard
          </RouterLink>
          <RouterLink
            to="/show-package"
            class="py-2 px-4 rounded hover:bg-[#0a5a9a] hover:text-white transition"
            active-class="bg-[#0a5a9a] text-white"
          >
            📦 Packages
          </RouterLink>
          <RouterLink
            to="/add-package"
            class="py-2 px-4 rounded hover:bg-[#0a5a9a] hover:text-white transition"
            active-class="bg-[#0a5a9a] text-white"
          >
            ➕ Add Package
          </RouterLink>
        </nav>
      </aside>
  
      <!-- Main Content -->
      <main class="flex-1 p-8">
        <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">
          📦 All Packages
        </h1>
  
        <div v-if="packages.length === 0" class="text-center text-gray-500">
          No packages available.
        </div>
  
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div
            v-for="pkg in packages"
            :key="pkg.package_id"
            class="bg-white p-4 rounded-2xl shadow-md"
          >
            <img
              :src="pkg.main_image_url"
              alt="package image"
              class="w-full h-40 object-cover rounded-xl mb-4"
            />
            <h2 class="text-xl font-semibold text-gray-800 mb-2">
              {{ pkg.title }}
            </h2>
            <p class="text-sm text-gray-500 mb-2">
              {{ pkg.about?.substring(0, 100) }}...
            </p>
            <p class="text-lg text-blue-600 font-bold mb-2">
              $ {{ pkg.price_in_usd }}
            </p>
            <p class="text-sm text-gray-400">
              People Limit: {{ pkg.people_limit }}
            </p>
            <button
              @click="goToEdit(pkg.package_id)"
              class="mt-3 w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-xl"
            >
              ✏️ Edit
            </button>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  const packages = ref([]);
  
  onMounted(async () => {
    try {
      const res = await axios.get("http://192.168.80.141:5001/packages/packages");
      packages.value = res.data;
    } catch (err) {
      console.error("❌ Failed to fetch packages:", err);
    }
  });
  
  function goToEdit(id) {
    router.push(`/edit-package/${id}`);
  }
  </script>
  