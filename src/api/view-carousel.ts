import { DELETE, GET, POST, PUT } from 'boot/axios'

export const  listViewCarousel = (queryParam: {}) => POST(`/viewCarousel/list`, queryParam)
export const  listViewCarouselByPage = (current: number, limit: number, queryParam: {}) => POST(`/viewCarousel/${current}/${limit}`, queryParam)
export const  postViewCarousel = (params: {}) => POST(`/viewCarousel`, params)
export const  putViewCarousel = (params: {}) => PUT(`/viewCarousel`, params)
export const  putViewCarouselBatch = (batch: [], type: string) => PUT(`/viewCarousel/batch/${type}`, batch)
export const  deleteViewCarouselByIds = (batch: {}) => DELETE(`/viewCarousel/batch`, batch)
export const  getViewCarouselConditions = () => GET(`/viewCarousel/conditions`)
export const  getTableColumns = () => GET(`/viewCarousel/table-columns`)
export const  getSelector = () => GET(`/viewCarousel/selector`)
