<template>
    <div class="p-4 sm:ml-32">
      <div class="p-4 mt-14">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-start justify-between gap-2">
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">จัดการ Bot Notify</h1>
          </div>

          <button 
            @click="openCreateModal"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            <i class="fas fa-plus mr-2"></i>สร้าง Bot Notify
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
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
                <th scope="col" class="px-2 py-3 text-center">ลำดับ</th>
                <th scope="col" class="px-2 py-3 text-center">รหัส</th>
                <th scope="col" class="px-6 py-3">ชื่อ Bot</th>
                <th scope="col" class="px-2 py-3 text-center">จำนวนห้อง</th>
                <th scope="col" class="px-2 py-3 text-center">จำนวน Request</th>
                <th scope="col" class="px-6 py-3 text-center">วันที่สร้าง</th>
                <th scope="col" class="px-6 py-3 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(bot, index) in sortedRooms" :key="bot.employeeID" 
                  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td class="px-6 py-4 text-center">
                  {{ index + 1 }}
                </td>
                <td class="px-6 py-4 text-center">
                  {{ bot.employeeID }}
                </td>
                <td class="px-6 py-4">
                  <span class="cursor-pointer" @click="openEditModal(bot)">{{ bot.name }}</span>
                </td>
                <td class="px-6 py-4 text-right">
                  <span class="inline-flex items-center gap-1"> 
                    {{ bot.roomCount }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <span class="inline-flex items-center gap-1">
                    <i class="fas fa-bell text-gray-400"></i>
                    {{ bot.requestCount }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center gap-1">
                    <i class="fas fa-calendar text-gray-400"></i>
                    {{ formatDate(bot.createdAt) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex justify-center gap-3">
                    <button 
                      @click="showDevNotice"
                      class="text-green-500 hover:text-green-800 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      <Icon icon="streamline:send-email-solid" width="20" height="20" />
                    </button>
                    
                    <button 
                      @click="openApiModal(bot)"
                      class="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      <Icon icon="mingcute:code-fill" width="24" height="24" />
                    </button>

                    <button 
                      @click="openEditModal(bot)"
                      class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Icon icon="mdi:pencil" width="24" height="24" />
                    </button>
                    
                    <button 
                      @click="confirmDelete(bot)"
                      class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Icon icon="mdi:delete" width="24" height="24" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Create/Edit Bot Modal -->
        <div v-if="showModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div class="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ isEditing ? 'แก้ไข bot' : 'สร้าง Bot ใหม่' }}
              </h3>
              <button 
                @click="closeModal"
                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
            <form @submit.prevent="isEditing ? updateRoom() : createRoom()">
              <div class="mb-4">
                <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ชื่อ Bot</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="currentRoom.name" 
                  required
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="กรอกชื่อ bot"
                >
              </div>
              <div class="mb-4">
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">รายการห้อง</label>
                <div class="relative">
                  <select 
                    v-model="selectedRoomId"
                    @change="addSelectedRoom"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
                  >
                    <option value="">เลือกห้อง</option>
                    <option v-for="room in availableRooms" 
                            :key="room._id" 
                            :value="room._id"
                            :disabled="isRoomSelected(room._id)">
                      {{ room.name }}
                    </option>
                  </select>

                  <!-- Selected Rooms Table -->
                  <div class="relative overflow-x-auto overflow-y-auto h-[250px]">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                        <tr>
                          <th scope="col" class="px-6 py-3">ชื่อห้อง</th>
                          <th scope="col" class="px-6 py-3">คำอธิบาย</th>
                          <th scope="col" class="px-6 py-3">จัดการ</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="room in selectedRooms" 
                            :key="room._id" 
                            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                          <td class="px-6 py-4">
                            <div class="flex items-center gap-2">
                              <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: room.color }"></div>
                              <span class="font-medium text-gray-900 text-sm dark:text-white">{{ room.name }}</span>
                            </div>
                          </td>
                          <td class="px-6 py-4 text-xs">{{ room.description }}</td>
                          <td class="px-6 py-4">
                            <button 
                              @click="removeSelectedRoom(room)"
                              class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <Icon icon="mdi:delete" width="24" height="24" />
                            </button>
                          </td>
                        </tr>
                        <tr v-if="selectedRooms.length === 0" class="bg-white dark:bg-gray-800">
                          <td colspan="4" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                            ยังไม่มีห้องที่เลือก
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div class="flex justify-end space-x-2">
                <button 
                  type="button"
                  @click="closeModal"
                  class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit"
                  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  {{ isEditing ? 'บันทึก' : 'สร้าง' }}
                </button>
              </div>
            </form>
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
                  คุณต้องการลบ bot "{{ roomToDelete?.name }}" ใช่หรือไม่?
                </p>
              </div>
              <div class="flex justify-center space-x-2 mt-4">
                <button 
                  @click="closeDeleteModal"
                  class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  ยกเลิก
                </button>
                <button 
                  @click="deleteRoom"
                  class="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                >
                  ลบ
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- API Documentation Modal -->
        <div v-if="showApiModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div class="relative top-20 mx-auto p-2.5 border w-[800px] shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-md font-medium text-gray-900 dark:text-white">
                API Documentation - {{ currentBot?.name }}
              </h3>
              <button 
                @click="closeApiModal"
                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <Icon icon="mingcute:close-fill" width="24" height="24" />
              </button>
            </div>

            <!-- Tabs -->
            <div class="border-b border-gray-200 dark:border-gray-700 mb-4">
              <ul class="flex flex-wrap -mb-px">
                <li class="mr-2">
                  <button 
                    @click="activeApiTab = 'axios'"
                    :class="[
                      'inline-block p-4 border-b-2 rounded-t-lg',
                      activeApiTab === 'axios' 
                        ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500' 
                        : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                    ]"
                  >
                    Axios
                  </button>
                </li>
                <li class="mr-2">
                  <button 
                    @click="activeApiTab = 'php'"
                    :class="[
                      'inline-block p-4 border-b-2 rounded-t-lg',
                      activeApiTab === 'php' 
                        ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500' 
                        : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                    ]"
                  >
                    PHP
                  </button>
                </li>
              </ul>
            </div>

            <!-- Tab Content -->
            <div class="space-y-6">
              <!-- API Endpoints -->
              <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">API Endpoints</h4>
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded">POST</span>
                    <code class="text-sm text-gray-600 dark:text-gray-300">{{ apiBaseUrl }}/api/messages/send</code>
                  </div> 
                  <!-- <div class="flex items-center gap-2">
                    <span class="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded">POST</span>
                    <code class="text-sm text-gray-600 dark:text-gray-300">{{ apiBaseUrl }}/api/messages/upload</code>
                  </div>  -->
                </div>
              </div>

              <!-- Code Examples -->
              <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg overflow-y-scroll h-[calc(100vh-500px)]">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Code Examples</h4>
                
                <!-- Axios Examples -->
                <div v-if="activeApiTab === 'axios'" class="space-y-4">
                  <div>
                    <h5 class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">ส่งข้อความ</h5>
                    <pre class="bg-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto"><code>const botData ={
                        "message": [ "ทดสอบการส่งข้อความ" ],
                      //   "message": [
                      //     "2",
                      //     "เรื่องที่ 1",
                      //     "เรื่องที่ 2",
                      //     "เรื่องที่ 3",
                      //     "เรื่องที่ 4",
                      //     "เรื่องที่ 5"
                      //   ],
                        "employeeId": "BOT_EMPLOYEE_ID"
                      };

                    const response = await axios.post('{{ apiBaseUrl }}/api/messages/send', botData, {
                      headers: {
                        'Content-Type': 'application/json'
                      }
                    });</code></pre>
                  </div> 
                  
                  <!-- <div>
                    <h5 class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">ส่งรูปภาพ</h5>
                    <pre class="bg-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto"><code>const botData = {
                      name: "Bot Name",
                      roomCount: 0,
                      requestCount: 0,
                      createdBy: "employeeID",
                      room: ["roomId1", "roomId2"]
                    };

                    const response = await axios.post('{{ apiBaseUrl }}/api/users/create-bot', botData, {
                      headers: {
                        'Content-Type': 'application/json'
                      }
                    });</code></pre>
                  </div>  -->
                </div>

                <!-- PHP Examples -->
                <div v-if="activeApiTab === 'php'" class="space-y-4">
             
                  <div>
                    <h5 class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">ส่งข้อความ</h5>
                    <pre class="bg-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto"><code>$botData = [
                        'message' => [ "ทดสอบการส่งข้อความ" ],
                        //   "message": [
                      //     "2",
                      //     "เรื่องที่ 1",
                      //     "เรื่องที่ 2",
                      //     "เรื่องที่ 3",
                      //     "เรื่องที่ 4",
                        //     "เรื่องที่ 5"
                        //   ],
                        'employeeId' => 'BOT_EMPLOYEE_ID'
                    ];

                    $ch = curl_init('{{ apiBaseUrl }}/api/messages/send');
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_POST, true);
                    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($botData));
                    curl_setopt($ch, CURLOPT_HTTPHEADER, [
                        'Content-Type: application/json'
                    ]);
                    $response = curl_exec($ch);
                    curl_close($ch);</code></pre>
                  </div>

                  <!-- <div>
                    <h5 class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">ส่งรูปภาพ</h5>
                    <pre class="bg-gray-800 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto"><code>$botData = [
                        'name' => 'Bot Name',
                        'roomCount' => 0,
                        'requestCount' => 0,
                        'createdBy' => 'employeeID',
                        'room' => ['roomId1', 'roomId2']
                    ];

                    $ch = curl_init('{{ apiBaseUrl }}/api/users/create-bot');
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_POST, true);
                    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($botData));
                    curl_setopt($ch, CURLOPT_HTTPHEADER, [
                        'Content-Type: application/json'
                    ]);
                    $response = curl_exec($ch);
                    curl_close($ch);</code></pre>
                  </div> -->

                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Development Notice Modal -->
        <div v-if="showDevNoticeModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div class="mt-3 text-center">
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900">
                <Icon icon="mdi:construction" class="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
              </div>
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mt-4">อยู่ระหว่างการพัฒนา</h3>
              <div class="mt-2 px-7 py-3">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  ฟีเจอร์ส่งข้อความกำลังอยู่ในขั้นตอนการพัฒนา กรุณารอการแจ้งเตือนในอนาคต
                </p>
              </div>
              <div class="flex justify-center mt-4">
                <button 
                  @click="closeDevNotice"
                  class="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  ตกลง
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
  import {Icon} from '@iconify/vue';
  import { useUserStore } from '@/stores/modules/user.js';
  import { useBotStore } from '@/stores/modules/bot.js';
  import { useChatStore } from '@/stores/modules/chat.js';

  export default {
    name: 'DevelopView',
    components: {
      Icon
    },
    data() {
      return {
        loading: true,
        showModal: false,
        showDeleteModal: false,
        isEditing: false,
        sortBy: 'newest',
        currentRoom: {
          employeeID: '',
          name: '',
          roomCount: 0,
          requestCount: 0
        },
        roomToDelete: null,
        userStore: useUserStore(),
        botStore: useBotStore(),
        chatStore: useChatStore(),
        availableRooms: [],
        selectedRooms: [],
        selectedRoomId: '',
        showApiModal: false,
        activeApiTab: 'axios',
        currentBot: null,
        apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
        showDevNoticeModal: false,
      };
    },
    computed: {
      sortedRooms() {
        return [...this.rooms].sort((a, b) => {
          if (this.sortBy === 'newest') {
            return b.employeeID.localeCompare(a.employeeID);
          }
          return a.employeeID.localeCompare(b.employeeID);
        });
      }
    },
    created() {
      this.fetchBots();
    },
    methods: {
      async fetchBots() {
        try {
          this.loading = true;
          const employeeID = JSON.parse(localStorage.getItem('user'))?.employeeID || null;
          // console.log('Fetching bots for employeeID:', employeeID);
          const response = await this.botStore.getBotList(employeeID);
          // console.log('Bot API Response:', response);
          if (response) {
            // console.log('response', response);
            // Transform the response to ensure we have the correct structure
            this.rooms = response.map(bot => ({
              employeeID: bot.employeeID,
              name: bot.name || bot.name || '', // Try different possible field names
              roomCount: bot.roomCount || 0,
              requestCount: bot.requestCount || 0,
              createdAt: bot.createdAt || new Date().toISOString() // Add creation date
            }));
            // console.log('Transformed rooms data:', this.rooms);
          }
        } catch (error) {
          console.error('Error fetching bots:', error);
          this.rooms = [];
        } finally {
          this.loading = false;
        }
      },

      async fetchChatRooms() {
        try {
          const response = await this.chatStore.getChatList();
          // console.log('Chat rooms response:', response);
          // Transform the response to match our required structure
          this.availableRooms = response.data.map(room => ({
            _id: room._id,
            name: room.name,
            description: room.description,
            color: room.color,
            admin: room.admin,
            totalMembers: room.totalMembers,
            isActive: room.isActive,
            createdAt: room.createdAt,
            updatedAt: room.updatedAt
          }));
          // console.log('Transformed rooms:', this.availableRooms);
        } catch (error) {
          console.error('Error fetching chat rooms:', error);
        }
      },

      addSelectedRoom() {
        if (!this.selectedRoomId) return;
        
        const room = this.availableRooms.find(r => r._id === this.selectedRoomId);
        if (room && !this.isRoomSelected(room._id)) {
          this.selectedRooms.push(room);
        }
        this.selectedRoomId = '';
      },

      removeSelectedRoom(room) {
        this.selectedRooms = this.selectedRooms.filter(r => r._id !== room._id);
      },

      isRoomSelected(roomId) {
        return this.selectedRooms.some(room => room._id === roomId);
      },

      openCreateModal() {
        this.isEditing = false;
        this.currentRoom = {
          employeeID: '',
          name: '',
          roomCount: 0,
          requestCount: 0
        };
        this.selectedRooms = [];
        this.fetchChatRooms();
        this.showModal = true;
      },

      async openEditModal(bot) {
        try {
          this.loading = true;
          // Fetch detailed bot information using the store
          const botData = await this.botStore.getBotDetails(bot.employeeID);

          this.isEditing = true;
          this.currentRoom = {
            employeeID: botData.employeeID,
            name: botData.botDetails.name,
            roomCount: botData.botDetails.roomCount,
            requestCount: botData.botDetails.requestCount,
            createdAt: botData.botDetails.createdAt
          };

          // Transform rooms data to match the required format
          if (botData.rooms && Array.isArray(botData.rooms)) {
            this.selectedRooms = botData.rooms.map(room => ({
              _id: room.id,
              name: room.name,
              description: room.description,
              color: room.color,
              admin: room.admin,
              totalMembers: room.memberCount,
              createdAt: room.createdAt,
              updatedAt: room.updatedAt
            }));
          } else {
            this.selectedRooms = [];
          }

          await this.fetchChatRooms();
          this.showModal = true;
        } catch (error) {
          console.error('Error fetching bot details:', error);
          alert('เกิดข้อผิดพลาดในการดึงข้อมูล bot กรุณาลองใหม่อีกครั้ง');
        } finally {
          this.loading = false;
        }
      },

      closeModal() {
        this.showModal = false;
        this.currentRoom = {
          employeeID: '',
          name: '',
          roomCount: 0,
          requestCount: 0
        };
        this.selectedRooms = [];
        this.selectedRoomId = '';
      },

      async createRoom() {
        try {
          this.loading = true;
          const botData = {
            name: this.currentRoom.name,
            roomCount: 0,
            requestCount: 0,
            createdBy: JSON.parse(localStorage.getItem('user'))?.employeeID,
            room: this.selectedRooms.map(room => room._id)
          };
          console.log('Creating bot with data:', botData);
          const response = await this.botStore.createBot(botData);
          
          if (response) {
            // Close modal first
            this.closeModal();
            
            // Show success message
            alert('สร้างบอทสำเร็จ');
            
            // Refresh the table data
            await this.fetchBots();
            
            // Force a re-render of the table
            this.sortBy = this.sortBy === 'newest' ? 'oldest' : 'newest';
            await this.$nextTick();
            this.sortBy = this.sortBy === 'newest' ? 'oldest' : 'newest';
          }
        } catch (error) {
          console.error('Error creating bot:', error);
          alert('เกิดข้อผิดพลาดในการสร้าง bot กรุณาลองใหม่อีกครั้ง');
        } finally {
          this.loading = false;
        }
      },

      async updateRoom() {
        try {
          this.loading = true;
          const botData = {
            employeeID: this.currentRoom.employeeID,
            name: this.currentRoom.name,
            requestCount: this.currentRoom.requestCount,
            rooms: this.selectedRooms // Pass the full room objects, the store will extract the IDs
          };

          console.log('Updating bot with data:', botData);
          const response = await this.botStore.updateBot(this.currentRoom.employeeID, botData);
          
          if (response) {
            // Close modal first
            this.closeModal();
            
            // Show success message
            alert('อัพเดทข้อมูลสำเร็จ');
            
            // Refresh the table data
            await this.fetchBots();
            
            // Force a re-render of the table by updating the sortBy value
            this.sortBy = this.sortBy === 'newest' ? 'oldest' : 'newest';
            await this.$nextTick();
            this.sortBy = this.sortBy === 'newest' ? 'oldest' : 'newest';
          }
        } catch (error) {
          console.error('Error updating bot:', error);
          alert('เกิดข้อผิดพลาดในการอัพเดต bot กรุณาลองใหม่อีกครั้ง');
        } finally {
          this.loading = false;
        }
      },

      confirmDelete(bot) {
        this.roomToDelete = bot;
        this.showDeleteModal = true;
      },

      closeDeleteModal() {
        this.showDeleteModal = false;
        this.roomToDelete = null;
      },

      async deleteRoom() {
        try {
          this.loading = true;
          const response = await this.botStore.deleteBot(this.roomToDelete.employeeID);
          
          if (response) {
            // Close delete modal
            this.closeDeleteModal();
            
            // Show success message
            alert('ลบบอทสำเร็จ');
            
            // Refresh the table data
            await this.fetchBots();
            
            // Force a re-render of the table
            this.sortBy = this.sortBy === 'newest' ? 'oldest' : 'newest';
            await this.$nextTick();
            this.sortBy = this.sortBy === 'newest' ? 'oldest' : 'newest';
          }
        } catch (error) {
          console.error('Error deleting bot:', error);
          alert('เกิดข้อผิดพลาดในการลบ bot กรุณาลองใหม่อีกครั้ง');
        } finally {
          this.loading = false;
        }
      },

      formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      },

      openApiModal(bot) {
        this.currentBot = bot;
        this.showApiModal = true;
      },

      closeApiModal() {
        this.showApiModal = false;
        this.currentBot = null;
        this.activeApiTab = 'axios';
      },

      showDevNotice() {
        this.showDevNoticeModal = true;
      },

      closeDevNotice() {
        this.showDevNoticeModal = false;
      },
    }
  };
  </script>
