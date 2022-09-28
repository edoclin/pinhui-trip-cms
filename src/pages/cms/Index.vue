<template>
  <div>
    <el-container>
      <el-aside width="200px">
        <el-menu style="height: calc(100vh - 70px)">
          <el-sub-menu index="base">
            <template #title>
              <el-icon>
                <location/>
              </el-icon>
              <span>基地管理</span>
            </template>
            <el-menu-item index="base/table"
                          @click="clickMenuItem('基地列表', 'baseTable', 'baseTable', './base/BaseTable')">
              <el-icon>
                <Document/>
              </el-icon>
              基地列表
            </el-menu-item>
            <el-menu-item index="base/form"
                          @click="clickMenuItem('新增基地', 'baseForm', 'baseForm', './base/BaseForm')">
              <el-icon>
                <FolderAdd/>
              </el-icon>
              新增基地
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="user">
            <template #title>
              <el-icon>
                <location/>
              </el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item index="user/table"
                          @click="clickMenuItem('用户列表', 'userTable', 'userTable', './user/UserTable')">
              <el-icon>
                <Document/>
              </el-icon>
              用户列表
            </el-menu-item>
            <el-menu-item index="user/role-table"
                          @click="clickMenuItem('角色列表', 'roleTable', 'roleTable', './role/RoleTable')">
              <el-icon>
                <Document/>
              </el-icon>
              角色列表
            </el-menu-item>
            <el-menu-item index="user/role-form"
                          @click="clickMenuItem('添加角色', 'roleForm', 'roleForm', './role/RoleForm')">
              <el-icon>
                <Document/>
              </el-icon>
              添加角色
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="manage">
            <template #title>
              <el-icon>
                <location/>
              </el-icon>
              <span>系统管理</span>
            </template>
<!--            <el-menu-item index="manage/server"-->
<!--                          @click="clickMenuItem('服务器状态', 'Server', 'Server', './manage/Server')">-->
<!--              <el-icon>-->
<!--                <Document/>-->
<!--              </el-icon>-->
<!--              服务器状态-->
<!--            </el-menu-item>-->
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <el-menu
              default-active="user"
              mode="horizontal"
              :ellipsis="false">
            <el-menu-item index="logo">
              <el-avatar shape="square" :size="50"
                         src="https://dev-edoclin-1304812488.cos.ap-chongqing.myqcloud.com/static/pinhui.trip.logo.jpg"/>
            </el-menu-item>
            <el-menu-item index="info">
              <div style="font-size: 3ch">
                研学实践服务平台
              </div>
            </el-menu-item>
            <el-menu-item index="addition" disabled>
              后台管理系统
            </el-menu-item>
            <div class="flex-grow"/>
            <el-switch
                style="margin-top: 12px"
                v-model="isDark"
                inline-prompt
                :active-icon="SvgDark"
                :inactive-icon="SvgLight"
                active-color="#2c2c2c"
            />
            <el-button size="large" text style="margin-top: 8px;" type="plain"
                       :icon="isFullscreen ? SvgExitFullScreen :SvgFullScreen" @click="onToggle"></el-button>
            <el-menu-item index="message">通知</el-menu-item>
            <el-sub-menu index="setting">
              <template #title>设置</template>
              <el-menu-item index="change-password">修改密码</el-menu-item>
              <el-menu-item index="dark" @click="toggleDark()">
                {{ isDark }}
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-header>
        <el-main>
          <el-tabs style="height: calc(100vh - 100px - 12px)"
                   v-model="currentTab.name"
                   type="card"
                   closable
                   @tab-remove="removeTab">
            <el-tab-pane
                v-for="item in editableTabs"
                :key="item.key"
                :label="item.title"
                :name="item.name">
              <component :is="item.component" @onEdit="handleEdit" :data="children[item.name]"></component>
            </el-tab-pane>
          </el-tabs>
          <el-footer>
            © 2022 武汉图歌信息技术有限责任公司
          </el-footer>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import { reactive, markRaw, ref, onMounted, onUnmounted } from 'vue'

const pageModules = import.meta.glob('./**/**/**/**/**.vue')

import { useDark, useToggle } from '@vueuse/core'
import SvgLight from '../../components/SvgLight.vue'
import SvgDark from '../../components/SvgDark.vue'
import SvgFullScreen from '../../components/SvgFullScreen.vue'
import SvgExitFullScreen from '../../components/SvgExitFullScreen.vue'
import screenfull from 'screenfull'

const isFullscreen = ref(false)

const change = () => {
  isFullscreen.value = screenfull.isFullscreen
}

const onToggle = () => {
  screenfull.toggle()
}

onMounted(() => {
  screenfull.on('change', change)
})

// 删除侦听器
onUnmounted(() => {
  screenfull.off('change', change)
})

const isDark = useDark()

const toggleDark = useToggle(isDark)

const editableTabs = reactive([])
let currentTab = reactive({
  name: ''
})

pageModules[`./LoginSuccess.vue`]().then(item => {
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
  editableTabs.splice(editableTabs.findIndex(item => item.name === name), 1)
  delete children[name]
  currentTab.name = editableTabs[0].name
}

const children = reactive({})

const handleEdit = ({
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
}

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
  top: 60px;
  bottom: 0;
  overflow-y: scroll;
}

</style>
