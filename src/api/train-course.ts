import { DELETE, GET, POST, PUT } from 'boot/axios'

export const  listTrainCourse = (current: Number, limit: Number, queryParam: {}) => POST(`/trainCourse/${current}/${limit}`, queryParam)
export const  postTrainCourse = (params: {}) => POST(`/trainCourse`, params)
export const  getTrainCourseById = (courseId: string) => GET(`/trainCourse/${courseId}`, {})
export const  putTrainCourse = (params: {}) => PUT(`/trainCourse`, params)
export const  deleteTrainCourseByIds = (batch: {}) => DELETE(`/trainCourse/batch`, batch)
export const  getTrainCourseConditions = () => GET(`/trainCourse/conditions`)
export const  getTableColumns = () => GET(`/trainCourse/table-columns`)
export const  getTrainCourseSelector = () => GET(`/trainCourse/selector`)
