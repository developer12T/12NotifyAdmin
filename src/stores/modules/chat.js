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
        async createChat(rawData) {
            try {
                // แยก admin ออกจาก members
                const admin = rawData.members.find(member => member.role === 'admin');
                const members = rawData.members.filter(member => member.role !== 'admin');

                const formData = {
                    name: rawData.name,
                    description: rawData.description,
                    color: rawData.color,
                    imageUrl: '',
                    admin: admin || null, // ถ้าไม่มี admin จะเป็น null
                    members: members
                };
                const response = await api.post("/api/rooms", formData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
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

        async updateRoom(roomId, rawData) {
            try {
                // Check if roomId is valid
                if (!roomId || roomId === 'undefined') {
                    throw new Error('Invalid room ID for update: ' + roomId);
                }

                console.log(rawData)
                // แยก admin ออกจาก members
                const admin = rawData.members.find(member => member.role === 'admin');
                const members = rawData.members.filter(member => member.role !== 'admin');

                const formData = {
                    name: rawData.name,
                    description: rawData.description,
                    color: rawData.color,
                    imageUrl: rawData.imageUrl || '',
                    admin: admin || null, // ถ้าไม่มี admin จะเป็น null
                    members: members
                };

                const response = await api.put(`/api/rooms/${roomId}`, formData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                return response.data;
            } catch (error) {
                console.error("Error updating room:", error);
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
        }
    },
});
