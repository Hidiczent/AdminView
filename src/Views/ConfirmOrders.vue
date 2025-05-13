<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold text-center mb-6 text-gray-800">
      📝 Pending Orders
    </h1>

    <div v-if="orders.length === 0" class="text-center text-gray-500">
      No pending orders found.
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="order in orders"
        :key="order.order_id"
        class="bg-white rounded-xl shadow-md p-4"
      >
        <h2 class="text-lg font-semibold mb-2 text-gray-800">
          Order ID: {{ order.order_id }}
        </h2>
        <p class="text-gray-600 mb-1">📦 {{ order.package_title }}</p>
        <p class="text-gray-600 mb-1">
          👤 {{ order.first_name }} {{ order.last_name }}
        </p>
        <p class="text-gray-600">📧 {{ order.email || "N/A" }}</p>
        <p class="text-gray-600 mb-2">📅 {{ formatDate(order.order_date) }}</p>

        <!-- Show Order Status with Color -->
        <div class="text-sm font-semibold">
          <span
            :class="{
              'text-orange-500':
                order.order_status?.toLowerCase() === 'pending',
              'text-red-500': order.order_status?.toLowerCase() === 'cancelled',
              'text-green-500':
                order.order_status?.toLowerCase() === 'confirmed',
            }"
          >
            {{ order.order_status }}
          </span>
        </div>

        <div class="flex gap-2 mt-3">
          <div v-if="order.order_status?.toLowerCase() === 'pending'">
            <button
              @click="confirm(order.order_id)"
              class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              :disabled="order.order_status?.toLowerCase() === 'cancelled'"
            >
              Confirm
            </button>
          </div>
          <div v-else-if="order.order_status?.toLowerCase() === 'cancelled'">
            <span class="text-gray-500">❌ Cancelled</span>
          </div>
          <div v-else>
            <span class="text-green-600 font-semibold">✅ Confirmed</span>
          </div>

          <button
            @click="showDetails(order)"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View
          </button>

          <!-- Cancel Button for Admin -->
          <div v-if="order.order_status?.toLowerCase() !== 'cancelled'">
            <button
              @click="cancelOrderByAdmin(order.order_id)"
              class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="selectedOrder"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
        <button
          @click="selectedOrder = null"
          class="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl"
        >
          ×
        </button>
        <h2 class="text-xl font-bold mb-4 text-gray-800">📋 Booking Details</h2>
        <p><strong>Package:</strong> {{ selectedOrder.package_title }}</p>
        <p>
          <strong>Name:</strong> {{ selectedOrder.first_name }}
          {{ selectedOrder.last_name }}
        </p>
        <p><strong>Email:</strong> {{ selectedOrder.email || "N/A" }}</p>
        <p><strong>Birth:</strong> {{ formatDateOnly(selectedOrder.Birth) }}</p>
        <p>
          <strong>Number of Participants:</strong>
          {{ selectedOrder.Number_of_participants || "N/A" }}
        </p>
        <p>
          <strong>PassPort Number:</strong>
          {{ selectedOrder.Number_of_pass_port || "N/A" }}
        </p>
        <p><strong>Note:</strong> {{ selectedOrder.Note || "N/A" }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const orders = ref([]);
const selectedOrder = ref(null);

const fetchPendingOrders = async () => {
  try {
    const res = await axios.get(
      "http://192.168.80.141:5002/orders/orders/admin-view"
    );
    orders.value = res.data.filter((o) =>
      ["pending", "confirmed", "cancelled"].includes(
        o.order_status?.toLowerCase()
      )
    );
  } catch (err) {
    console.error("❌ Failed to fetch orders:", err);
  }
};

const confirm = async (id) => {
  const result = await Swal.fire({
    title: "Confirm Order?",
    text: `Are you sure you want to confirm order #${id}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    buttonsStyling: false,
    customClass: {
      confirmButton:
        "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-8",
      cancelButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600",
    },
  });
  if (result.isConfirmed) {
    try {
      await axios.post(`http://192.168.80.141:5002/orders/orders/confirm/${id}`);      Swal.fire("Confirmed!", "Order has been confirmed.", "success");
      fetchPendingOrders();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.error || "Failed to confirm order.",
        "error"
      );
    }
  }
};

const cancelOrderByAdmin = async (orderId) => {
  const result = await Swal.fire({
    title: "Cancel Order?",
    text: `Are you sure you want to cancel order #${orderId}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Cancel Order",
    cancelButtonText: "Cancel",
    buttonsStyling: false,
    customClass: {
      confirmButton:
        "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-8",
      cancelButton:
        "bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600",
    },
  });

  if (result.isConfirmed) {
    try {
      await axios.put(`http://192.168.80.141:5002/orders/admin/cancel/${orderId}`);
      Swal.fire("Cancelled!", "Order has been cancelled.", "success");
      fetchPendingOrders();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.error || "Failed to cancel order.",
        "error"
      );
    }
  }
};

const showDetails = (order) => {
  selectedOrder.value = order;
};

const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

const formatDateOnly = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-GB"); // แสดงในรูปแบบ dd/mm/yyyy
};
onMounted(fetchPendingOrders);
</script>

<style scoped>
/* Feel free to customize */
</style>
