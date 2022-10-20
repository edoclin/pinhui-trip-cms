<template>
  <el-form :model="form" label-width="120px" ref="formRef">
    <el-form-item label="身份证号">
      <el-input v-model="form['idCard']" disabled/>
    </el-form-item>
    <el-form-item label="真实姓名">
      <el-input v-model="form['realName']" disabled/>
    </el-form-item>
    <el-form-item label="手机号">
      <el-input v-model="form['mobile']" disabled/>
    </el-form-item>
    <el-form-item label="注册说明">
      <el-input v-model="form['desc']" disabled/>
    </el-form-item>
    <el-form-item label="当前状态">
      <el-select v-model="form['status']" placeholder="请选择状态" style="width: 100%">
        <el-option v-for="status in statusEnum" :key="status.key" :label="status.name"
                   :value="status.key"/>
      </el-select>
    </el-form-item>
    <el-form-item label="拥有角色">
      <el-select :multiple="true" v-model="form['customRoleIds']" placeholder="请选择角色权限" style="width: 100%">
        <el-option v-for="customRole in customRoleSelector" :key="customRole.customRoleId" :label="customRole.customRoleName"
                   :value="customRole.customRoleId"/>
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
import { postUser, putUser } from 'src/api/user'
import { ElMessage } from 'element-plus'

import { useMapState } from 'src/stores'
import { useCommonStore } from 'src/stores/common_store'
import { getCustomRoleSelector } from '../../../api/role'

const { statusEnum } = useMapState(useCommonStore, ['statusEnum'])

const formRef = ref()

const form = reactive({})

const onResetForm = (formEl) => {
  if (formEl) {
    formEl.resetFields()
  }
}

const onSubmit = (formEl) => {
  if (props.data) {
    putUser(form).then(res => {
      ElMessage({
        type: 'success',
        message: res.data,
      })
    })
  }
}

const customRoleSelector = ref([])
getCustomRoleSelector().then(res => {
  customRoleSelector.value = res.data
})

const props = defineProps({
  data: {}
})
if (props.data) {
  form['mobile'] = props.data['mobile']
  form['realName'] = props.data['realName']
  form['idCard'] = props.data['idCard']
  form['desc'] = props.data['desc']
  form['customRoleIds'] = props.data['customRoleIds']
  form['status'] = statusEnum.value.find(item => item.name === props.data['status']).key
}

</script>
