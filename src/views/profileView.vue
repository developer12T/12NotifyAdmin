<template>
  <div class="p-4 sm:ml-32">
    <div class="p-4 mt-14">
  <div class="container mx-auto p-4">
    <div class="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
      <!-- Header with cover background -->
      <div class="h-32 bg-gradient-to-r  from-[#00569D] to-[#5990BF]"></div>

      <!-- Profile Section -->
      <div class="flex flex-col md:flex-row -mt-16 px-4 pb-6">
        <!-- Profile Image -->
        <div class="md:ml-4 flex justify-center md:justify-start">
          <img
              :src="userData.imgUrl"
              :alt="userData.fullName"
              class="h-32 w-32 rounded-full border-4 border-white shadow-md object-cover"
              @error="handleImageError"
          />
        </div>

        <!-- Profile Info -->
        <div class="md:ml-8 mt-6 md:mt-0 text-center md:text-left">
          <h1 class="text-2xl font-semibold text-white">{{ userData.fullName }}</h1>
          <h2 class="text-lg font-medium text-white">{{ userData.fullNameThai }}</h2>
          <p class="text-gray-500 mt-2">{{ userData.positon }} - {{ userData.department }}</p>
          <p class="text-gray-500">{{ userData.company }}</p>
        </div>
      </div>

      <!-- Detail Section -->
      <div class="px-6 pb-8">
        <h3 class="text-xl font-semibold border-b pb-2 mb-4">รายละเอียดพนักงาน</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col">
            <p class="text-sm text-gray-500">รหัสพนักงาน</p>
            <p class="font-medium">{{ userData.employeeID }}</p>
          </div>

          <div class="flex flex-col">
            <p class="text-sm text-gray-500">ชื่อผู้ใช้งาน</p>
            <p class="font-medium">{{ userData.userName }}</p>
          </div>

          <div class="flex flex-col">
            <p class="text-sm text-gray-500">ชื่อ</p>
            <p class="font-medium">{{ userData.firstName }}</p>
          </div>

          <div class="flex flex-col">
            <p class="text-sm text-gray-500">นามสกุล</p>
            <p class="font-medium">{{ userData.lastName }}</p>
          </div>

          <div class="flex flex-col md:col-span-2">
            <p class="text-sm text-gray-500">อีเมล</p>
            <p class="font-medium">
              <a :href="`mailto:${userData.mail}`" class="text-blue-500 hover:underline">
                {{ userData.mail }}
              </a>
            </p>
          </div>

          <div class="flex flex-col">
            <p class="text-sm text-gray-500">สถานะ</p>
            <p class="font-medium">
              <span
                  :class="userData.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ userData.status === 1 ? 'ใช้งาน' : 'ไม่ใช้งาน' }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Function to handle broken images
const handleImageError = (event) => {
  // Replace broken image with a default placeholder
  event.target.src = 'https://via.placeholder.com/40';
};

// Define reactive state with default values
const userData = ref({
  company: '',
  department: '',
  employeeID: '',
  firstName: '',
  fullName: '',
  fullNameThai: '',
  imgUrl: '',
  lastName: '',
  mail: '',
  positon: '', // Note: there's a typo here (positon vs position)
  status: 0,
  userName: ''
});

// Function to load user data
const loadUserData = () => {
  const userDataString = localStorage.getItem('user');

  if (userDataString) {
    try {
      const parsedData = JSON.parse(userDataString);
      userData.value = parsedData;
      console.log('User data:', userData.value);
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
    }
  }
};

// Call the function when component is mounted
onMounted(() => {
  loadUserData();
});
</script>
