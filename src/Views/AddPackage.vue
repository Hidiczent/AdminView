<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold mb-6 text-gray-800 text-center">
      Create New Package
    </h1>

    <form
      @submit.prevent="submitPackage"
      class="space-y-4 bg-white p-6 rounded-2xl shadow-md max-w-3xl mx-auto"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          v-model="form.title"
          placeholder="Title"
          class="input"
          required
        />
        <input
          v-model="form.main_image_url"
          placeholder="Image URL"
          class="input"
        />
        <input
          v-model="form.price_in_usd"
          type="number"
          placeholder="Price (USD)"
          class="input"
        />
        <input
          v-model="form.added_person_price_in_usd"
          type="number"
          placeholder="Extra Person Price"
          class="input"
        />
        <input
          v-model="form.people_limit"
          type="number"
          placeholder="People Limit"
          class="input"
        />

        <select v-model="form.guide_id" class="input">
          <option :value="null">-- Select Guide --</option>
          <option v-for="g in guides" :key="g.guide_id" :value="g.guide_id">
            {{ g.first_name }} {{ g.last_name }}
          </option>
        </select>

        <select v-model="form.accommodation_id" class="input">
          <option :value="null">-- Select Accommodation --</option>
          <option
            v-for="a in accommodations"
            :key="a.accommodation_id"
            :value="a.accommodation_id"
          >
            {{ a.name }}
          </option>
        </select>

        <select v-model="form.transportation_id" class="input">
          <option :value="null">-- Select Transportation --</option>
          <option
            v-for="t in transportations"
            :key="t.transportation_id"
            :value="t.transportation_id"
          >
            {{ t.type }}
          </option>
        </select>

        <select v-model="form.food_id" class="input">
          <option :value="null">-- Select Food --</option>
          <option v-for="f in foods" :key="f.food_id" :value="f.food_id">
            {{ f.name_food }}
          </option>
        </select>

        <select v-model="form.type_package_id" class="input">
          <option :value="null">-- Select Package Type --</option>
          <option
            v-for="tp in packageTypes"
            :key="tp.type_package_id"
            :value="tp.type_package_id"
          >
            {{ tp.name }}
          </option>
        </select>

        <select v-model="form.village_id" class="input">
          <option :value="null">-- Select Village --</option>
          <option
            v-for="v in villages"
            :key="v.village_id"
            :value="v.village_id"
          >
            {{ v.name }}
          </option>
        </select>
      </div>

      <textarea v-model="form.about" placeholder="About" class="input h-28" />
      <textarea
        v-model="form.activities"
        placeholder="Activities"
        class="input h-28"
      />
      <textarea
        v-model="form.tour_info"
        placeholder="Tour Info (JSON format)"
        class="input h-28"
      />
      <textarea
        v-model="form.bring"
        placeholder="Bring (JSON format)"
        class="input h-28"
      />

      <div class="flex gap-4">
        <select v-model="form.available_type" class="input w-1/2">
          <option disabled value="">Select Availability</option>
          <option value="DAYS">DAYS</option>
          <option value="MONTH">MONTH</option>
        </select>
        <input
          v-model="form.available_date"
          placeholder="Available Date(s)"
          class="input w-1/2"
        />
      </div>
      <input
        v-model="form.available_day"
        placeholder="Available Day(s)"
        class="input"
      />

      <button
        type="submit"
        class="mt-6 bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-xl w-full"
      >
        ➕ Add Package
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

const form = ref({
  title: "",
  main_image_url: "",
  about: "",
  price_in_usd: "",
  added_person_price_in_usd: "",
  tour_info: "",
  activities: "",
  guide_id: null,
  accommodation_id: null,
  transportation_id: null,
  available_type: "",
  available_date: "",
  available_day: "",
  food_id: null,
  type_package_id: null,
  village_id: null,
  people_limit: "",
  bring: "",
});

const accommodations = ref([]);
const guides = ref([]);
const transportations = ref([]);
const foods = ref([]);
const packageTypes = ref([]);
const villages = ref([]);

onMounted(async () => {
  accommodations.value = (
    await axios.get("http://192.168.80.141:5001/accommodation/gets")
  ).data;
  guides.value = (
    await axios.get("http://192.168.80.141:5001/guide/guide")
  ).data;
  transportations.value = (
    await axios.get("http://192.168.80.141:5001/transportation/gets")
  ).data;
  foods.value = (await axios.get("http://192.168.80.141:5001/food/food")).data;
  packageTypes.value = (
    await axios.get("http://192.168.80.141:5001/kindofpackage/kind-of-package")
  ).data;
  villages.value = (
    await axios.get("http://192.168.80.141:5001/village/gets")
  ).data;
});

const submitPackage = async () => {
  try {
    let tourInfoParsed, bringParsed;
    try {
      tourInfoParsed = JSON.parse(form.value.tour_info || "[]");
      bringParsed = JSON.parse(form.value.bring || "{}");
    } catch (e) {
      Swal.fire(
        "❌ Invalid JSON",
        "กรุณาตรวจสอบ Tour Info หรือ Bring ให้ถูกต้อง",
        "error"
      );
      return;
    }

    const payload = {
      ...form.value,
      tour_info: tourInfoParsed,
      bring: bringParsed,
    };

    console.log("✅ Payload before sending:", payload);

    await axios.post("http://192.168.80.141:5001/packages/package", payload);
    Swal.fire("✅ Success", "Package created!", "success");
    form.value = {};
  } catch (err) {
    Swal.fire(
      "❌ Error",
      err.response?.data?.error || "Failed to create package",
      "error"
    );
    console.error("❌ Backend error:", err.response?.data || err);
  }
};
</script>

<style scoped>
.input {
  @apply w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400;
}
</style>
