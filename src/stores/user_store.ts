import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'

interface UserInfo {
  mobile: string
  roleKey: string
  roleName: string
}

interface LoginForm {
  mobile: string
  encode: string
}

interface Token {
  name: string
  value: string
}

export const useUserStore = defineStore('user_store', {
  state: () => ({
    token: LocalStorage.getItem('token') || {} as Token,
    userInfo: LocalStorage.getItem('userInfo') || {} as UserInfo,
    clientLoginForm: LocalStorage.getItem('clientLoginForm') || {} as LoginForm
  }),
  getters: {},
  actions: {
    updateToken (token: string) {
      this.token = token
    },
    updateUserInfo (userInfo: UserInfo) {
      this.userInfo = userInfo
    },
    updateLoginForm (clientLoginForm: LoginForm) {
      this.clientLoginForm = clientLoginForm
    },
  },
  persist: {
    enabled: true
  }
})


