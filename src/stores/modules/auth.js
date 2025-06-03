import { defineStore } from "pinia";
import axios from "axios";
import router from "@/router";

export const useAuthStore = defineStore("auth", {
  state: () => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      
      // Clear invalid data
      if (storedUser === "undefined" || storedToken === "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        return {
          user: null,
          token: null,
          statusToken: null,
        };
      }

      return {
        user: storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null,
        token: storedToken && storedToken !== "undefined" ? JSON.parse(storedToken) : null,
        statusToken: null,
      };
    } catch (error) {
      console.error("Error initializing auth state:", error);
      // Clear potentially corrupted data
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return {
        user: null,
        token: null,
        statusToken: null,
      };
    }
  },
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
      
        if (response.data.statusCode === 200 && response.data.data && response.data.data[0] && response.data.token) {
          const userData = response.data.data[0];
          const token = response.data.token;
          
          // Validate data before storing
          if (!userData || !token) {
            throw new Error("ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง");
          }

          // Update store state
          this.user = userData;
          this.token = token;
          
          // Set axios default headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Save to localStorage with validation
          try {
            localStorage.setItem('token', JSON.stringify(token));
            localStorage.setItem('user', JSON.stringify(userData));
          } catch (storageError) {
            console.error("Error saving to localStorage:", storageError);
            // Clear any partial data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            throw new Error("ไม่สามารถบันทึกข้อมูลการเข้าสู่ระบบได้");
          }
          
          // Navigate to dashboard
          await router.push('/dashboard');
          
          return {
            status: response.data.statusCode,
            data: response.data.data,
            token: token
          };
        } else {
          throw new Error("การล็อกอินล้มเหลว");
        }
      } catch (error) {
        // Clear any partial state
        this.user = null;
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        console.error("Login failed:", error);
        
        if (error.response) {
          throw new Error(error.response.data.message || "การล็อกอินล้มเหลว");
        } else if (error.request) {
          throw new Error("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        } else {
          throw new Error(error.message || "เกิดข้อผิดพลาดขณะล็อกอิน");
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

    async logout() {
      try {
        // Clear auth state
        this.user = null;
        this.token = null;
        this.statusToken = null;
        
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Clear axios headers
        delete axios.defaults.headers.common['Authorization'];
        
        // Navigate to login page
        await router.push('/');
      } catch (error) {
        console.error('Logout error:', error);
        // Even if there's an error, try to clear everything
        this.user = null;
        this.token = null;
        this.statusToken = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        await router.push('/');
      }
    }
  },
});