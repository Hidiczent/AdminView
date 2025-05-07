<template>
    <div class="p-8 bg-gray-100 min-h-screen">
        <h1 class="text-3xl font-bold mb-6 text-gray-800 text-center"> Admin Dashboard</h1>

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
            <h2 class="text-2xl font-semibold mb-4 text-gray-800">📋 Recent Registered Users</h2>
            <div class="overflow-x-auto">
                <table class="min-w-full text-sm text-left text-gray-700">
                    <thead class="bg-[#084886] rounded-2xl sticky top-0 ">
                        <tr>
                            <th class="p-3 text-[#FFFF]">#</th>
                            <th class="p- text-[#FFFF]">Name</th>
                            <th class="p-3 text-[#FFFF]">Email</th>
                            <th class="p-3 text-[#FFFF]">Role</th>
                            <th class="p-3 text-[#FFFF]">Created</th>
                            <th class="p-3 text-[#FFFF]">Updated</th>
                            <th class="p-3 text-[#FFFF]">Actions</th> <!-- ✅ เพิ่มคอลัมน์ Actions -->
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(user, i) in users" :key="user.id" class="border-t hover:bg-gray-50 transition">
                            <td class="p-3">{{ i + 1 }}</td>
                            <td class="p-3 font-medium">{{ user.first_name }} {{ user.lastname }}</td>
                            <td class="p-3">{{ user.email }}</td>
                            <td class="p-3 capitalize">{{ user.role }}</td>
                            <td class="p-3">{{ formatDate(user.created_at) }}</td>
                            <td class="p-3">{{ formatDate(user.updated_at) }}</td>
                            <td class="p-3">
                                <button @click="deleteUser(user.id)"
                                    class=" text-white bg-red-400 hover:bg-red-600 font-semibold rounded-2xl cursor-pointer w-20 h-10">
                                    🗑 Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const stats = ref({ total: 0, admins: 0, users: 0 })
const users = ref([])

onMounted(async () => {
    const res = await axios.get('http://192.168.243.213:5000/users')
    console.log('📦 users data:', res.data)  // << ตรงนี้!
    users.value = res.data

    stats.value.total = users.value.length
    stats.value.admins = users.value.filter(u => u.role === 'admin').length
    stats.value.users = users.value.filter(u => u.role === 'user').length
})
async function deleteUser(id) {
    const result = await Swal.fire({
        title: 'are you sure?',
        text: 'do you want to delete user?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e3342f',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Confirm',
        cancelButtonText: 'cancle',
        showCloseButton: true,
        // showCancelButton: true,


    })

    if (result.isConfirmed) {
        try {
            await axios.delete(`http://192.168.243.213:5000/users/${id}`)
            users.value = users.value.filter(u => u.id !== id)

            Swal.fire({
                title: 'Succesful!',
                text: 'The user has been successfully removed.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            })
        } catch (error) {
            Swal.fire('Errors!', 'ไม่สามารถลบผู้ใช้ได้', 'error')
            console.error("❌ Error deleting user:", error)
        }
    }
}
function formatDate(dateStr) {
    const date = new Date(dateStr)
    return isNaN(date) ? 'N/A' : date.toLocaleString()
}
</script>

<style scoped>
table th,
table td {
    text-align: left;
    white-space: nowrap;
}
</style>