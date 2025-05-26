<template>
 <div class="p-4 sm:ml-32">
    <div class="p-4 mt-14">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
        <div class="flex items-start justify-between gap-2">
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">จัดการประกาศ</h1>
             <!-- Sorting -->

      <select 
        v-model="sortBy"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-auto p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value="newest">ใหม่ล่าสุด</option>
        <option value="oldest">เก่าสุด</option>
        <option value="title">ตามหัวข้อ</option>
      </select>

          <!-- Pagination -->
    <div class="flex justify-center  px-1">
      <nav class="inline-flex gap-2 rounded-md">
        <button 
          v-for="page in totalPages" 
          :key="page"
          @click="changePage(page)"
          :class="[
            'px-3 py-1.5 text-sm font-medium shadow-md rounded-md',
            currentPage === page
              ? 'bg-blue-600 text-white '
              : 'bg-white text-gray-700 shadow-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
          ]"
        >
          {{ page }}
        </button>
      </nav>
    </div>

        </div>


      <button 
        @click="openCreateModal"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        <i class="fas fa-plus mr-2"></i>สร้างประกาศใหม่
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
    <div v-else-if="announcements.length === 0" class="text-center py-12">
      <i class="fas fa-bullhorn text-4xl text-gray-400 mb-4"></i>
      <p class="text-gray-500 dark:text-gray-400">ยังไม่มีประกาศ</p>
    </div>

    <!-- Announcements List -->
    <div v-else class="relative overflow-x-auto overflow-y-auto h-[70vh] shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">รูปภาพ</th>
            <th scope="col" class="px-6 py-3">หัวข้อ</th>
            <th scope="col" class="px-6 py-3">เนื้อหา</th>
            <th scope="col" class="px-6 py-3">ผู้สร้าง</th>
            <th scope="col" class="px-6 py-3">วันที่สร้าง</th>
            <th scope="col" class="px-6 py-3">สถานะ</th>
            <th scope="col" class="px-6 py-3">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="announcement in sortedAnnouncements" 
              :key="announcement._id" 
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td class="px-6 py-4">
              <img v-if="announcement.imageUrl" 
                   :src="announcement.imageUrl" 
                   :alt="announcement.title"
                   class="w-16 h-16 object-cover rounded-lg cursor-pointer"
                   @click="openEditModal(announcement)"
                   @error="handleImageError">
              <span v-else class="text-gray-400">ไม่มีรูปภาพ</span>
            </td>
            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white cursor-pointer" @click="openEditModal(announcement)">
              {{ announcement.title }}
            </td>
            <td class="px-6 py-4 max-w-xs truncate cursor-pointer" @click="openEditModal(announcement)">
              {{ announcement.content }}
            </td>
            <td class="px-6 py-4">
              {{ announcement.createdBy.fullName }}
            </td>
            <td class="px-6 py-4">
              {{ announcement.isoString }}
            </td>
            <td class="px-6 py-4">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" 
                       :checked="announcement.status === 'active'"
                       @click="toggleAnnouncementStatus(announcement)"
                       class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center space-x-3">
                <button 
                  @click="openEditModal(announcement)"
                  class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1q-.15.15-.15.36M20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z"/></svg>
                </button>
                <button 
                  @click="confirmDelete(announcement)"
                  class="font-medium text-red-600 dark:text-red-500 hover:underline"
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"/></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Announcement Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ isEditing ? 'แก้ไขประกาศ' : 'สร้างประกาศใหม่' }}
          </h3>
          <button 
            @click="closeModal"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="isEditing ? updateAnnouncement() : createAnnouncement()">
          <div class="mb-4">
            <input v-if="isEditing"
                type="hidden"
                id="id"
                v-model="currentAnnouncement.id"
            >

            <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">หัวข้อ</label>
            <input 
              type="text" 
              id="title" 
              v-model="currentAnnouncement.title" 

              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="กรอกหัวข้อประกาศ"
            >
          </div>
          <div class="mb-4">
            <label for="content" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">เนื้อหา</label>
            <textarea 
              id="content" 
              v-model="currentAnnouncement.content" 

              rows="4"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="กรอกเนื้อหาประกาศ"
            ></textarea>
          </div>
          <div class="mb-4">
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">รูปภาพ</label>
            <div class="flex items-center justify-center w-full">
              <label for="image-upload" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <template v-if="!currentAnnouncement.imageUrl">
                    <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span class="font-semibold">คลิกเพื่ออัพโหลด</span> หรือลากไฟล์มาวาง
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG หรือ GIF (MAX. 2MB)</p>
                  </template>
                  <img v-else 
                       :src="currentAnnouncement.imageUrl" 
                       class="max-h-48 rounded-lg"
                       alt="Preview"
                       @error="handleImageError">
                </div>
                <input 
                  id="image-upload" 
                  type="file" 
                  class="hidden" 
                  accept="image/*"
                  @change="handleImageUpload"
                >
              </label>
            </div>
            <div v-if="currentAnnouncement.imageUrl" class="mt-2 flex justify-end">
              <button 
                type="button"
                @click="removeImage"
                class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm"
              >
                <i class="fas fa-trash mr-1"></i>ลบรูปภาพ
              </button>
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
              คุณต้องการลบประกาศ ใช่หรือไม่?
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
              @click="deleteAnnouncement(selectedAnnouncement)"
              class="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
            >
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
import { useGetAnnouncement } from '@/stores/modules/announcement.js';

