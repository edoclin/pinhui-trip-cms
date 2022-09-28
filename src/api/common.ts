import { GET } from 'boot/axios'


export const getStatusEnum = () => GET(`/common/status`)
export const getServerInfo = () => GET(`/common/server-info`)
export const getPreparedRole = () => GET(`/role`)
