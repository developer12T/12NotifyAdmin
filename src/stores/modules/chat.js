import { defineStore } from "pinia";
import axios from "axios";
import login from "@/authentication/login.vue";
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});
export const useChatStore = defineStore("ChatData", {
    state: () => ({
        showGetChat: [],
    }),
    actions: {
        async getChatList() {
            try {
                const response = await api.get("/api/rooms/web",{
                    headers: {
                    'Content-Type': 'application/json'
                }});
                this.rooms = response.data;
                return response.data;
                // console.log(response.data)
                // console.log("showGetDrug", this.showGetDrug);
            } catch (error) {
                console.log(error);
            }
        },
        async createChat(formData) {
            try {
                let config = {};
                if (formData instanceof FormData) {
                    config.headers = { 'Content-Type': 'multipart/form-data' };
                }
                const response = await api.post("/api/rooms", formData, config);
                return response.data;
            } catch (error) {
                console.error("Error creating chat:", error);
                throw error;
            }
        },

        async getRoomById(roomId) {
            try {
                console.log(roomId)
                // Check if roomId is valid
                if (!roomId || roomId === 'undefined') {
                    throw new Error('Invalid room ID: ' + roomId);
                }

                const response = await api.get(`/api/rooms/${roomId}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                return response.data;
            } catch (error) {
                console.error("Error fetching room:", error);
                throw error;
            }
        },

        async updateRoom(roomId, formData) {
            try {
                // Check if roomId is valid
                if (!roomId || roomId === 'undefined') {
                    throw new Error('Invalid room ID for update: ' + roomId);
                }

                console.log('Updating room with FormData:', formData);
                
                // Set proper headers for multipart/form-data
                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                };

                const response = await api.put(`/api/rooms/${roomId}`, formData, config);
                return response.data;
            } catch (error) {
                console.error("Error updating room:", error);
                if (error.response) {
                    console.error("Error response data:", error.response.data);
                }
                throw error;
            }
        },

        async deleteRoom(roomId,employeeId) {
            try {
                const response = await api.delete(`/api/rooms/${roomId}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data:{employeeID:employeeId}
                });
                return response.data;
            } catch (error) {
                console.error("Error updating room:", error);
                throw error;
            }
        },

        async sendTestMessage(roomId, message, employeeId, isAdminNotification = true, replyToId = '') {
            try {
                const payload = {
                    roomId: [roomId],
                    message: [message],
                    employeeId: employeeId,
                    isAdminNotification: isAdminNotification,
                    replyToId: replyToId
                };

                console.log('Sending test message with payload:', payload);

                const response = await api.post('/api/messages/send', payload, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Test message response:', response.data);
                return response.data;
            } catch (error) {
                console.error("Error sending test message:", error);
                if (error.response) {
                    console.error("Error response data:", error.response.data);
                }
                throw error;
            }
        }
    },
});
