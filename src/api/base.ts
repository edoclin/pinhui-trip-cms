import { DELETE, GET, POST, PUT } from 'boot/axios'

const defaultQueryParam = {
    isAsc: false,
    orderColumns: ['created_time']
}

export const  listBase = (current: Number, limit: Number, queryParam: {}) => POST(`/base/${current}/${limit}`, queryParam)
export const  postBase = (params: {}) => POST(`/base`, params)
export const  putBase = (params: {}) => PUT(`/base`, params)
export const  deleteBaseByIds = (batch: {}) => DELETE(`/base/batch`, batch)
export const  getBaseConditions = () => GET(`/base/conditions`)
export const  getTableColumns = () => GET(`/base/table-columns`)
export const  getSelector = () => GET(`/base/selector`)
