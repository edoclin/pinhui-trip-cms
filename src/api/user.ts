import { DELETE, GET, POST, PUT } from 'boot/axios'

export const  listUser = (current: Number, limit: Number, queryParam: {}) => POST(`/user/${current}/${limit}`, queryParam)
export const  postUser = (params: {}) => POST(`/user`, params)
export const  putUser = (params: {}) => PUT(`/user`, params)
export const  deleteUserByIds = (batch: {}) => DELETE(`/user/batch`, batch)
export const  getUserConditions = () => GET(`/user/conditions`)
export const  getTableColumns = () => GET(`/user/table-columns`)
export const  getValidateCode = (mobile: string) => GET(`/user/code/${mobile}`)
export const  webLogin = (params: {}) => POST(`/user/login`, params)
export const  webCheck = () => GET(`/user/check`)
export const  webLogout = () => GET(`/user/logout`)
export const  webChangePassword = (param: {}) => PUT(`/user/change-password`, param)
