// src/stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        sessionId: null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.sessionId,
    },
    actions: {
        login(userData) {
            this.user = userData.user
            this.sessionId = userData.sessionId
        },
        logout() {
            this.user = null
            this.sessionId = null
        },
        setSessionId(sessionId) {
            this.sessionId = sessionId
        },
        setUser(user) {
            this.user = user
        },
    },
})
