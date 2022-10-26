<template>
  <div>
    <el-config-provider :locale="zhCn">
      <router-view/>
    </el-config-provider>
  </div>
</template>

<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { useRouter } from 'vue-router'
import { webCheck } from 'src/api/user'
import { ElMessage } from 'element-plus'

const isElectron = ref(process.env.MODE === 'electron')

const timer = ref(null)

// electron 平台自动续签
onMounted(() => {
  if (isElectron) {
    const print = (e, args) => {
      console.log(args)
    }
    window.$electron.UpdateDownloading((e, args) => {
      console.log('UpdateDownloading')
      console.log(args)
    })
    window.$electron.UpdateDownloaded((e, args) => {
      console.log('UpdateDownloaded')
      console.log(args)
      ElMessage({
        type: 'success',
        message: args.message
      })
    })

    timer.value = setInterval(() => {
      webCheck().then(res => {
        router.push({
          path: '/cms'
        })
      }).catch(err => {
        console.log(err)
        router.push({
          path: '/cms/login'
        })
      })
    }, 1000 * 60 * 30)
  }
})

onUnmounted(() => {
  clearInterval(timer.value)
})

const router = useRouter()

webCheck().then(res => {
  router.push({
    path: '/cms'
  })
}).catch(err => {
  console.log(err)
  router.push({
    path: '/cms/login'
  })
})


</script>
