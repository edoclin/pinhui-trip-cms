<template>
  <div>
    <el-config-provider :locale="zhCn">
      <el-container>
        <el-aside width="220px">
          <el-menu style="height: calc(100vh - 70px)">
            <el-sub-menu index="base">
              <template #title>
                <el-icon>
                  <Location/>
                </el-icon>
                <span>基地管理</span>
              </template>
              <el-menu-item-group title="基地">
                <el-menu-item index="base/table"
                              @click="clickMenuItem('基地列表', 'BaseTable', 'BaseTable', './base/BaseTable')">
                  <el-icon>
                    <Document/>
                  </el-icon>
                  基地列表
                </el-menu-item>
                <el-menu-item index="base/form"
                              @click="clickMenuItem('新增基地', 'BaseForm', 'BaseForm', './base/BaseForm')">
                  <el-icon>
                    <FolderAdd/>
                  </el-icon>
                  新增基地
                </el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="课程">
                <el-menu-item index="base/course/table"
                              @click="clickMenuItem('课程列表', 'BaseCourseTable', 'BaseCourseTable', './base/course/BaseCourseTable')">
                  <el-icon>
                    <Document/>
                  </el-icon>
                  课程列表
                </el-menu-item>
                <el-menu-item index="base/course/form"
                              @click="clickMenuItem('新增课程', 'BaseCourseForm', 'BaseCourseForm', './base/course/BaseCourseForm')">
                  <el-icon>
                    <FolderAdd/>
                  </el-icon>
                  新增课程
                </el-menu-item>
                <el-menu-item-group title="分类">
                  <el-menu-item index="base/course/category/table"
                                @click="clickMenuItem('分类列表', 'BaseCourseCategoryTable', 'BaseCourseCategoryTable', './base/course/category/BaseCourseCategoryTable')">
                    <el-icon>
                      <Document/>
                    </el-icon>
                    分类列表
                  </el-menu-item>
                  <el-menu-item index="base/course/category/form"
                                @click="clickMenuItem('新增分类', 'BaseCourseCategoryForm', 'BaseCourseCategoryForm', './base/course/category/BaseCourseCategoryForm')">
                    <el-icon>
                      <FolderAdd/>
                    </el-icon>
                    新增分类
                  </el-menu-item>
                </el-menu-item-group>
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="user">
              <template #title>
                <el-icon>
                  <User/>
                </el-icon>
                <span>用户管理</span>
              </template>
              <el-menu-item-group title="用户">
                <el-menu-item index="user/table"
                              @click="clickMenuItem('用户列表', 'UserTable', 'UserTable', './user/UserTable')">
                  <el-icon>
                    <Document/>
                  </el-icon>
                  用户列表
                </el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="角色">
                <el-menu-item index="user/role-table"
                              @click="clickMenuItem('角色列表', 'RoleTable', 'RoleTable', './role/RoleTable')">
                  <el-icon>
                    <Document/>
                  </el-icon>
                  角色列表
                </el-menu-item>
                <el-menu-item index="user/role-form"
                              @click="clickMenuItem('添加角色', 'RoleForm', 'RoleForm', './role/RoleForm')">
                  <el-icon>
                    <FolderAdd/>
                  </el-icon>
                  添加角色
                </el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>

            <el-sub-menu index="pages">
              <template #title>
                <el-icon>
                  <House/>
                </el-icon>
                <span>页面管理</span>
              </template>
              <el-menu-item-group title="小程序端">
                <el-menu-item index="mini/carousel/table"
                              @click="clickMenuItem('轮播图列表', 'ViewCarouselTable', 'ViewCarouselTable', './page/course/ViewCarouselTable')">
                  <el-icon>
                    <Document/>
                  </el-icon>
                  轮播图列表
                </el-menu-item>
                <el-menu-item index="mini/carousel/form"
                              @click="clickMenuItem('新增轮播图', 'ViewCarouselForm', 'ViewCarouselForm', './page/course/ViewCarouselForm')">
                  <el-icon>
                    <FolderAdd/>
                  </el-icon>
                  新增轮播图
                </el-menu-item>
                <el-menu-item index="mini/carousel/list"
                              @click="clickMenuItem('展示状态编辑', 'ViewCarouselList', 'ViewCarouselList', './page/course/ViewCarouselList')">
                  <el-icon>
                    <DataBoard/>
                  </el-icon>
                  展示状态编辑
                </el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="train">
              <template #title>
                <el-icon>
                  <Calendar/>
                </el-icon>
                <span>培训管理</span>
              </template>
              <el-menu-item-group title="课程">
                <el-menu-item index="mini/train/course/table"
                              @click="clickMenuItem('课程列表', 'TrainCourseTable', 'TrainCourseTable', './train/course/TrainCourseTable')">
                  <el-icon>
                    <Document/>
                  </el-icon>
                  课程列表
                </el-menu-item>
                <el-menu-item index="mini/train/course/form"
                              @click="clickMenuItem('新增课程', 'TrainCourseForm', 'TrainCourseForm', './train/course/TrainCourseForm')">
                  <el-icon>
                    <FolderAdd/>
                  </el-icon>
                  新增课程
                </el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分类">
                <el-menu-item index="mini/train/category/table"
                              @click="clickMenuItem('培训课程分类列表', 'TrainCourseCategoryTable', 'TrainCourseCategoryTable', './train/course/category/TrainCourseCategoryTable')">
                  <el-icon>
                    <Document/>
                  </el-icon>
                  分类列表
                </el-menu-item>
                <el-menu-item index="mini/train/category/form"
                              @click="clickMenuItem('培训课程新增分类', 'TrainCourseCategoryForm', 'TrainCourseCategoryForm', './train/course/category/TrainCourseCategoryForm')">
                  <el-icon>
                    <FolderAdd/>
                  </el-icon>
                  新增分类
                </el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="manage" v-if="false">
              <template #title>
                <el-icon>
                  <Setting/>
                </el-icon>
                <span>系统管理</span>
              </template>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <el-container>
          <el-header style="-webkit-app-region: drag">
            <el-menu
                default-active="user"
                mode="horizontal"
                :ellipsis="false">
              <el-avatar shape="square" :size="50" style="user-select: none"
                         src="https://prod-cdn.tugezigui1.com/static/pinhui.trip.logo.trip"/>
              <div style="font-size: 3ch; margin-left: 20px; margin-top: 10px;user-select: none">
                研学实践服务平台
              </div>
              <div style="margin-left: 10px; margin-top: 21px;color: #d6d6d7;user-select: none">
                后台管理系统
              </div>
              <div class="flex-grow"/>
              <div id="guide-dark">
                <el-switch
                    style="margin-top: 12px"
                    v-model="isDark"
                    inline-prompt
                    :active-icon="Moon"
                    :inactive-icon="Sunny"
                    active-color="#2c2c2c"/>
              </div>

              <el-button size="large" text style="margin-top: 8px;" id="guide-fullscreen"
                         :icon="isFullscreen ? SvgExitFullScreen : FullScreen" @click="onToggle($event)"></el-button>

              <el-button v-if="isElectron" size="large" text style="margin-top: 8px;"
                         :icon="SvgMinimizeWindow" @click="onBlur($event) && electronMinimize()"></el-button>

              <el-button v-if="isElectron" size="large" text style="margin-top: 8px;"
                         :icon="SwitchButton" @click="onBlur($event); electronExitDialog = true"></el-button>
              <el-badge v-if="false" :value="99" style="margin-top: 20px;margin-right: 15px;margin-left: 18px">
                <el-icon :size="17">
                  <ChatDotSquare/>
                </el-icon>
              </el-badge>
              <el-sub-menu index="setting" style="user-select: none">
                <template #title>{{ userInfo.realName }}</template>
                <el-menu-item index="change-password" @click="dialogChangePassword = true">修改密码</el-menu-item>
                <el-menu-item index="logout" @click="logout">退出登录</el-menu-item>
              </el-sub-menu>
            </el-menu>
          </el-header>
          <el-main>
            <el-tabs
                id="el-tabs"
                stretch
                style="height: calc(100vh - 100px - 12px)"
                v-model="currentTab.name"
                type="card"
                closable
                @tab-remove="removeTab">
              <el-tab-pane
                  v-for="item in editableTabs"
                  :key="item.key"
                  :label="item.title"
                  :name="item.name">
                <component
                    :is="item.component" :data="children[item.name]"></component>
              </el-tab-pane>
            </el-tabs>
            <el-footer>
              © 2022 武汉图歌信息技术有限责任公司
            </el-footer>
          </el-main>
        </el-container>
      </el-container>
      <el-dialog
          v-if="isElectron"
          v-model="electronExitDialog"
          title="提示"
          width="30%"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :show-close="false"
          center
          align-center>
        <el-result
            icon="warning"
            title="是否退出当前程序？"/>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="electronExitDialog = false">取消</el-button>
                <el-button type="primary" @click="onElectronQuit">确认</el-button>
            </span>
        </template>
      </el-dialog>

      <el-dialog
          v-model="dialogChangePassword"
          title="修改密码"
          width="30%"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :show-close="false"
          center
          align-center>
        <el-form
            ref="changePasswordFormRef"
            :model="changePasswordForm"
            :rules="rules"
            label-width="80px"
            status-icon
        >
          <el-form-item label="原始密码" prop="originalPassword">
            <el-input type="password" show-password v-model="changePasswordForm['originalPassword']" placeholder="请输入原始密码"/>
          </el-form-item>
          <el-form-item label="新的密码" prop="newPassword">
            <el-input type="password" show-password v-model="changePasswordForm['newPassword']" placeholder="请输入新的密码"/>
          </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogChangePassword = false">取消</el-button>
                <el-button type="primary" @click="submitChangePassword(changePasswordFormRef)">确认</el-button>
            </span>
        </template>
      </el-dialog>
    </el-config-provider>
  </div>
