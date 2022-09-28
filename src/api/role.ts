import { DELETE, GET, POST, PUT } from 'boot/axios'

const defaultQueryParam = {
    isAsc: false,
    orderColumns: ['created_time']
}

export const  listRole = (current: Number, limit: Number, queryParam: {}) => POST(`/customRole/${current}/${limit}`, queryParam)
export const  postRole = (params: {}) => POST(`/customRole`, params)
export const  putRole = (params: {}) => PUT(`/customRole`, params)
export const  deleteRoleByIds = (batch: {}) => DELETE(`/customRole/batch`, batch)
export const  getRoleConditions = () => GET(`/customRole/conditions`)
export const  getTableColumns = () => GET(`/customRole/table-columns`)
