<template>
  <div>
    <el-config-provider :locale="zhCn">
      <router-view/>
    </el-config-provider>
  </div>
</template>

<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { mapActions } from 'pinia'
import { getCourseVersion, getPreparedRole, getStatusEnum } from 'src/api/common'
import { useCommonStore } from 'src/stores/common_store'
import { useRouter } from 'vue-router'

const router = useRouter()

router.push({
  path: '/cms'
})


</script>
