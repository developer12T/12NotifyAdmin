import { defineStore } from "pinia";
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});

export const useEmployeeStore = defineStore("EmployeeData", {
    state: () => ({
        employees: [],
        loading: false,
        error: null,
        selectedEmployee: null
    }),

    getters: {
        
        getEmployeesByDepartment() {
            return (department) => this.employees.filter(emp => emp.department === department);
        },
        getActiveEmployees() {
            return this.employees.filter(emp => emp.status === 1);
        },
        getAdminEmployees() {
            return this.employees.filter(emp => emp.role === 'admin');
        }
    },

    actions: {
        async getEmployeeList() {
            try {
                this.loading = true;
                const response = await api.get('/api/users', {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.data && response.data.data) {
                    this.employees = response.data.data;
                }
                return response.data;
            } catch (error) {
                console.error('Error fetching employees:', error);
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

      

        setSelectedEmployee(employee) {
            this.selectedEmployee = employee;
        },

        clearSelectedEmployee() {
            this.selectedEmployee = null;
        },

        clearError() {
            this.error = null;
        }
    }
}); 