import { DELETE, GET, POST, PUT } from 'boot/axios'

const defaultQueryParam = {
    isAsc: false,
    orderColumns: ['created_time']
}

export const  listUser = (current: Number, limit: Number, queryParam: {}) => POST(`/user/${current}/${limit}`, queryParam)
export const  postUser = (params: {}) => POST(`/user`, params)
export const  putUser = (params: {}) => PUT(`/user`, params)
export const  deleteUserByIds = (batch: {}) => DELETE(`/user/batch`, batch)
export const  getUserConditions = () => GET(`/user/conditions`)
export const  getTableColumns = () => GET(`/user/table-columns`)
