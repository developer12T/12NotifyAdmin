import { defineStore } from "pinia";
import axios from "axios";
import login from "@/authentication/login.vue";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});

export const useBotStore = defineStore("BotData", {
    state: () => ({
        bots: [],
        loading: false,
        error: null
    }),
    getters: {
        getBotById: (state) => (employeeID) => {
            return state.bots.find(bot => bot.employeeID === employeeID);
        }
    },
    actions: {
        async getBotDetails(employeeID) {
            try {
                this.loading = true;
                const response = await api.get(`/api/users/bot/${employeeID}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                return response.data.data;
            } catch (error) {
                console.error('Error fetching bot details:', error);
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async getBotList(id) {
            try {
                this.loading = true;
                const response = await api.get(`/api/users/getBotByUser/${id}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                // Transform the response to match our required structure
                this.bots = response.data.data.map(bot => ({
                    employeeID: bot.employeeID,
                    name: bot.botDetails?.name || '', // Access name from botDetails
                    roomCount: bot.botDetails?.roomCount || 0,
                    requestCount: bot.botDetails?.requestCount || 0,
                    createdAt: bot.botDetails?.createdAt || new Date().toISOString()
                }));
                return this.bots;
            } catch (error) {
                console.error('Error fetching bots:', error);
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async createBot(botData) {
            try {
                this.loading = true;
                console.log('Creating bot with data:', botData);
                // Ensure we only send required fields
                const botPayload = {
                    name: botData.name,
                    roomCount: 0,
                    requestCount: 0,
                    createdBy: botData.createdBy,
                    room: botData.room
                };

                const response = await api.post('/api/users/create-bot', botPayload, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Create bot response:', response.data); // Debug log

                // Add the new bot to our state
                const newBot = {
                    employeeID: response.data.employeeID,
                    name: response.data.name,
                    roomCount: response.data.roomCount || 0,
                    requestCount: response.data.requestCount || 0,
                    createdAt: response.data.createdAt || new Date().toISOString()
                };
                this.bots.push(newBot);
                return response.data;
            } catch (error) {
                console.error('Error creating bot:', error);
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateBot(employeeID, botData) {
            try {
                this.loading = true;
                // Prepare update payload according to API requirements
                const botPayload = {
                    employeeID: employeeID,
                    name: botData.name,
                    requestCount: botData.requestCount,
                    room: botData.rooms.map(room => room._id) // Send array of room IDs
                };

                const response = await api.put('/api/users/update-bot', botPayload, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                // Update bot in our state with the returned data
                const updatedBot = response.data.data;
                const index = this.bots.findIndex(bot => bot.employeeID === employeeID);
                if (index !== -1) {
                    this.bots[index] = {
                        employeeID: updatedBot.employeeID,
                        name: updatedBot.botDetails.name,
                        roomCount: updatedBot.botDetails.roomCount,
                        requestCount: updatedBot.botDetails.requestCount,
                        createdAt: updatedBot.botDetails.createdAt
                    };
                }
                return response.data;
            } catch (error) {
                console.error('Error updating bot:', error);
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteBot(employeeID) {
            try {
                this.loading = true;
                const response = await api.delete('/api/users/delete-bot', {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: { employeeID } // Send employeeID in request body
                });

                // Remove bot from our state
                this.bots = this.bots.filter(bot => bot.employeeID !== employeeID);
                return response.data;
            } catch (error) {
                console.error('Error deleting bot:', error);
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        }
    }
});
