import { DELETE, GET, POST, PUT } from 'boot/axios'

export const  listBaseCourseCategory = (current: Number, limit: Number, queryParam: {}) => POST(`/baseCourseCategory/${current}/${limit}`, queryParam)
export const  postBaseCourseCategory = (params: {}) => POST(`/baseCourseCategory`, params)
export const  putBaseCourseCategory = (params: {}) => PUT(`/baseCourseCategory`, params)
export const  deleteBaseCourseCategoryByIds = (batch: {}) => DELETE(`/baseCourseCategory/batch`, batch)
export const  getBaseCourseCategoryConditions = () => GET(`/baseCourseCategory/conditions`)
export const  getTableColumns = () => GET(`/baseCourseCategory/table-columns`)
export const  getBaseCourseCategorySelector = () => GET(`/baseCourseCategory/selector`)
export const  listRelatedCourseById = (categoryId: string) => GET(`/baseCourseCategory/related-course/${categoryId}`)
