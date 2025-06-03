import { defineStore } from 'pinia'
import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    summary: {
      userCount: 0,
      totalUsers: 0,
      chatGroupCount: 0,
      announcementCount: 0
    },
    recentActivities: [],
    loading: false,
    error: null
  }),

  getters: {
    getDashboardSummary: (state) => state.summary,
    getRecentActivities: (state) => state.recentActivities,
    isLoading: (state) => state.loading,
    getError: (state) => state.error
  },

  actions: {
    async fetchDashboardData() {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.get('/api/rooms/summary')
        const data = response.data

        // Update summary data
        this.summary = {
          userCount: data.users?.total || 0,
          totalUsers: data.users?.max || 0,
          chatGroupCount: data.groups?.total || 0,
          announcementCount: data.announcements?.total || 0
        }

        // Transform recent activities - check if announcements is an array
        if (data.announcements && Array.isArray(data.announcements)) {
          this.recentActivities = data.announcements
            .filter(a => a.status === 'active')
            .slice(0, 5)
            .map(a => ({
              type: 'announcement',
              title: a.title,
              description: a.content,
              imageUrl: a.imageUrl ? (import.meta.env.VITE_API_BASE_URL + a.imageUrl) : null,
              time: a.createdAt
            }))
        } else {
          // If announcements is not an array, fetch them separately
          await this.fetchRecentAnnouncements()
        }

        return { success: true, data: this.summary }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        this.error = 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchRecentAnnouncements() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/announcements/web`)
        const responseData = response.data
        
        // Handle both possible response structures
        let announcements = []
        if (Array.isArray(responseData)) {
          announcements = responseData
        } else if (responseData.announcements && Array.isArray(responseData.announcements)) {
          announcements = responseData.announcements
        }
        
        // Take only the 5 most recent and only active
        this.recentActivities = announcements
          .filter(a => a.status === 'active')
          .slice(0, 5)
          .map(a => ({
            type: 'announcement',
            title: a.title,
            description: a.content,
            imageUrl: a.imageUrl ? (import.meta.env.VITE_API_BASE_URL + a.imageUrl) : null,
            time: a.createdAt
          }))
      } catch (e) {
        console.error('Error fetching announcements:', e)
        this.recentActivities = []
      }
    },

    mapActivityType(type) {
      const typeMap = {
        'announcement': 'announcement',
        'user_register': 'user', 
        'chat': 'chat'
      }
      return typeMap[type] || 'default'
    },

    // Reset store state
    resetState() {
      this.summary = {
        userCount: 0,
        totalUsers: 0,
        chatGroupCount: 0,
        announcementCount: 0
      }
      this.recentActivities = []
      this.loading = false
      this.error = null
    }
  }
})