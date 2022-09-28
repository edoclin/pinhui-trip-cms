<template>
  <el-form :model="form" label-width="120px" ref="formRef">
    <el-form-item label="角色名称" prop="customRoleName">
      <el-input v-model="form['customRoleName']"/>
    </el-form-item>
    <el-form-item label="角色描述" prop="customRoleDesc">
      <el-input v-model="form['customRoleDesc']"/>
    </el-form-item>
    <el-form-item label="角色权限" prop="preparedRoleIds">
      <el-select :multiple="true" v-model="form['preparedRoleIds']" placeholder="请选择角色权限" style="width: 100%">
        <el-option v-for="role in preparedRole" :key="role.roleId" :label="role.roleName"
                   :value="role.roleId"/>
      </el-select>
    </el-form-item>
    <el-form-item label="关联基地" prop="baseIds">
      <el-select :multiple="true" v-model="form['baseIds']" placeholder="请选择关联基地" style="width: 100%">
        <el-option v-for="base in baseSelector.data" :key="base.baseId" :label="base.baseName"
                   :value="base.baseId"/>
      </el-select>
    </el-form-item>
    <el-form-item label="当前状态">
      <el-select v-model="form['status']" placeholder="请选择状态" style="width: 100%">
        <el-option v-for="status in statusEnum" :key="status.key" :label="status.name"
                   :value="status.key"/>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit(formRef)">{{ data ? '更新' : '创建' }}</el-button>
      <el-button v-if="!data" @click="onResetForm(formRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { postRole, putRole } from '../../../api/role'
import { ElMessage } from 'element-plus'

import { useMapState } from 'src/stores'
import { useCommonStore } from 'src/stores/common_store'
import { getSelector } from '../../../api/base'

const { statusEnum, preparedRole } = useMapState(useCommonStore, ['statusEnum', 'preparedRole'])

const baseSelector = reactive({
  data: []
})

getSelector().then(res => {
  console.log(res.data)
  baseSelector.data = res.data
})

const formRef = ref()

const form = reactive({})

const onResetForm = (formEl) => {
  if (formEl) {
    formEl.resetFields()
  }
}

const onSubmit = (formEl) => {
  // update
  if (props.data) {
    putRole(form).then(res => {
      ElMessage({
        type: 'success',
        message: res.data,
      })
      onResetForm(formEl)
    })
  } else {
    postRole(form).then(res => {
      ElMessage({
        type: 'success',
        message: res.data,
      })
      onResetForm(formEl)
    })
  }
}

const props = defineProps({
  data: {}
})
if (props.data) {
}

</script>
