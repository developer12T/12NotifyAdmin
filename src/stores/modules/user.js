import { defineStore } from "pinia";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [],
    count: 0,
    loading: false,
    error: null
  }),
  actions: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get("/api/users");
        this.users = response.data.data;
        this.count = response.data.count;
        return response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
        this.error = error.message || "Failed to fetch users";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    getUserById(employeeID) {
      return this.users.find(user => user.employeeID === employeeID);
    },
    
    getUsersByDepartment(department) {
      if (!department) return [];
      return this.users.filter(user => user.department === department);
    },
    
    getActiveUsers() {
      return this.users.filter(user => user.status === 1);
    },
    
    getAdminUsers() {
      return this.users.filter(user => user.role.toLowerCase() === 'admin');
    }
  },
  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null,
    totalUsers: (state) => state.count,
    activeUsersCount: (state) => state.users.filter(user => user.status === 1).length,
    inactiveUsersCount: (state) => state.users.filter(user => user.status === 0).length
  }
});