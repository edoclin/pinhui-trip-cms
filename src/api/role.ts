import { DELETE, GET, POST, PUT } from 'boot/axios'

export const  listRole = (current: Number, limit: Number, queryParam: {}) => POST(`/customRole/${current}/${limit}`, queryParam)
export const  postRole = (params: {}) => POST(`/customRole`, params)
export const  putRole = (params: {}) => PUT(`/customRole`, params)
export const  deleteRoleByIds = (batch: {}) => DELETE(`/customRole/batch`, batch)
export const  getRoleConditions = () => GET(`/customRole/conditions`)
export const  getTableColumns = () => GET(`/customRole/table-columns`)
export const  getCustomRoleSelector = () => GET(`/customRole/selector`)
