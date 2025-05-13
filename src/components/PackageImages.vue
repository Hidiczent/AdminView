<template>
    <div class="my-6">
      <h2 class="text-xl font-bold text-gray-800 mb-4">📷 Package Images</h2>
  
      <div v-if="images.length === 0" class="text-gray-400 mb-4">
        No images found.
      </div>
  
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div v-for="img in images" :key="img.image_id" class="relative group">
          <img
            :src="img.image_url"
            alt="package"
            class="w-full h-40 object-cover rounded-xl mb-2"
          />
          <input
            v-model="img.image_url"
            class="input text-sm mb-2"
            placeholder="Edit image URL"
          />
          <div class="flex gap-2">
            <button
              @click="updateImage(img.image_id, img.image_url)"
              class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm w-full"
            >
              💾 Save
            </button>
            <button
              @click="deleteImage(img.image_id)"
              class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm w-full"
            >
              🗑 Delete
            </button>
          </div>
        </div>
      </div>
  
      <div>
        <label class="block font-semibold text-gray-700 mb-1">
          Add Images (comma separated URLs)
        </label>
        <input
          v-model="imageInput"
          placeholder="https://example.com/image1.jpg, ..."
          class="input"
        />
        <button
          @click="uploadImages"
          class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Upload
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'
  import axios from 'axios'
  import Swal from 'sweetalert2'
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

  const props = defineProps({ packageId: Number })
  const images = ref([])
  const imageInput = ref("")
  
  const fetchImages = async () => {
    try {
      const res = await axios.get(`http://192.168.80.141:5002/packageImage/package-images/${props.packageId}`)
      images.value = res.data
    } catch (err) {
      console.error('❌ Failed to fetch images:', err)
    }
  }
  
  const deleteImage = async (id) => {
  try {
    await axios.delete(`http://192.168.80.141:5002/packageImage/package-image/${id}`)
    images.value = images.value.filter(img => img.image_id !== id)
    Swal.fire("Deleted", "Image deleted successfully", "success")
  } catch (err) {
    console.error('❌ Failed to delete image:', err)
    Swal.fire("Error", "Failed to delete image", "error")
  }
}

  
  const uploadImages = async () => {
    const imageUrls = imageInput.value
      .split(',')
      .map(url => url.trim())
      .filter(url => url)
  
    if (imageUrls.length === 0) return
  
    try {
      await axios.post("http://192.168.80.141:5002/packageImage/package-image", {
        package_id: props.packageId,
        image_url: imageUrls
      })
      imageInput.value = ''
      await fetchImages()
      Swal.fire("Uploaded", "Images uploaded successfully", "success")
    } catch (err) {
      console.error("❌ Failed to upload images:", err)
      Swal.fire("Error", "Failed to upload images", "error")
    }
  }
  
  const updateImage = async (id, url) => {
    try {
      await axios.put(`http://192.168.80.141:5002/packageImage/package-image/${id}`, {
        image_url: url
      })
      Swal.fire("Updated", "Image updated successfully", "success")
    } catch (err) {
      console.error("❌ Failed to update image:", err)
      Swal.fire("Error", "Failed to update image", "error")
    }
  }
  
  onMounted(fetchImages)
  watch(() => props.packageId, fetchImages)
  </script>
  
  <style scoped>
  .input {
    @apply w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400;
  }
  </style>
  