</template>
<script setup>

import { mapActions } from 'pinia'
import { Moon, Sunny, FullScreen, SwitchButton } from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { useDark, useToggle } from '@vueuse/core'
import SvgExitFullScreen from 'src/components/SvgExitFullScreen.vue'
import SvgMinimizeWindow from 'src/components/SvgMinimizeWindow.vue'
import screenfull from 'screenfull'
import { useCommonStore } from 'src/stores/common_store'
import { getCourseVersion, getPreparedRole, getStatusEnum } from 'src/api/common'
import { webChangePassword, webLogout } from 'src/api/user'
import { useRouter } from 'vue-router'
import { useUserStore } from 'src/stores/user_store'
import { ElMessage } from 'element-plus'
import { useMapState } from '../../stores'

const {
  userInfo
} = useMapState(useUserStore, ['userInfo'])

const dialogChangePassword = ref(false)
const changePasswordFormRef = ref(null)

const electronMinimize = () => {
  if (isElectron.value) {
    window.$electron.minimizeWindow()
  }
}

const submitChangePassword = (formEl) => {
  formEl.validate((valid) => {
    if (valid) {
      webChangePassword(changePasswordForm).then(res => {
        ElMessage({
          type: 'success',
          message: '密码修改成功'
        })
        logout()
      })
    }
  })
}
const validatePassword = (rule, value, cb) => {
  if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/.test(value))) {
    cb(new Error('密码长度8-16个字符，至少1个大写字母，1个小写字母和1个数字'))
    return false
  }
  cb()
}

