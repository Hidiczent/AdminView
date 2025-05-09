<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">
      ✏️ Edit Package
    </h1>

    <form
      v-if="form"
      @submit.prevent="updatePackage"
      class="space-y-4 bg-white p-6 rounded-2xl shadow-md max-w-3xl mx-auto"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block mb-1 font-semibold text-gray-700">Title</label>
          <input
            v-model="form.title"
            placeholder="Title"
            class="input"
            required
          />
        </div>
        <div>
          <label class="block mb-1 font-semibold text-gray-700"
            >Sub Image URL</label
          >

          <button
            class="mb-4 bg-indigo-500 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl"
            @click="showImages = !showImages"
          >
            {{ showImages ? "Hide Sub Images" : "Show Sub Images" }}
          </button>

          <PackageImageManager
            v-if="showImages"
            :packageId="parseInt(route.params.id)"
          />
        </div>

        <div>
          <label class="block mb-1 font-semibold text-gray-700"
            >Main Image URL</label
          >
          <input
            v-model="form.main_image_url"
            placeholder="Image URL"
            class="input"
          />
        </div>

        <div>
          <label class="block mb-1 font-semibold text-gray-700"
            >Price (USD)</label
          >
          <input
            v-model="form.price_in_usd"
            type="number"
            placeholder="Price (USD)"
            class="input"
          />
        </div>

        <div>
          <label class="block mb-1 font-semibold text-gray-700"
            >Extra Person Price</label
          >
          <input
            v-model="form.added_person_price_in_usd"
            type="number"
            placeholder="Extra Person Price"
            class="input"
          />
        </div>

        <div>
          <label class="block mb-1 font-semibold text-gray-700"
            >People Limit</label
          >
          <input
            v-model="form.people_limit"
            type="number"
            placeholder="People Limit"
            class="input"
          />
        </div>

        <div>
          <label class="block mb-1 font-semibold text-gray-700">Guide ID</label>
          <input
            v-model="form.guide_id"
            type="number"
            placeholder="Guide ID"
            class="input"
          />
        </div>

        <div>
          <label class="block mb-1 font-semibold text-gray-700"
            >Accommodation ID</label
          >
          <input
            v-model="form.accommodation_id"
            type="number"
            placeholder="Accommodation ID"
            class="input"
          />
        </div>

        <div>
          <label class="block mb-1 font-semibold text-gray-700"
            >Transportation ID</label
          >
          <input
            v-model="form.transportation_id"
            type="number"
            placeholder="Transportation ID"
            class="input"
          />
        </div>

        <div>
          <label class="block mb-1 font-semibold text-gray-700">Food ID</label>
          <input
            v-model="form.food_id"
            type="number"
            placeholder="Food ID"
            class="input"
          />
        </div>

        <div>
          <label class="block mb-1 font-semibold text-gray-700"
            >Type Package ID</label
          >
          <input
            v-model="form.type_package_id"
            type="number"
            placeholder="Type Package ID"
            class="input"
          />
        </div>

        <div>
          <label class="block mb-1 font-semibold text-gray-700"
            >Village ID</label
          >
          <input
            v-model="form.village_id"
            type="number"
            placeholder="Village ID"
            class="input"
          />
        </div>
      </div>

      <div class="mt-4 space-y-3">
        <div>
          <label class="block mb-1 font-semibold text-gray-700">About</label>
          <textarea
            v-model="form.about"
            placeholder="About"
            class="input h-28"
          />
        </div>

        <div>
          <label class="block mb-1 font-semibold text-gray-700"
            >Activities</label
          >
          <textarea
            v-model="form.activities"
            placeholder="Activities"
            class="input h-28"
          />
        </div>

        <div>
          <label class="block mb-1 font-semibold text-gray-700"
            >Tour Info (JSON)</label
          >
          <textarea
            v-model="form.tour_info"
            placeholder="Tour Info"
            class="input h-28"
          />
        </div>

        <div>
          <label class="block mb-1 font-semibold text-gray-700"
            >Bring (JSON)</label
          >
          <textarea
            v-model="form.bring"
            placeholder="Bring"
            class="input h-28"
          />
        </div>

        <div class="flex gap-4">
          <div class="w-1/2">
            <label class="block mb-1 font-semibold text-gray-700"
              >Available Type</label
            >
            <select v-model="form.available_type" class="input">
              <option disabled value="">Select Availability</option>
              <option value="DAYS">DAYS</option>
              <option value="MONTH">MONTH</option>
            </select>
          </div>

          <div class="w-1/2">
            <label class="block mb-1 font-semibold text-gray-700"
              >Available Date(s)</label
            >
            <input
              v-model="form.available_date"
              placeholder="Available Date(s)"
              class="input"
            />
          </div>
        </div>

        <div>
          <label class="block mb-1 font-semibold text-gray-700"
            >Available Day(s)</label
          >
          <input
            v-model="form.available_day"
            placeholder="Available Day(s)"
            class="input"
          />
        </div>
      </div>

      <button
        type="submit"
        class="mt-6 bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-6 rounded-xl w-full"
      >
        💾 Save Changes
      </button>
    </form>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";
import PackageImageManager from "../components/PackageImages.vue";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const route = useRoute();
const router = useRouter();
const form = ref(null);
const originalForm = ref(null);
const showImages = ref(false);

onMounted(async () => {
  try {
    const id = route.params.id;
    const res = await axios.get(`http://172.20.10.2:5001/packages/package/${id}`);

    const parsedForm = {
      ...res.data,
      tour_info: JSON.stringify(res.data.tour_info ?? {}, null, 2),
      bring: JSON.stringify(res.data.bring ?? {}, null, 2),
    };

    form.value = parsedForm;
    originalForm.value = JSON.stringify(parsedForm); // Save a snapshot
  } catch (err) {
    console.error("❌ Failed to load package:", err);
  }
});

async function updatePackage() {
  try {
    const id = route.params.id;

    const payload = {
      ...form.value,
      tour_info: JSON.parse(form.value.tour_info || "{}"),
      bring: JSON.parse(form.value.bring || "{}"),
    };

    // Compare current edited form with original snapshot
    const currentSnapshot = JSON.stringify({
      ...form.value,
      tour_info: form.value.tour_info.trim(),
      bring: form.value.bring.trim(),
    });

    if (currentSnapshot === originalForm.value) {
      Swal.fire("ℹ️ No Changes", "You haven't made any changes.", "info");
      return;
    }

    await axios.put(`http://172.20.10.2:5001/packages/package/${id}`, payload);

    Swal.fire("✅ Success", "Package updated!", "success");
    originalForm.value = currentSnapshot; // update original for next edit
    router.push("/show-package");
  } catch (err) {
    Swal.fire("❌ Error", err.response?.data?.error || "Update failed", "error");
    console.error("❌ Update error:", err);
  }
}
</script>

<style scoped>
.input {
  @apply w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400;
}
</style>