export default {
  name: 'AnnouncementView',
  data() {
    return {
      announcements: [],
      currentPage: 1,
      totalPages: 1,
      loading: true,
      showModal: false,
      showDeleteModal: false,
      selectedAnnouncement: null,
      isEditing: false,
      sortBy: 'newest',
      currentAnnouncement: {
        title: '',
        content: '',
        status: 'active',
        imageUrl: null
      },
      getAnnouncement: useGetAnnouncement(),
      uploadFile: null,
      employeeID: JSON.parse(localStorage.getItem('user'))?.employeeID || null
    };
  },
  computed: {
    sortedAnnouncements() {
      const announcements = [...this.announcements];
      switch (this.sortBy) {
        case 'newest':
          return announcements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        case 'oldest':
          return announcements.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        case 'title':
          return announcements.sort((a, b) => a.title.localeCompare(b.title, 'th'));
        default:
          return announcements;
      }
    }
  },
  created() {
    this.fetchAnnouncements();
  },
  methods: {
    getThaiTimeISOString(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    },
    async fetchAnnouncements() {
      try {
        this.loading = true;
        await this.getAnnouncement.getAnnouncementToAddAnnouncement();

        if (this.getAnnouncement.showGetAnnouncement) {
          const response = this.getAnnouncement.showGetAnnouncement;
          this.announcements = response.announcements.map(announcement => ({
            ...announcement,
            imageUrl: announcement.imageUrl ? import.meta.env.VITE_API_BASE_URL + announcement.imageUrl : null,
            isoString: this.getThaiTimeISOString(announcement.createdAt)
          }));
          this.currentPage = response.pagination.currentPage;
          this.totalPages = response.pagination.totalPages;
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        this.loading = false;
      }
    },
    openCreateModal() {
      this.isEditing = false;
      this.currentAnnouncement = {
        title: '',
        content: '',
        status: 'active',
        imageUrl: null
      };
      this.uploadFile = null;
      this.showModal = true;
    },
    openEditModal(announcement) {
      this.isEditing = true;
      this.currentAnnouncement = { ...announcement };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.currentAnnouncement = {
        title: '',
        content: '',
        status: 'active',
        imageUrl: null
      };
      this.uploadFile = null;
    },
    async createAnnouncement() {
      try {
        this.loading = true;
        const employeeID = JSON.parse(localStorage.getItem('user'))?.employeeID || null;
        const formData = new FormData();
        formData.append('title', this.currentAnnouncement.title);
        formData.append('content', this.currentAnnouncement.content);
        formData.append('employeeID', employeeID);

        if (this.uploadFile) {
          formData.append('image', this.uploadFile);
        }

        const response = await this.getAnnouncement.createAnnouncement(formData);

        if (response.statusCode === 200) {
          this.closeModal();
          this.fetchAnnouncements();
          alert('สร้างประกาศสำเร็จ');
        } else {
          throw new Error(response.message || 'เกิดข้อผิดพลาดในการสร้างประกาศ');
        }
      } catch (error) {
        console.error('Error creating announcement:', error);
        alert(error.response?.data?.message || error.message || 'เกิดข้อผิดพลาดในการสร้างประกาศ');
      } finally {
        this.loading = false;
        this.uploadFile = null;
      }
    },
    async updateAnnouncement() {
      try {
        const employeeID = JSON.parse(localStorage.getItem('user'))?.employeeID || null;
        const formData = new FormData();
        formData.append('title', this.currentAnnouncement.title);
        formData.append('id', this.currentAnnouncement.id);
        formData.append('content', this.currentAnnouncement.content);
        formData.append('employeeID', employeeID);

        if (this.uploadFile) {
          formData.append('image', this.uploadFile);
        }
        // TODO: Implement actual API call
        const response = await this.getAnnouncement.updateAnnouncement(formData);
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.closeModal();
        this.fetchAnnouncements();
      } catch (error) {
        console.error('Error updating announcement:', error);
      }
    },

    async toggleAnnouncementStatus(announcement) {
      try {
        // console.log(announcement._id)
        const employeeID = JSON.parse(localStorage.getItem('user'))?.employeeID || null;
        // TODO: Implement actual API call
        const response = await this.getAnnouncement.updateStatusAnnouncement(announcement._id,employeeID,announcement.status);
        await new Promise(resolve => setTimeout(resolve, 500));
        announcement.status = announcement.status === 'active' ? 'inactive' : 'active';
        // console.log(response)
        this.fetchAnnouncements();
      } catch (error) {
        console.error('Error toggling announcement status:', error);
      }
    },

    async deleteAnnouncement(announcement) {
      try {
        // console.log('debug ::',announcement.id)
        const employeeID = JSON.parse(localStorage.getItem('user'))?.employeeID || null;
        const response = await this.getAnnouncement.deleteAnnouncement(announcement.id,employeeID);
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.closeDeleteModal();
        this.fetchAnnouncements();
      } catch (error) {
        console.error('Error deleting announcement:', error);
      }
    },
    confirmDelete(announcement) {
      this.selectedAnnouncement = announcement;
      this.showDeleteModal = true;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.selectedAnnouncement = null;
    },
    changePage(page) {
      this.currentPage = page;
      this.fetchAnnouncements();
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          alert('ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 2MB)');
          return;
        }
        if (!file.type.startsWith('image/')) {
          alert('กรุณาอัพโหลดไฟล์รูปภาพเท่านั้น');
          return;
        }

        this.uploadFile = file;

        const reader = new FileReader();
        reader.onload = (e) => {
          this.currentAnnouncement.imageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    removeImage() {
      this.currentAnnouncement.imageUrl = null;
      this.uploadFile = null;
    },
    handleImageError(event) {
      // Replace broken image with a default placeholder
      event.target.src = 'https://via.placeholder.com/40';
    }
  }
};
</script>

<style scoped>
.announcement-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.create-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.create-btn:hover {
  background-color: #45a049;
}

.announcement-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.announcement-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.card-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.delete-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 0.25rem;
}

.card-content {
  margin-bottom: 1rem;
  color: #666;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #888;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-modal {
  text-align: center;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.delete-confirm-btn {
  padding: 0.75rem 1.5rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.no-announcements {
  text-align: center;
  padding: 2rem;
  color: #666;
  background: #f8f9fa;
  border-radius: 8px;
}
</style>