const changePasswordForm = reactive({
  originalPassword: '',
  newPassword: ''
})

const rules = reactive({
  originalPassword: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入原始密码'
    },
  ],
  newPassword: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入新的密码'
    },
    {
      validator: validatePassword,
      trigger: 'blur'
    },
  ],
})

const pageModules = import.meta.glob('./**/**/**/**/**.vue')
const bus = inject('bus')
const commonActions = mapActions(useCommonStore,
    [
      'updateStatusEnum',
      'updatePreparedRole',
      'updateCourseVersion'])

const isElectron = ref(process.env.MODE === 'electron')

if (isElectron.value) {
  const CtrlWCloseTab = () => {
    removeTab(currentTab.name)
  }

  const switchCloseTab = () => {
    let findIndex = editableTabs.findIndex(item => item.name === currentTab.name)
    if (editableTabs.length === 1) {
      return
    }
    currentTab.name = editableTabs[(findIndex + 1) % editableTabs.length].name
  }

  window.$electron.closeTab(CtrlWCloseTab)
  window.$electron.switchTab(switchCloseTab)
}

const isFullscreen = ref(false)

const electronExitDialog = ref(false)

const change = () => {
  isFullscreen.value = screenfull.isFullscreen
}

const onElectronQuit = () => {
  window.$electron.exitApp()
}

