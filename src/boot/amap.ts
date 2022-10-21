import { boot } from 'quasar/wrappers'
import {initAMapApiLoader} from '@vuemap/vue-amap';
import '@vuemap/vue-amap/dist/style.css'

export const amapJsKey = '8dcb17b2c1269311984efcb5e13c36b4'
export const amapWebKey = '0e573edbf62599678fa2046dc6e25e69'
initAMapApiLoader({
    key: amapJsKey,
    securityJsCode: '728302dd0e976a1ed4b2f674d9ab051d'
})
export default boot(async ({ app}) => {
})
