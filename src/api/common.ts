import { GET, MDRequest } from 'boot/axios'


export const getStatusEnum = () => GET(`/common/status`)
export const getCarouselType = () => GET(`/common/carousel`)
export const getServerInfo = () => GET(`/common/server-info`)
export const getPreparedRole = () => GET(`/role`)
export const getCourseVersion = () => GET(`/common/course-version`)
export const getCourseVersionPartByVersion = (version: string) => GET(`/common/course-version-part/${version}`)
export const generateAccessUrl = (path: string) => GET(`/common/access-url`, {path: path})
export const helpMD = () => MDRequest.get('/help.md')
export const userGuideMD = () => MDRequest.get('/user-guide.md')
