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

interface CourseVersion {
    key: string
    name: string
}


export const useCommonStore = defineStore('common_store', {
    state: () => ({
        statusEnum: {} as StatusEnum,
        preparedRole: {} as PreparedRole,
        courseVersion: {} as CourseVersion,
    }),
    getters: {
    },

    actions: {
        updateStatusEnum(statusEnum: StatusEnum) {
            this.statusEnum = statusEnum
        },
        updatePreparedRole(preparedRole: PreparedRole) {
            this.preparedRole = preparedRole
        },
        updateCourseVersion(courseVersion: CourseVersion) {
            this.courseVersion = courseVersion
        }
    }
})


