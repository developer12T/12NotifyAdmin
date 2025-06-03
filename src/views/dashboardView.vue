<template>
  <div class="p-4 sm:ml-32">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="p-4 text-red-500 text-center">
      {{ error }}
    </div>

    <!-- Main content -->
    <div v-else class="p-4 mt-14">
      <div class="max-w-5xl">
        <h1 class="text-2xl font-bold">สวัสดี, Hello</h1>
        <p class="py-6">ยินดีต้อนรับเข้าสู่ระบบจัดการ 12Chat</p>

        <!-- Summary Cards Section -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <!-- Users Card -->
          <div class="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div class="flex items-center justify-between mb-4">
              <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
                ผู้ใช้งานทั้งหมด
              </h5>
              <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                ผู้ใช้งาน
              </span>
            </div>
            <div class="flex items-center">
              <div class="inline-flex items-center justify-center p-3 mr-3 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900">
                <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-3xl font-bold">{{ userCount }}</h3>
                <div class="flex gap-3 mt-2">
                  <span class="flex items-center gap-1">
                    <span class="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                    <span class="text-sm text-gray-700 dark:text-gray-200">{{ userStats.active }}</span>
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                    <span class="text-sm text-gray-700 dark:text-gray-200">{{ userStats.inactive }}</span>
                  </span>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  พนักงานทั้งหมด
                </p>
              </div>
            </div>
          </div>

          <!-- Chat Groups Card -->
          <div class="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div class="flex items-center justify-between mb-4">
              <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
                กลุ่มแชททั้งหมด
              </h5>
              <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                กลุ่มแชท
              </span>
            </div>
            <div class="flex items-center">
              <div class="inline-flex items-center justify-center p-3 mr-3 rounded-full bg-green-50 text-green-700 dark:bg-green-900">
                <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                  <path d="M18 4H16V9C16 10.0609 15.5786 11.0783 14.8284 11.8284C14.0783 12.5786 13.0609 13 12 13H9L6.846 14.615C7.17993 14.8628 7.58418 14.9977 8 15H11.667L15.4 17.8C15.5731 17.9298 15.7836 18 16 18C16.2652 18 16.5196 17.8946 16.7071 17.7071C16.8946 17.5196 17 17.2652 17 17V15H18C18.5304 15 19.0391 14.7893 19.4142 14.4142C19.7893 14.0391 20 13.5304 20 13V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4Z"/>
                  <path d="M12 0H2C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V9C0 9.53043 0.210714 10.0391 0.585786 10.4142C0.960859 10.7893 1.46957 11 2 11H3V13C3 13.1857 3.05171 13.3678 3.14935 13.5257C3.24698 13.6837 3.38668 13.8114 3.55279 13.8944C3.71889 13.9775 3.90484 14.0126 4.08981 13.996C4.27477 13.9793 4.45143 13.9114 4.6 13.8L8.333 11H12C12.5304 11 13.0391 10.7893 13.4142 10.4142C13.7893 10.0391 14 9.53043 14 9V2C14 1.46957 13.7893 0.960859 13.4142 0.585786C13.0391 0.210714 12.5304 0 12 0Z"/>
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-3xl font-bold">{{ dashboardSummary.chatGroupCount }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  กลุ่มที่ใช้งานอยู่
                </p>
              </div>
            </div>
          </div>

          <!-- Announcements Card -->
          <div class="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div class="flex items-center justify-between mb-4">
              <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
                ประกาศทั้งหมด
              </h5>
              <span class="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">
                ประกาศ
              </span>
            </div>
            <div class="flex items-center">
              <div class="inline-flex items-center justify-center p-3 mr-3 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900">
                <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-3xl font-bold">{{ announcementStats.total }}</h3>
                <div class="flex gap-3 mt-2">
                  <span class="flex items-center gap-1">
                    <span class="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                    <span class="text-sm text-gray-700 dark:text-gray-200">{{ announcementStats.active }}</span>
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                    <span class="text-sm text-gray-700 dark:text-gray-200">{{ announcementStats.inactive }}</span>
                  </span>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  ประกาศในระบบ
                </p>
              </div>
            </div>
          </div>

        </div>

        <!-- Recent Activity Section -->
        <div class="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div class="flex items-center justify-between mb-4">
            <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
              กิจกรรมล่าสุด
            </h5>
            <router-link to="/announcement" class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
              ดูทั้งหมด
            </router-link>
          </div>
          <div class="flow-root">
            <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
              <li v-for="(activity, index) in recentActivities" :key="index" class="py-3 sm:py-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="getActivityIconClass(activity.type)"> 
                        <img :src="activity.imageUrl" class="w-8 h-8 object-cover rounded-full" alt="ประกาศ" />
                    </div>
                  </div>
                  <div class="flex-1 min-w-0 ms-4">
                    <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                      {{ activity.title }}
                    </p>
                    <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                      {{ activity.description }}
                    </p>
                  </div>
                  <div class="inline-flex items-center text-xs font-semibold text-gray-900 dark:text-white">
                    {{ formatTimeAgo(activity.time) }}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDistanceToNow } from 'date-fns'
