import { defineStore } from "pinia";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

export const useGetAnnouncement = defineStore("GetAnnouncement", {
    state: () => ({
        showGetAnnouncement: [],
        currentPage: 1,
        totalPages: 1,
        totalAnnouncements: 0
    }),
    actions: {
        async getAnnouncementToAddAnnouncement(page = 1) {
            try {
                const response = await api.get("/api/announcements/web", {
                    params: {
                        page: page
                    }
                });
                this.showGetAnnouncement = response.data;
                this.currentPage = response.data.pagination.currentPage;
                this.totalPages = response.data.pagination.totalPages;
                this.totalAnnouncements = response.data.pagination.totalAnnouncements;
                return response.data;
            } catch (error) {
                console.error("Error fetching announcements:", error);
                throw error;
            }
        },

        async createAnnouncement(formData) {
            try {
                const response = await api.post("/api/announcements/send", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                return response.data;
            } catch (error) {
                console.error("Error creating announcement:", error);
                throw error;
            }
        },
        async updateAnnouncement(formData) {
            try {
                let id
                for (const pair of formData.entries()) {

                    if (pair[0] === 'id'){
                        id = pair[1]
                    }
                    console.log(`${pair[0]}: ${pair[1]}`);
                }
                console.log(id)
                const response = await api.patch(`/api/announcements/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                return response.data;
            } catch (error) {
                console.error("Error creating announcement:", error);
                throw error;
            }
        },
        async updateStatusAnnouncement(id, employeeId, status) {
            try {
                let statusUpdate
                if(status === 'inactive'){
                    statusUpdate = 'active'
                }else if(status === 'active'){
                    statusUpdate = 'inactive'
                }
                // console.log("/api/announcements/"+id+"/status")
                const response = await api.patch(`/api/announcements/${id}/status`, {
                    employeeID: employeeId,
                    status:statusUpdate
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                // console.log(response)
                return response;
            } catch (error) {
                console.error("Error creating announcement:", error);
                throw error;
            }
        },
        async deleteAnnouncement(id,employeeId) {
            try {
                const response = await api.delete(`/api/announcements/${id}`,  {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: { employeeID: employeeId }
                });
                console.log(response)
                return response;
            } catch (error) {
                console.error("Error creating announcement:", error);
                throw error;
            }
        },
    },
});