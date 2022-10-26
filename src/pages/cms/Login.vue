<template>
  <div class="bg">
    <div class="background" id="background">
      <div style="margin-top:30px; text-align: center;color: transparent">
        游品慧
      </div>
      <el-input show-word-limit autofocus v-model="loginForm['mobile']" placeholder="请输入手机号" clearable>
        <template #prefix>
          <el-icon>
            <User/>
          </el-icon>
        </template>
      </el-input>
      <el-input show-password type="password" v-model="loginForm['password']" placeholder="请输入密码">
        <template #prefix>
          <el-icon>
            <SvgPassword/>
          </el-icon>
        </template>
      </el-input>

      <drag-verify
          v-if="!showLoginButton && !isElectron"
          radius="5px"
          style="margin-left: 10%;margin-top: 15px"
          :isPassing.sync="isPassing"
          :width="dragWidth"
          :height="32"
          text="请按住滑块拖动完成验证"
          textColor="#1b1a25"
          successText="验证通过"
          handlerIcon="el-icon-d-arrow-right"
          successIcon="el-icon-circle-check"
          @passcallback="handlePassCallback"
      >
      </drag-verify>
      <el-button :loading="loadingLogin" v-if="showLoginButton || isElectron" id="loginBtn" color="#626aefbb" type="success"
                 style="width: 80%;margin-left: 10%;margin-top: 15px" @click="login">登录
      </el-button>
      <el-divider style="margin-top: 15px">
      </el-divider>
      <el-row style="text-align: center;color: #eeeeee49;margin-top: 15px">
        <el-col :span="12">
          <el-link type="success" @click="dialogRegisterFormVisible = true">注册账户</el-link>
        </el-col>
        <el-col :span="12">
          <el-link type="warning">忘记密码</el-link>
        </el-col>
      </el-row>
    </div>

    <el-dialog width="30%" align-center center destroy-on-close v-model="dialogRegisterFormVisible" title="用户注册">
      <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="rules"
          label-width="120px"
          status-icon
      >
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="registerForm['idCard']" placeholder="请输入18位身份证号"/>
        </el-form-item>
        <el-form-item label="真实姓名" prop="name">
          <el-input v-model="registerForm['name']" placeholder="请输入真实姓名"/>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="registerForm['mobile']" placeholder="请输入11位手机号">
            <template #suffix v-if="showSendCode">
              <el-button :disabled="disableCode" type="success" size="small" @click="sendCode">
                {{ disableCode && showCodeField ? timeout + '秒后获取' : '获取验证码' }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="validateCode" v-show="showCodeField">
          <el-input v-model="registerForm['validateCode']" placeholder="请输入验证码"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input show-password type="password" v-model="registerForm['password']" placeholder="请输入密码">
          </el-input>
        </el-form-item>
        <el-form-item label="注册说明">
          <el-input v-model="registerForm['desc']" placeholder="请输入留言(注册原因, 所需权限等)"/>
        </el-form-item>


      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogRegisterFormVisible = false">取消</el-button>
        <el-button :loading="loadingRegister" type="primary"
                   @click="submitRegisterForm(registerFormRef)">注册</el-button>
      </span>
      </template>
    </el-dialog>
    <el-footer>
      © 2022 武汉图歌信息技术有限责任公司
    </el-footer>
  </div>
</template>

<script setup>
import dragVerify from 'src/components/dragVerify.vue'
import { ElMessage } from 'element-plus'
import SvgPassword from 'src/components/SvgPassword.vue'
import { getValidateCode, postUser, webLogin } from 'src/api/user'
import { mapActions } from 'pinia'
import { useUserStore } from 'src/stores/user_store'
import { useRouter } from 'vue-router'

const router = useRouter()
const registerFormRef = ref(null)
const disableCode = ref(true)
const showSendCode = ref(false)
const showCodeField = ref(false)
const loadingRegister = ref(false)
const loadingLogin = ref(false)
const userAction = mapActions(useUserStore,
    [
      'updateToken',
      'updateUserInfo'])

const localStorage = inject('localStorage')

const login = () => {
  loginForm['isElectron'] = isElectron
  loadingLogin.value = true
  webLogin(loginForm).then(res => {
    let value = {
      name: res.data['tokenName'],
      value: res.data['tokenValue'],
    }
    userAction.updateToken(value)
    localStorage.set('token', value)
    delete res.data['tokenName']
    delete res.data['tokenValue']

    localStorage.set('userInfo', res.data)
    userAction.updateUserInfo(res.data)
    router.push({
      path: '/cms'
    })
  }).catch(err => {
    loadingLogin.value = false
  })
}
const registerForm = reactive({
  mobile: '',
  idCard: '',
  name: '',
  password: ''
})

const timeout = ref(60)
const timer = ref(null)

const sendCode = () => {
  getValidateCode(registerForm['mobile']).then(res => {
    ElMessage({
      type: 'success',
      message: '验证码获取成功(5分钟内有效)'
    })
    showCodeField.value = true
    disableCode.value = true
    timer.value = setInterval(() => {
      timeout.value--
      if (!timeout.value) {
        clearInterval(timer.value)
        disableCode.value = false
        timeout.value = 60
      }
    }, 1000)
  })
}

const validateMobile = (rule, value, cb) => {
  if (!(/^1[3|4|5|7|8|9]\d{9}$/.test(value))) {
    cb(new Error('请输入11位手机号'))
    disableCode.value = true
    return false
  }
  showSendCode.value = true
  disableCode.value = false
  cb()
}

const validateIdCard = (rule, value, cb) => {
  if (!(/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value))) {
    cb(new Error('请输入有效的18位身份证号'))
    return false
  }
  cb()
}

