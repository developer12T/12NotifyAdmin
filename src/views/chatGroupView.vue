<template>
  <div class="p-4 sm:ml-32">
    <div class="p-4 mt-14">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-start justify-between gap-2">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">จัดการกลุ่มแชท</h1>
          <!-- Sorting -->
          <select
            v-model="sortBy"
            class="input-equal-height bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-auto p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="newest">ใหม่ล่าสุด</option>
            <option value="oldest">เก่าสุด</option>
            <option value="name">ตามชื่อกลุ่ม</option>
          </select>

          <div class="flex justify-center  px-1">
            <form class="max-w-md mx-auto">
              <label for="default-search"
                class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
              <div class="relative">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                  </svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  v-model="searchQuery"
                  class="input-equal-height block w-full p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="ค้นหาประกาศ..."
                />
              </div>
            </form>
          </div>
        </div>



        <button @click="openCreateModal"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
          <i class="fas fa-plus mr-2"></i>สร้างกลุ่มใหม่
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading"
        class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl flex flex-col items-center min-w-[200px]">
          <div class="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mb-3"></div>
          <p class="text-gray-700 dark:text-gray-300 font-medium">กำลังโหลด...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="rooms.length === 0" class="text-center py-12">
        <i class="fas fa-users text-4xl text-gray-400 mb-4"></i>
        <p class="text-gray-500 dark:text-gray-400">ยังไม่มีกลุ่มแชท</p>
      </div>

      <!-- Rooms List -->
      <div v-else class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">ชื่อกลุ่ม</th>
              <th scope="col" class="px-6 py-3">คำอธิบาย</th>
              <th scope="col" class="px-6 py-3">ผู้ดูแล</th>
              <th scope="col" class="px-6 py-3">เจ้าของ</th>
              <th scope="col" class="px-1 py-3">จำนวนสมาชิก</th>
              <th scope="col" class="px-1 py-3 text-center">วันที่สร้าง</th>
              <th scope="col" class="px-1 py-3 text-center">อัพเดตล่าสุด</th>
              <!--              <th scope="col" class="px-6 py-3">สถานะ</th>-->
              <th scope="col" class="px-6 py-3">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="room in filteredRooms" :key="room.id"
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: room.color }"></div>
                  <span class="font-medium text-gray-900 dark:text-white cursor-pointer" @click="openEditModal(room)">
                    {{ room.name }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="cursor-pointer" @click="openEditModal(room)">{{ room.description }}</span>
              </td>
              <td class="px-6 py-4">{{ room.admin }}</td>
              <td class="px-6 py-4">{{ room.owner }}</td>
              <td class="px-6 py-4 text-right">
                <span class="inline-flex items-center  gap-1">
                  {{ room.totalMembers }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <span class="inline-flex items-center  gap-1">
                  {{ room.createdAt }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <span class="inline-flex items-center  gap-1">
                  {{ room.updatedAt }}
                </span>
              </td>
              <!--              <td class="px-6 py-4">-->
              <!--                <label class="relative inline-flex items-center cursor-pointer">-->
              <!--                  <input type="checkbox"-->

              <!--                         @click=""-->
              <!--                         class="sr-only peer">-->
              <!--                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>-->
              <!--                </label>-->
              <!--              </td>-->
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button @click="openEditModal(room)"
                    class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    <Icon icon="mdi:pencil" width="24" height="24" />
                  </button>
                  <button @click="confirmDelete(room)"
                    class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                    <Icon icon="mdi:delete" width="24" height="24" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Create Room Modal -->
      <div v-if="showCreateModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white dark:bg-gray-800">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              สร้างกลุ่มใหม่
            </h3>
            <button @click="closeCreateModal"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form @submit.prevent="createRoom()">
            <div class="mb-4">
              <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ชื่อกลุ่ม</label>
              <input type="text" id="name" v-model="currentRoom.name" required
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="กรอกชื่อกลุ่ม">
            </div>
            <div class="mb-4">
              <label for="description"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">คำอธิบาย</label>
              <textarea id="description" v-model="currentRoom.description" required rows="4"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="กรอกคำอธิบายกลุ่ม"></textarea>
            </div>
            <div class="mb-4">
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                for="small_size">รูปภาพกลุ่ม</label>
              <input
                class="block w-full mb-5 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                @change="onRoomImageChange" accept="image/*" id="small_size" type="file">
            </div>
            <div class="mb-4">
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">สีกลุ่ม</label>
              <div class="flex flex-wrap gap-2">
                <div v-for="color in colorOptions" :key="color" :style="{ backgroundColor: color }"
                  class="w-8 h-8 rounded-full cursor-pointer border-2 transition"
                  :class="currentRoom.color === color ? 'border-blue ring-2 ring-blue' : 'border-gray-300'"
                  @click="currentRoom.color = color"></div>
              </div>
            </div>
            <div class="mb-4">
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ผู้ใช้งาน</label>
              <div class="flex flex-wrap gap-2 relative">
                <!-- Custom dropdown with images -->
                <div
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 cursor-pointer"
                  @click="showUserDropdown = !showUserDropdown">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <img v-if="selectedUser && userStore.getUserById(selectedUser)?.imgUrl"
                        :src="userStore.getUserById(selectedUser)?.imgUrl" class="w-6 h-6 rounded-full object-cover"
                        alt="User profile" />
                      <span v-if="selectedUser">
                        {{ userStore.getUserById(selectedUser)?.fullNameThai || 'ไม่พบข้อมูล' }} ({{ selectedUser }})
                      </span>
                      <span v-else>เลือกผู้ใช้งาน</span>
                    </div>
                    <Icon icon="mdi:chevron-down" width="20" height="20" />
                  </div>
                </div>

                <!-- Dropdown options -->
                <div v-if="showUserDropdown"
                  class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto dark:bg-gray-700 dark:border-gray-600">
                  <!-- Search input -->
                  <div class="sticky top-0 p-2 bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Icon icon="mdi:magnify" class="text-gray-500 dark:text-gray-400" width="20" height="20" />
                      </div>
                      <input type="text" v-model="userSearchQuery"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="ค้นหาผู้ใช้..." @click.stop />
                    </div>
                  </div>

                  <div v-for="user in filteredActiveUsers" :key="user.employeeID" @click="selectUser(user.employeeID)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center gap-2">
                    <img :src="user.imgUrl" class="w-8 h-8 rounded-full object-cover" alt="User profile"
                      @error="handleImageError" />
                    <div>
                      <div class="text-gray-900 dark:text-white">
                        {{ user.fullNameThai }}
                        <span class="text-gray-500 text-xs" v-if="user.positon">{{ user.positon }} <span
                            class="text-gray-500">: {{ user.department }}</span></span>
                      </div>
                      <div class="text-gray-500 dark:text-gray-400 text-xs">{{ user.employeeID }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mb-4">
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ผู้ใช้ที่เลือก</label>
              <div class="relative overflow-x-auto overflow-y-auto h-[250px]">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" class="px-6 py-3">
                        ชื่อผู้ใช้
                      </th>
                      <!--                    <th scope="col" class="px-6 py-3">-->
                      <!--                      รหัสพนักงาน-->
                      <!--                    </th>-->
                      <th scope="col" class="px-6 py-3">
                        สิทธิ์
                      </th>
                      <th scope="col" class="px-6 py-3">

                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="member in currentRoom.members" :key="member.empId"
                      class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                      <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <div class="flex items-center gap-2">
                          <img :src="getUserImage(member.empId)" class="w-8 h-8 rounded-full object-cover"
                            alt="User profile" @error="handleImageError" />
                          <div class="flex items-center gap-2">
                            <span>{{ getUserName(member.empId) }}</span>
                            <span v-if="member.role === 'bot'"
                              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              <Icon icon="mdi:robot" class="mr-1" width="16" height="16" />
                              Bot
                            </span>
                          </div>
                        </div>
                      </th>
                      <!--                    <td class="px-6 py-4">-->
                      <!--                      {{ member.empId }}-->
                      <!--                    </td>-->
                      <td class="px-6 py-4">
                        <select v-model="member.role" :disabled="member.role === 'bot'"
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          :class="{ 'opacity-50 cursor-not-allowed': member.role === 'bot' }">
                          <option value="owner">เจ้าของ</option>
                          <option value="admin">ผู้ดูแล</option>
                          <option value="User">สมาชิก</option>
                          <option value="bot">Bot</option>
                        </select>
                      </td>
                      <td class="px-6 py-4">
                        <button v-if="member.role !== 'bot'" @click="removeMember(member.empId)"
                          class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                          <Icon icon="mdi:delete" width="24" height="24" />
                        </button>
                      </td>
                    </tr>
                    <tr v-if="currentRoom.members.length === 0" class="bg-white dark:bg-gray-800">
                      <td colspan="4" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        ยังไม่มีผู้ใช้ที่เลือก
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>

            <div class="flex justify-end space-x-2">
              <button type="button" @click="closeCreateModal"
                class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                ยกเลิก
              </button>
              <button type="submit"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                สร้าง
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Edit Room Modal -->
      <div v-if="showEditModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white dark:bg-gray-800">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              แก้ไขกลุ่ม
            </h3>
            <button @click="closeEditModal"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form @submit.prevent="updateRoom()">
            <div class="mb-4">
              <label for="edit-name"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ชื่อกลุ่ม</label>
              <input type="text" id="edit-name" v-model="currentRoom.name" required
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="กรอกชื่อกลุ่ม">
            </div>
            <div class="mb-4">
              <label for="edit-description"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">คำอธิบาย</label>
              <textarea id="edit-description" v-model="currentRoom.description" required rows="4"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="กรอกคำอธิบายกลุ่ม"></textarea>
            </div>
            <div class="mb-4">
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                for="edit-room-image">รูปภาพกลุ่ม</label>
              <input
                class="block w-full mb-5 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                @change="onRoomImageChange" accept="image/*" id="edit-room-image" type="file">
              <div v-if="currentRoom.imageUrl" class="mt-2">
                <img :src="currentRoom.imageUrl" alt="Current room image" class="w-20 h-20 object-cover rounded-lg" />
                <p class="text-xs text-gray-500 mt-1">รูปภาพปัจจุบัน</p>
              </div>
            </div>
            <div class="mb-4">
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">สีกลุ่ม</label>
              <div class="flex flex-wrap gap-2">
                <div v-for="color in colorOptions" :key="color" :style="{ backgroundColor: color }"
                  class="w-8 h-8 rounded-full cursor-pointer border-2 transition"
                  :class="currentRoom.color === color ? 'border-blue ring-2 ring-blue' : 'border-gray-300'"
                  @click="currentRoom.color = color"></div>
              </div>
            </div>
            <div class="mb-4">
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ผู้ใช้งาน</label>
              <div class="flex flex-wrap gap-2 relative">
                <!-- Custom dropdown with images -->
                <div
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 cursor-pointer"
                  @click="showUserDropdown = !showUserDropdown">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <img v-if="selectedUser && userStore.getUserById(selectedUser)?.imgUrl"
                        :src="userStore.getUserById(selectedUser)?.imgUrl" class="w-6 h-6 rounded-full object-cover"
                        alt="User profile" />
                      <span v-if="selectedUser">
                        {{ userStore.getUserById(selectedUser)?.fullNameThai || 'ไม่พบข้อมูล' }} ({{ selectedUser }})
                      </span>
                      <span v-else>เลือกผู้ใช้งาน</span>
                    </div>
                    <Icon icon="mdi:chevron-down" width="20" height="20" />
                  </div>
                </div>

                <!-- Dropdown options -->
                <div v-if="showUserDropdown"
                  class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto dark:bg-gray-700 dark:border-gray-600">
                  <!-- Search input -->
                  <div class="sticky top-0 p-2 bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Icon icon="mdi:magnify" class="text-gray-500 dark:text-gray-400" width="20" height="20" />
                      </div>
                      <input type="text" v-model="userSearchQuery"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="ค้นหาผู้ใช้..." @click.stop />
                    </div>
                  </div>

                  <div v-for="user in filteredActiveUsers" :key="user.employeeID" @click="selectUser(user.employeeID)"
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center gap-2">
                    <img :src="user.imgUrl" class="w-8 h-8 rounded-full object-cover" alt="User profile"
                      @error="handleImageError" />
                    <div>
                      <div class="text-gray-900 dark:text-white">
                        {{ user.fullNameThai }}
                        <span class="text-gray-500 text-xs" v-if="user.positon">{{ user.positon }} <span
                            class="text-gray-500">: {{ user.department }}</span></span>
                      </div>
                      <div class="text-gray-500 dark:text-gray-400 text-xs">{{ user.employeeID }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mb-4">
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ผู้ใช้ที่เลือก</label>
              <div class="relative overflow-x-auto overflow-y-auto h-[250px]">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" class="px-6 py-3">
                        ชื่อผู้ใช้
                      </th>
                      <th scope="col" class="px-6 py-3">
                        สิทธิ์
                      </th>
                      <th scope="col" class="px-6 py-3">

                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="member in currentRoom.members" :key="member.empId"
                      class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                      <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <div class="flex items-center gap-2">
                          <img :src="getUserImage(member.empId)" class="w-8 h-8 rounded-full object-cover"
                            alt="User profile" @error="handleImageError" />
                          <div class="flex items-center gap-2">
                            <span>{{ getUserName(member.empId) }}</span>
                            <span v-if="member.role === 'bot'"
                              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              <Icon icon="mdi:robot" class="mr-1" width="16" height="16" />
                              Bot
                            </span>
                          </div>
                        </div>
                      </th>
                      <td class="px-6 py-4">
                        <select v-model="member.role" :disabled="member.role === 'bot'"
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          :class="{ 'opacity-50 cursor-not-allowed': member.role === 'bot' }">
                          <option value="owner">เจ้าของ</option>
                          <option value="admin">ผู้ดูแล</option>
                          <option value="User">สมาชิก</option>
                          <option value="bot">Bot</option>
                        </select>
                      </td>
                      <td class="px-6 py-4">
                        <button v-if="member.role !== 'bot'" @click="removeMember(member.empId)"
                          class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                          <Icon icon="mdi:delete" width="24" height="24" />
                        </button>
                      </td>
                    </tr>
                    <tr v-if="currentRoom.members.length === 0" class="bg-white dark:bg-gray-800">
                      <td colspan="4" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        ยังไม่มีผู้ใช้ที่เลือก
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="flex justify-end space-x-2">
              <button type="button" @click="closeEditModal"
                class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                ยกเลิก
              </button>
              <button type="submit"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Members Modal -->
      <div v-if="showMembersModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white dark:bg-gray-800">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              จัดการสมาชิกกลุ่ม "{{ selectedRoom?.name }}"
            </h3>
            <button @click="closeMembersModal"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Search Section -->
          <div class="mb-4">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <i class="fas fa-search text-gray-500 dark:text-gray-400"></i>
              </div>
              <input type="text" v-model="searchQuery"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="ค้นหาผู้ใช้...">
            </div>
          </div>

          <!-- Search Results -->
          <div v-if="searchQuery && filteredUsers.length > 0" class="mb-4">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ผลการค้นหา</h4>
            <div class="space-y-2">
              <div v-for="user in filteredUsers" :key="user.id"
                class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span class="text-gray-700 dark:text-gray-300">{{ user.username }}</span>
                <button @click="addMember(user)"
                  class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Current Members -->
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">สมาชิกปัจจุบัน</h4>
            <div class="space-y-2">
              <div v-for="member in selectedRoom?.members" :key="member.id"
                class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex items-center gap-2">
                  <span class="text-gray-700 dark:text-gray-300">{{ member.username }}</span>
                  <span v-if="member.id === selectedRoom.admin"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    ผู้ดูแล
                  </span>
                </div>
                <button v-if="member.id !== selectedRoom.admin" @click="removeMember(member.id)"
                  class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
          <div class="mt-3 text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
              <i class="fas fa-exclamation-triangle text-red-600 dark:text-red-300"></i>
            </div>
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mt-4">ยืนยันการลบ</h3>
            <div class="mt-2 px-7 py-3">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                คุณต้องการลบกลุ่ม "{{ roomToDelete?.name }}" ใช่หรือไม่?
              </p>
            </div>
            <div class="flex justify-center space-x-2 mt-4">
              <button @click="closeDeleteModal"
                class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                ยกเลิก
              </button>
              <button @click="deleteRoom"
                class="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">
                ลบ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Icon } from '@iconify/vue';
import { useChatStore } from '@/stores/modules/chat.js';
import { useGetAnnouncement } from "@/stores/index.js";
import { useUserStore } from '@/stores/modules/user.js';
export default {
  name: 'ChatGroupView',
  components: {
    Icon
  },
  data() {
    return {
      currentRoom: {
        id: '',
        name: '',
        description: '',
        color: '#2196F3',  // ค่าเริ่มต้น
        members: []
      },
      selectedUser: '',
      showUserDropdown: false,
      userSearchQuery: '',
      userStore: useUserStore(),
      colorOptions: [
        '#2196F3', // Blue
        '#E91E63', // Pink
        '#4CAF50', // Green
        '#FF9800', // Orange
        '#9C27B0', // Purple
        '#00BCD4', // Cyan
        '#F44336', // Red
        '#673AB7'  // Deep Purple
      ],

      rooms: [],
      loading: true,
      showCreateModal: false,
      showEditModal: false,
      showDeleteModal: false,
      showMembersModal: false,
      sortBy: 'newest',
      selectedRoom: null,
      roomToDelete: null,
      newMemberId: '',
      searchQuery: '',
      mockRooms: [],
      chatStore: useChatStore(),
      editingRoomId: null,
      botUsers: {
        '20250008': {
          employeeID: '20250008',
          fullNameThai: 'Bot Notify',
          fullName: 'Bot Notify',
          userName: 'bot.notify',
          imgUrl: '/public/logo12.png',
          isBot: true
        }
        // สามารถเพิ่ม bot users อื่นๆ ได้ที่นี่
      },
      roomImageFile: null,
    };
  },

  computed: {
    sortedRooms() {
      const rooms = [...this.rooms];
      switch (this.sortBy) {
        case 'newest':
          return rooms.sort((a, b) => {
            if (!a.lastMessage) return 1;
            if (!b.lastMessage) return -1;
            return b.lastMessage.timestamp - a.lastMessage.timestamp;
          });
        case 'oldest':
          return rooms.sort((a, b) => {
            if (!a.lastMessage) return 1;
            if (!b.lastMessage) return -1;
            return a.lastMessage.timestamp - b.lastMessage.timestamp;
          });
        case 'name':
          return rooms.sort((a, b) => a.name.localeCompare(b.name, 'th'));
        default:
          return rooms;
      }
    },
    filteredActiveUsers() {
      const activeUsers = this.userStore.getActiveUsers();
      if (!this.userSearchQuery) return activeUsers;

      const query = this.userSearchQuery.toLowerCase().trim();
      return activeUsers.filter(user => {
        // Check if any of the user properties match the search query
        return (
          (user.fullNameThai && user.fullNameThai.toLowerCase().includes(query)) ||
          (user.fullName && user.fullName.toLowerCase().includes(query)) ||
          (user.employeeID && user.employeeID.toLowerCase().includes(query)) ||
          (user.positon && user.positon.toLowerCase().includes(query)) ||
          (user.department && user.department.toLowerCase().includes(query))
        );
      });
    },
    filteredRooms() {
      if (!this.searchQuery) return this.sortedRooms;
      const q = this.searchQuery.toLowerCase();
      return this.sortedRooms.filter(room =>
        (room.name && room.name.toLowerCase().includes(q)) ||
        (room.description && room.description.toLowerCase().includes(q))
      );
    }
  },
  created() {
    this.fetchRooms();
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        await this.userStore.fetchUsers();
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },

    selectUser(employeeID) {
      this.selectedUser = employeeID;
      this.showUserDropdown = false;
      this.addSelectedUser();
    },

    handleImageError(event) {
      // Replace broken image with a default placeholder
      event.target.src = '/public/logo12.png';
    },
    addSelectedUser() {
      if (!this.selectedUser) return;

      // Check if user is already in the members array
      const existingMember = this.currentRoom.members.find(member => member.empId === this.selectedUser);
      if (existingMember) {
        alert('ผู้ใช้นี้ถูกเลือกแล้ว');
        this.selectedUser = '';
        return;
      }

      // Get user details from store
      const user = this.userStore.getUserById(this.selectedUser);
      if (user) {
        // Add user to members array with complete data
        this.currentRoom.members.push({
          empId: user.employeeID,
          role: user.isBot ? 'bot' : 'User',
          fullName: user.fullNameThai || user.fullName,
          department: user.department,
          profileImage: user.imgUrl,
          isAdmin: false,
          position: user.position
        });

        // Reset selected user
        this.selectedUser = '';
      }
    },
    async fetchRooms() {
      try {
        this.loading = true;
        // Call API to get chat list
        const response = await this.chatStore.getChatList();

        // Process the response data and map it to required format
        if (response && response.data) {
          this.rooms = response.data.map(room => {
            return {
              id: room._id || String(room.room_id),
              name: room.name || room.room_name || '',
              description: room.description || '',
              color: room.color || '#007bff',
              admin: room.admin.fullName || room.admin_name || '',
              owner: room.members[0].fullName || room.admin_name || '',
              lastMessage: room.last_message || null,
              unreadCount: room.unread_count || 0,
              members: room.members || [],
              totalMembers: room.totalMembers,
              createdAt: room.createdAt,
              updatedAt: room.updatedAt
            };
          });
        } else {
          this.rooms = [];
        }

        // console.log('rooms::', this.rooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        this.rooms = [];
      } finally {
        this.loading = false;
      }
    },
    openCreateModal() {
      // Initialize empty room for creation
      this.currentRoom = {
        name: '',
        description: '',
        color: '#007bff',
        members: []
      };
      this.showCreateModal = true;
    },
    closeCreateModal() {
      this.showCreateModal = false;
      this.currentRoom = {
        name: '',
        description: '',
        color: '#007bff',
        members: []
      };
    },
    async openEditModal(room) {
      this.loading = true;
      try {
        console.log('Opening edit modal for room:', room);

        if (!room.id) {
          throw new Error('Room ID is undefined');
        }

        this.editingRoomId = room.id;
        const response = await this.chatStore.getRoomById(room.id);

        if (response && response.data) {
          const roomData = response.data;
          console.log('Room data from API:', roomData);

          // Create a properly formatted room object
          this.currentRoom = {
            id: room.id,
            name: roomData.name || '',
            description: roomData.description || '',
            color: roomData.color || '#007bff',
            members: roomData.members && Array.isArray(roomData.members)
              ? roomData.members.map(member => {
                console.log('Processing member:', member);
                return {
                  empId: member.employeeID,
                  role: member.role,
                  fullName: member.fullName,
                  department: member.department,
                  profileImage: member.profileImage,
                  isAdmin: member.isAdmin
                };
              })
              : []
          };
          console.log('Final currentRoom:', this.currentRoom);
        } else {
          console.log('Using fallback room data:', room);
          this.currentRoom = {
            ...room,
            id: room.id,
            members: room.members && Array.isArray(room.members)
              ? room.members.map(member => ({
                empId: member.employeeID,
                role: member.role,
                fullName: member.fullName,
                department: member.department,
                profileImage: member.profileImage,
                isAdmin: member.isAdmin
              }))
              : []
          };
        }

        this.showEditModal = true;
      } catch (error) {
        console.error('Error fetching room details:', error);
        alert('ไม่สามารถดึงข้อมูลห้องได้ กรุณาลองใหม่อีกครั้ง');
      } finally {
        this.loading = false;
      }
    },
    closeEditModal() {
      this.showEditModal = false;
      this.editingRoomId = null;
      this.currentRoom = {
        name: '',
        description: '',
        color: '#007bff',
        imageUrl: '',
        members: []
      };
    },
    async createRoom() {
      try {
        this.loading = true;

        // Ensure at least one member is selected
        if (this.currentRoom.members.length === 0) {
          alert('กรุณาเลือกผู้ใช้อย่างน้อย 1 คน');
          this.loading = false;
          return;
        }

        // Ensure at least one owner is selected
        const hasOwner = this.currentRoom.members.some(member => member.role === 'owner');
        if (!hasOwner) {
          alert('กรุณากำหนดเจ้าของกลุ่มอย่างน้อย 1 คน');
          this.loading = false;
          return;
        }

        // เตรียมข้อมูล
        const admin = this.currentRoom.members.find(m => m.role === 'admin');
        const members = this.currentRoom.members.filter(m => m.role !== 'admin');

        // สร้าง FormData
        const formData = new FormData();
        formData.append('name', this.currentRoom.name);
        formData.append('description', this.currentRoom.description);
        formData.append('color', this.currentRoom.color);
        if (this.roomImageFile) {
          formData.append('image', this.roomImageFile);
        }
        formData.append('admin', JSON.stringify(admin));
        formData.append('members', JSON.stringify(members));

        // ส่งไปที่ store
        await this.chatStore.createChat(formData);

        // Close modal and refresh room list
        this.closeCreateModal();
        await this.fetchRooms();

        // Show success message
        alert('สร้างกลุ่มสำเร็จ');
      } catch (error) {
        console.error('Error creating room:', error);
        alert('เกิดข้อผิดพลาดในการสร้างกลุ่ม กรุณาลองใหม่อีกครั้ง');
      } finally {
        this.loading = false;
      }
    },

    async updateRoom() {
      try {
        this.loading = true;

        // Ensure at least one member is selected
        if (this.currentRoom.members.length === 0) {
          alert('กรุณาเลือกผู้ใช้อย่างน้อย 1 คน');
          this.loading = false;
          return;
        }

        // Ensure at least one owner is selected
        const hasOwner = this.currentRoom.members.some(member => member.role === 'owner');
        if (!hasOwner) {
          alert('กรุณากำหนดเจ้าของกลุ่มอย่างน้อย 1 คน');
          this.loading = false;
          return;
        }

        // Ensure we have a valid room ID to update
        if (!this.editingRoomId || this.editingRoomId === 'undefined') {
          alert('ไม่พบข้อมูลห้องที่ต้องการแก้ไข หรือ ID ไม่ถูกต้อง');
          console.error('Invalid room ID:', this.editingRoomId);
          this.loading = false;
          return;
        }

        // Log the current room data before update
        console.log('Current room data:', this.currentRoom);

        // เตรียมข้อมูล
        const admin = this.currentRoom.members.find(m => m.role === 'admin');
        const members = this.currentRoom.members.filter(m => m.role !== 'admin');

        // สร้าง FormData
        const formData = new FormData();
        formData.append('name', this.currentRoom.name);
        formData.append('description', this.currentRoom.description);
        formData.append('color', this.currentRoom.color);

        // Handle image
        if (this.roomImageFile) {
          formData.append('image', this.roomImageFile);
        } else if (this.currentRoom.imageUrl) {
          formData.append('imageUrl', this.currentRoom.imageUrl);
        }

        // Handle members data
        if (admin) {
          formData.append('admin', JSON.stringify({
            empId: admin.empId,
            role: admin.role,
            fullName: admin.fullName,
            department: admin.department,
            profileImage: admin.profileImage
          }));
        }

        if (members && members.length > 0) {
          formData.append('members', JSON.stringify(members.map(member => ({
            empId: member.empId,
            role: member.role,
            fullName: member.fullName,
            department: member.department,
            profileImage: member.profileImage
          }))));
        }

        // Log FormData contents for debugging
        console.log('FormData contents:');
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }

        // เรียก store
        const response = await this.chatStore.updateRoom(this.editingRoomId, formData);
        console.log('Update response:', response);

        // ปิด modal, refresh, alert
        this.closeEditModal();
        await this.fetchRooms();
        alert('อัพเดตกลุ่มสำเร็จ');
      } catch (error) {
        console.error('Error updating room:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
        }
        alert('เกิดข้อผิดพลาดในการอัพเดตกลุ่ม กรุณาลองใหม่อีกครั้ง');
      } finally {
        this.loading = false;
      }
    },
    confirmDelete(room) {
      this.roomToDelete = room;
      this.showDeleteModal = true;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.roomToDelete = null;
    },
    async deleteRoom() {
      try {
        this.loading = true;
        const employeeID = JSON.parse(localStorage.getItem('user'))?.employeeID || null;
        // Simulate API call
        // console.log(this.roomToDelete.id)
        const response = await this.chatStore.deleteRoom(this.roomToDelete.id, employeeID);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const index = this.mockRooms.findIndex(r => r.id === this.roomToDelete.id);
        if (index !== -1) {
          this.mockRooms.splice(index, 1);
        }
        this.closeDeleteModal();
        this.fetchRooms();
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    },
    openMembersModal(room) {
      this.selectedRoom = room;
      this.showMembersModal = true;
    },
    closeMembersModal() {
      this.showMembersModal = false;
      this.selectedRoom = null;
      this.searchQuery = '';
    },
    async addMember(user) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        this.selectedRoom.members.push(user);
        this.searchQuery = '';
      } catch (error) {
        console.error('Error adding member:', error);
      }
    },
    async removeMember(empId) {
      try {
        // Check if member is a bot
        const member = this.currentRoom.members.find(m => m.empId === empId);
        if (member && member.role === 'bot') {
          alert('ไม่สามารถลบ Bot ออกจากกลุ่มได้');
          return;
        }

        // Remove member from currentRoom.members
        this.currentRoom.members = this.currentRoom.members.filter(
          member => member.empId !== empId
        );
      } catch (error) {
        console.error('Error removing member:', error);
      }
    },
    getUserName(empId) {
      // ตรวจสอบจาก currentRoom.members ก่อน
      // console.log('currentRoom.members::', this.currentRoom.members);
      const member = this.currentRoom.members?.find(m => m.empId === empId);
      if (member) {
        // console.log('member::', member);
        return member.fullName;
      }

      // ถ้าไม่พบใน currentRoom ให้ตรวจสอบจาก userStore
      const user = this.userStore.getUserById(empId);
      console.log('User data for', empId, ':', user);

      if (!user) return 'ไม่พบข้อมูล';

      return user.fullNameThai ||
        user.fullName ||
        user.name ||
        user.username ||
        'ไม่พบข้อมูล';
    },

    getUserImage(empId) {
      // ตรวจสอบจาก currentRoom.members ก่อน
      const member = this.currentRoom.members?.find(m => m.empId === empId);
      if (member && member.profileImage) {
        return member.profileImage;
      }

      // ถ้าไม่พบใน currentRoom ให้ตรวจสอบจาก userStore
      const user = this.userStore.getUserById(empId);
      return user?.imgUrl || '/public/logo12.png';
    },

    isBotUser(empId) {
      // ตรวจสอบจาก currentRoom.members
      const member = this.currentRoom.members?.find(m => m.empId === empId);
      return member?.role === 'bot';
    },
    onRoomImageChange(event) {
      const file = event.target.files[0];
      this.roomImageFile = file || null;
    },
  }
};
</script>

<style>
.input-equal-height {
  height: 38px; /* หรือใช้ min-height: 42px; */
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 1rem;
  border-radius: 0.5rem;
}
</style>
