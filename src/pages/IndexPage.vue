<template>
    <div>
        <el-config-provider :locale="zhCn">
            <router-view />
        </el-config-provider>
    </div>
</template>

<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { mapActions } from 'pinia';
import { getPreparedRole, getStatusEnum } from 'src/api/common'
import { useCommonStore } from 'src/stores/common_store';
import { useRouter } from 'vue-router';
const router = useRouter()

router.push({
    path: '/cms/Index'
})



const statusEnumActions = mapActions(useCommonStore, ["updateStatusEnum"])
const preparedRoleActions = mapActions(useCommonStore, ["updatePreparedRole"])

getStatusEnum().then(res => {
    statusEnumActions.updateStatusEnum(res.data)
})

getPreparedRole().then(res => {
  preparedRoleActions.updatePreparedRole(res.data)
})

</script>
