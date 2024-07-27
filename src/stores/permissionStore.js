/* eslint-disable no-unused-vars */
import { defineStore } from 'pinia'
import { loadModel } from '../Helpers/loadModels'
import { ucfirst } from '../Helpers/Utils'

export const usePermissionStore = defineStore('permission', {
    state: async () => ({
        can: false
    }),
    getters: {
        currentPermissions: (state) => {
            console.log(state)
        },
    },
    actions: {
        async canUser(item, action) {
            const model = await loadModel(ucfirst(item.modelType))
            const entity = await model.findBy({id: item.id});
            return await entity.canUser(action);
        },
        setCurrentPermission(permission) {
            this.permission = permission
        },
    },
})
