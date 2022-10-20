import { DELETE, GET, POST, PUT } from 'boot/axios'

export const  listTrainCourseCategory = (current: Number, limit: Number, queryParam: {}) => POST(`/trainCourseCategory/${current}/${limit}`, queryParam)
export const  postTrainCourseCategory = (params: {}) => POST(`/trainCourseCategory`, params)
export const  getTrainCourseCategoryById = (courseId: string) => GET(`/trainCourseCategory/${courseId}`, {})
export const  putTrainCourseCategory = (params: {}) => PUT(`/trainCourseCategory`, params)
export const  deleteTrainCourseCategoryByIds = (batch: {}) => DELETE(`/trainCourseCategory/batch`, batch)
export const  getTrainCourseCategoryConditions = () => GET(`/trainCourseCategory/conditions`)
export const  getTableColumns = () => GET(`/trainCourseCategory/table-columns`)
export const  getTrainCourseCategorySelector = () => GET(`/trainCourseCategory/selector`)
