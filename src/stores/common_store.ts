import { defineStore } from 'pinia'

interface StatusEnum {
    key: string
    name: string
}

interface PreparedRole {
    key: string
    name: string
    roleId: string
}

export const useCommonStore = defineStore('common_store', {
    state: () => ({
        statusEnum: {} as StatusEnum,
        preparedRole: {} as PreparedRole
    }),
    getters: {
    },

    actions: {
        updateStatusEnum(statusEnum: StatusEnum) {
            this.statusEnum = statusEnum
        },
        updatePreparedRole(preparedRole: PreparedRole) {
            this.preparedRole = preparedRole
        }
    }
})