const onBlur = (evt) => {
  let target = evt.target
  if (target.nodeName === 'svg') {
    target = evt.target.parentNode.parentNode
  }
  target.blur()
  return true
}

const onToggle = (evt) => {
  onBlur(evt)
  screenfull.toggle()
}

const itemRefs = ref([])

const router = useRouter()
const userAction = mapActions(useUserStore,
    [
      'updateToken',
      'updateUserInfo'])

const localStorage = inject('localStorage')

const logout = () => {
  webLogout().then(res => {
    userAction.updateToken({})
    userAction.updateUserInfo({})
    localStorage.remove('token')
    localStorage.remove('userInfo')
    router.push({
      path: '/cms/login'
    })
  })
}

onMounted(() => {
  screenfull.on('change', change)
  getStatusEnum().then(res => {
    commonActions.updateStatusEnum(res.data)
    getPreparedRole().then(res => {
      commonActions.updatePreparedRole(res.data)
      getCourseVersion().then(res => {
        commonActions.updateCourseVersion(res.data)
      })
    })
  })
})

onUnmounted(() => {
  screenfull.off('change', change)
})

const elTabRef = ref(null)

const isDark = useDark()

const toggleDark = useToggle(isDark)

const editableTabs = reactive([])
let currentTab = reactive({
  name: ''
})

pageModules[`./Help.vue`]().then(item => {
  editableTabs.push({
    component: markRaw(item.default),
    title: '登录成功',
    name: 'LoginSuccess',
    key: 'LoginSuccess'
  })
  currentTab.name = editableTabs[0].name
})

let data = reactive({
  isCollapse: false
})

const clickMenuItem = (title, name, key, componentPath) => {
  if (editableTabs.find(item => item.name === name) !== undefined) {
    currentTab.name = name
  } else {
    pageModules[`${componentPath}.vue`]().then(item => {
      editableTabs.push({
        component: markRaw(item.default),
        title: title,
        name: name,
        key: key
      })
      currentTab.name = name
    })
  }
}

const removeTab = (name) => {
  let index = editableTabs.findIndex(item => item.name === name)
  // chrome 标签
  if (index === 0 && editableTabs.length === 1) {
    // todo: 打开引导页
  } else if (index === editableTabs.length - 1) {
    //最后一个标签 -> 打开前一个标签
    currentTab.name = editableTabs[index - 1].name
  } else {
    // 打开后一个标签
    currentTab.name = editableTabs[index + 1].name
  }
  editableTabs.splice(index, 1)
  delete children[name]
}

const children = reactive({})

bus.on('edit-item', ({
  record,
  component,
  title,
  name
}) => {
  if (editableTabs.find(item => item.name === name) !== undefined) {
    currentTab.name = name
  } else {
    editableTabs.push({
      component: markRaw(component),
      title: title,
      name: name,
      key: component.__name
    })
    children[name] = record
    currentTab.name = name
  }
})
</script>
<style>
.flex-grow {
  flex-grow: 1;
}

.el-container {
  height: 100%;
}

.el-header {
  margin-top: 10px;
  position: relative;
  width: 100%;
  height: 60px;
}

.el-footer {
  position: fixed;
  right: 3%;
  font-size: 12px;
  height: 12px;
  color: #676a6c;
}

.el-aside {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
}

.el-main {
  position: absolute;
  left: 200px;
  right: 0;
  top: 70px;
  bottom: 0;
}
</style>
