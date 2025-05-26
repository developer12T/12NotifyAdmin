import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: JSON.parse(localStorage.getItem("token")) || null,
    statusToken: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.user && !!state.token,
    userData: (state) => state.user,
  },
  actions: {
    async login(userLogin, passwordLogin) {
      try {
        const response = await axios.post(
          import.meta.env.VITE_API_BASE_URL + "/api/auth/login",
          { username: userLogin, password: passwordLogin },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      
        if (response.data.statusCode === 200) {
          // Update store state with the first user from data array
          this.user = response.data.data[0];
          this.token = response.token;
          
          // Set axios default headers for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
          
          return {
            status: response.data.statusCode,
            data: response.data.data,
            token: response.data.token
          };
        } else {
          throw new Error("การล็อกอินล้มเหลว");
        }
      } catch (error) {
        console.error("Login failed:", error);
        this.user = null;
        this.token = null;
        
        if (error.response) {
          throw new Error(error.response.data.message || "การล็อกอินล้มเหลว");
        } else if (error.request) {
          throw new Error("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        } else {
          throw new Error("เกิดข้อผิดพลาดขณะล็อกอิน");
        }
      }
    },

    async checkAuth() {
      try {
        if (!this.token) return false;
        
        const response = await axios.post(
          import.meta.env.VITE_API_BASE_URL + "/api/auth/check-token",
          {},
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );
        
        this.statusToken = response.status;
        return response.status === 200;
      } catch (error) {
        console.error("Auth check failed:", error);
        this.logout();
        return false;
      }
    },

    logout() {
      // Clear store state
      this.user = null;
      this.token = null;
      this.statusToken = null;
      
      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      
      // Clear axios default headers
      delete axios.defaults.headers.common['Authorization'];
      
      // Redirect to login page
      window.location.href = '/login';
    }
  },
});