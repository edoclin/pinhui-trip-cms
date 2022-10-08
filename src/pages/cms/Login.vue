<template>
  <div class="bg">
    <div class="background" id="background">
      <div style="margin-top:30px; text-align: center;color: transparent">
        游品慧
      </div>
      <el-input show-word-limit autofocus v-model="loginForm['mobile']" placeholder="请输入手机号" clearable>
        <template #prefix>
          <el-icon><User /></el-icon>
        </template>
      </el-input>

      <el-input show-password type="password" v-model="loginForm['password']" placeholder="请输入密码">
        <template #prefix>
          <el-icon><SvgPassword /></el-icon>
        </template>
      </el-input>

      <drag-verify
          v-if="!showLoginButton && !isElectron"
          radius="5px"
          style="margin-left: 10%;margin-top: 3%"
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
      <el-button v-if="showLoginButton || isElectron" id="loginBtn" color="#626aefbb" type="success"
                 style="width: 80%;margin-left: 10%;margin-top: 3%">登录
      </el-button>
      <el-divider style="margin-top: 5%">
      </el-divider>
      <el-row style="text-align: center;color: #eeeeee49;margin-top: 5%">
        <el-col :span="12">
          <el-link type="success" @click="dialogRegisterFormVisible = true">注册账户</el-link>
        </el-col>
        <el-col :span="12">
          <el-link type="warning">忘记密码</el-link>
        </el-col>
      </el-row>
    </div>

    <el-dialog align-center center destroy-on-close v-model="dialogRegisterFormVisible" title="用户注册">

    </el-dialog>
  </div>
</template>

<script setup>
import dragVerify from 'src/components/dragVerify.vue'
import { ElMessage } from 'element-plus'
import SvgPassword from 'src/components/SvgPassword.vue'

const loginForm = reactive({})
const isPassing = ref(false)
const dragWidth = ref(200)
const isElectron = ref(process.env.MODE === 'electron')

const showLoginButton = ref(false)
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
  background: url(https://sc.68design.net/photofiles/201107/ijDU6irqH2.jpg);
  filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')";
  -moz-background-size: 100% 100%;
  border: transparent dotted 1px;
  background-size: cover;
  width: inherit;
  height: 100vh;
  overflow-scrolling: touch;

  .background {
    background-color: rgba(0, 0, 0, .6);
    margin: 35vh 35%;
    border-radius: 20px;
    height: 28vh;
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
</style>
