import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance } from 'axios'
import { useUserStore } from 'src/stores/user_store'
import { ElMessage } from 'element-plus'
import { useMapState } from 'src/stores'
import { router } from 'src/router'
import { LocalStorage } from 'quasar'
import { mapActions } from 'pinia'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}
// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
// console.log(process.env.DEV)
// console.log(process.env.PROD)
// console.log(process.env.DEBUGGING)
// console.log(process.env.CLIENT)
// console.log(process.env.SERVER)

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'https://172.27.63.55/server' : 'http://172.27.63.55:8000/server'
})

if (process.env.MODE === 'electron') {
  api.defaults.baseURL = 'http://172.27.63.55:8000/server'
}
api.defaults.baseURL = 'http://localhost:8000/server'

const amapRequest = axios.create({
  baseURL: 'https://restapi.amap.com/v3/'
})

// 添加响应拦截器
api.interceptors.response.use(response => {
  if (response.data.code === 2000) {
    return response.data
  }
  if (response.data.code >= 5000) {
    ElMessage({
      type: 'error',
      message: response.data.message
    })

    if (response.data.code === 5100) {
      const userAction = mapActions(useUserStore,
        [
          'updateToken',
          'updateUserInfo'])
      // @ts-ignore
      userAction.updateUserInfo({})
      // @ts-ignore
      userAction.updateToken({})
      LocalStorage.remove('token')
      LocalStorage.remove('userInfo')

      router.push({
        path: "/cms/login"
      }).catch(err => {
        console.log(err)
      })

    }
    return Promise.reject(response.data)
  }
  return response
}, error => {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error)
})

export const GET = (url: string, params: {} = {}) => {
  return new Promise((resolve, reject) => {
    api.get(url, { params }
    ).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

export const POST = (url: string, params: {}) => {
  return new Promise((resolve, reject) => {
    api.post(url, { ...params })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export const PUT = (url: string, params: {}) => {
  return new Promise((resolve, reject) => {
    api.put(url, params)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export const DELETE = (url: string, params: {}) => {
  return new Promise((resolve, reject) => {
    api.delete(url, { data: params })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}
export default boot(({
  app,
  router
}) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api
  const {
    token
  } = useMapState(useUserStore, ['token'])
  // 添加请求拦截器
  api.interceptors.request.use(config => {
    // @ts-ignore
    config.headers[token.value.name] = token.value.value
    // @ts-ignore
    console.log(config.headers[token.value.name])
    return config
  }, error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  })
  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api, amapRequest }
