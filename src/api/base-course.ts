import { DELETE, GET, POST, PUT } from 'boot/axios'

export const  listBaseCourse = (current: Number, limit: Number, queryParam: {}) => POST(`/baseCourse/${current}/${limit}`, queryParam)
export const  postBaseCourse = (params: {}) => POST(`/baseCourse`, params)
export const  putBaseCourse = (params: {}) => PUT(`/baseCourse`, params)
export const  deleteBaseCourseByIds = (batch: {}) => DELETE(`/baseCourse/batch`, batch)
export const  getBaseCourseConditions = () => GET(`/baseCourse/conditions`)
export const  getTableColumns = () => GET(`/baseCourse/table-columns`)
export const  getSelector = () => GET(`/baseCourse/selector`)