const validatePassword = (rule, value, cb) => {
  if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/.test(value))) {
    cb(new Error('密码长度8-16个字符，至少1个大写字母，1个小写字母和1个数字'))
    return false
  }
  cb()
}


const validateCode = (rule, value, cb) => {
  if (!showCodeField.value) {
    ElMessage({
      type: "error",
      message: '请先点击获取验证码'
    })
    cb(new Error('请先点击获取验证码'))
    return false
  }
  if (!value || value.length !== 6) {
    cb(new Error('请输入合法的验证码'))
    return false
  }
  cb()
}
const rules = reactive({
  mobile: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入手机号'
    },
    {
      validator: validateMobile,
      trigger: 'blur'
    },
  ],
  name: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入真实姓名'
    }
  ],
  validateCode: [
    {
      validator: validateCode,
      trigger: 'blur'
    },
  ],
  idCard: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入身份证号'
    },
    {
      validator: validateIdCard,
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入登录密码'
    },
    {
      validator: validatePassword,
      trigger: 'blur'
    }
  ],
})

const submitRegisterForm = (el) => {
  loadingRegister.value = true
  el.validate((valid) => {
    if (valid) {
      loadingRegister.value = true
      postUser(registerForm).then(res => {
        loginForm.mobile = registerForm.mobile
        el.resetFields()
        dialogRegisterFormVisible.value = false
        ElMessage({
          type: 'success',
          message: res.data
        })
        loadingRegister.value = false
      }).catch(err => {
        loadingRegister.value = false
      })
    } else {
      loadingRegister.value = false
      return false
    }
  })
}

const loginForm = reactive({})
const isPassing = ref(false)
const dragWidth = ref(200)
const isElectron = ref(process.env.MODE === 'electron')
const showLoginButton = ref(process.env.NODE_ENV !== 'production')
const dialogRegisterFormVisible = ref(false)

const handlePassCallback = () => {
  ElMessage({
    type: 'success',
    message: '验证通过'
  })
  setTimeout(() => {
    showLoginButton.value = true
  }, 2000)
}
onMounted(() => {
  dragWidth.value = window.document.getElementById('background').clientWidth * 0.8
  window.onresize = () => {
    return (() => {
      dragWidth.value = window.document.getElementById('background').clientWidth * 0.8
    })()
  }
})
</script>
<style lang="scss">
.bg {
  background: url(https://prod-cdn.tugezigui1.com/static/pinhui.trip.cms.bg.trip);
  filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')";
  -moz-background-size: 100% 100%;
  border: transparent dotted 1px;
  background-size: cover;
  width: inherit;
  height: 100vh;
  overflow-scrolling: touch;
  overflow-y: hidden;

  .background {
    background-color: rgba(0, 0, 0, .6);
    margin: 35vh 35vw;
    border-radius: 20px;
    height: 26vh;

    .el-divider {
    }

    .el-divider--horizontal {
      border-radius: 5px;
      border-top: 2px #eeeeee49 solid;
      margin: 5px 5%;
      width: 90%;

      .el-divider__text {
        background-color: transparent;
        color: #eeeeee49;
      }
    }

    .el-input {
      margin: 2% 10%;
      width: 80%;
      background-color: rgba(0, 0, 0, .3);
      border: none;

      .el-input__wrapper {
        background-color: rgba(0, 0, 0, .2);
        box-shadow: 3px 3px 10px rgba(0, 0, 0, .9);

        .el-input__inner {
          color: rgba(255, 255, 255, 0.74);
          background-color: transparent;
          text-align: center;
        }
      }
    }
  }
}

.el-footer {
  font-size: 12px;
  height: 12px;
  color: #a6a8ae;
  text-align: center;
}
</style>