import { th } from 'date-fns/locale'
import { useDashboardStore } from '@/stores/modules/dashboard.js'
import { useGetAnnouncement } from '@/stores/modules/announcement.js'
import axios from 'axios'

export default {
  name: 'Dashboard',
  setup() {
    const dashboardStore = useDashboardStore()
    return { dashboardStore }
  },
  data() {
    return {
      announcements: [],
      announcementStats: { active: 0, inactive: 0, total: 0 },
      getAnnouncement: useGetAnnouncement(),
      userCount: 0,
      userStats: { active: 0, inactive: 0 },
      recentActivities: [],
    }
  },
  computed: {
    dashboardSummary() {
      return this.dashboardStore.getDashboardSummary
    },
    loading() {
      return this.dashboardStore.isLoading
    },
    error() {
      return this.dashboardStore.getError
    }
  },
  async created() {
    try {
      await this.dashboardStore.fetchDashboardData()
      await this.fetchAnnouncementStats()
      await this.fetchUserCount()
      await this.fetchRecentAnnouncements()
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  },
  methods: {
    async fetchUserCount() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users`)
        this.userCount = response.data.count || 0
        const users = response.data.data || []
        this.userStats.active = users.filter(u => u.status === 1).length
        this.userStats.inactive = users.filter(u => u.status === 0).length
      } catch (error) {
        console.error('Error fetching user count:', error)
      }
    },
    async fetchAnnouncementStats() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/announcements/web`)
        const announcements = response.data.announcements || []
        this.announcementStats.active = announcements.filter(a => a.status === 'active').length
        this.announcementStats.inactive = announcements.filter(a => a.status === 'inactive').length
        this.announcementStats.total = response.data.pagination?.totalAnnouncements || announcements.length
      } catch (e) {
        this.announcementStats = { active: 0, inactive: 0, total: 0 }
      }
    },
    async fetchRecentAnnouncements() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/announcements/web`)
        const announcements = response.data.announcements || []
        this.recentActivities = announcements
          .filter(a => a.status === 'active')
          .slice(0, 5)
          .map(a => ({
            title: a.title,
            description: a.content,
            imageUrl: a.imageUrl ? (import.meta.env.VITE_API_BASE_URL + a.imageUrl) : null,
            time: a.createdAt
          }))
      } catch (e) {
        this.recentActivities = []
      }
    },
    formatTimeAgo(dateString) {
      try {
        const date = new Date(dateString)
        return formatDistanceToNow(date, { addSuffix: true, locale: th })
      } catch (error) {
        console.error('Error formatting date:', error)
        return 'ไม่ทราบเวลา'
      }
    },
    getActivityIconClass(type) {
      const classes = {
        announcement: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        user: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        chat: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      }
      return classes[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    },
    getActivityIcon(type) {
      if (type === 'announcement') {
        return 'svg-announcement'
      } else if (type === 'user') {
        return 'svg-user'
      } else if (type === 'chat') {
        return 'svg-chat'
      }
      return 'svg-default'
    }
  },
  components: {
    'svg-announcement': {
      template: `
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
        </svg>
      `
    },
    'svg-user': {
      template: `
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
          <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
        </svg>
      `
    },
    'svg-chat': {
      template: `
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
          <path d="M12 0H2C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V9C0 9.53043 0.210714 10.0391 0.585786 10.4142C0.960859 10.7893 1.46957 11 2 11H3V13C3 13.1857 3.05171 13.3678 3.14935 13.5257C3.24698 13.6837 3.38668 13.8114 3.55279 13.8944C3.71889 13.9775 3.90484 14.0126 4.08981 13.996C4.27477 13.9793 4.45143 13.9114 4.6 13.8L8.333 11H12C12.5304 11 13.0391 10.7893 13.4142 10.4142C13.7893 10.0391 14 9.53043 14 9V2C14 1.46957 13.7893 0.960859 13.4142 0.585786C13.0391 0.210714 12.5304 0 12 0Z"/>
        </svg>
      `
    },
    'svg-default': {
      template: `
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Z"/>
        </svg>
      `
    }
  }
}
</script>