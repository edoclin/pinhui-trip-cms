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
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'https://prod.tugezigui1.com/server' : 'http://localhost:8000/server'
})

const amapRequest = axios.create({
  baseURL: 'https://restapi.amap.com/v3/'
})

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
  const {
    token
  } = useMapState(useUserStore, ['token'])
  api.interceptors.request.use(config => {
    // @ts-ignore
    config.headers[token.value.name] = token.value.value
    // @ts-ignore
    console.log(config.headers[token.value.name])
    return config
  }, error => {
    return Promise.reject(error)
  })
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})
export { api, amapRequest }
