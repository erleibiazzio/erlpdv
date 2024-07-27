import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
    state: async () => ({
       
    }),
    getters: {
        currentPermissions: (state) => {
            console.log(state)
        },
    },
    actions: {
        setCurrentPermission(permission) {
            this.permission = permission
        },
    },
})
