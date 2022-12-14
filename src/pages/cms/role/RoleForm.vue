<template>
  <el-form :rules="rules" :model="form" label-width="120px" ref="formRef">
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
    <el-form-item label="关联基地" prop="baseIds" v-show="!form['preparedRoleIds'].find(item => item === 'ROLE1')">
      <el-select :multiple="true" v-model="form['baseIds']" placeholder="请选择关联基地" style="width: 100%">
        <el-option v-for="base in baseSelector" :key="base.baseId" :label="base.baseName"
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
import { postRole, putRole } from 'src/api/role'
import { ElMessage } from 'element-plus'
import { useMapState } from 'src/stores'
import { useCommonStore } from 'src/stores/common_store'
import { getBaseSelector } from 'src/api/base'

const {
  statusEnum,
  preparedRole
} = useMapState(useCommonStore, ['statusEnum', 'preparedRole'])

const baseSelector = ref([])
getBaseSelector().then(res => {
  baseSelector.value = res.data
})

const formRef = ref(null)
const form = reactive({
  preparedRoleIds: []
})

const validatePreparedRoleIds = (rule, value, cb) => {
  if (form['preparedRoleIds'].length === 0) {
    cb(new Error('请选择角色权限'))
    return false
  }
  cb()
}
const rules = reactive({
  customRoleName: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入角色名称'
    },
  ],
  customRoleDesc: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入角色描述'
    },
  ],
  preparedRoleIds: [
    {
      validator: validatePreparedRoleIds,
      trigger: 'blur'
    }
  ],
  status: [
    {
      required: true,
      trigger: 'blur',
      message: '请选择当前状态'
    },
  ],
})

const onResetForm = (formEl) => {
  if (formEl) {
    formEl.resetFields()
  }
}

const bus = inject('bus')
const onSubmit = (formEl) => {
  formEl.validate(async (valid) => {
    if (valid) {
      if (props.data) {
        await putRole(form).then(res => {
          ElMessage({
            type: 'success',
            message: res.data,
          })
        })
      } else {
        await postRole(form).then(res => {
          ElMessage({
            type: 'success',
            message: res.data,
          })
          onResetForm(formEl)
        })
      }
      bus.emit('update-role-table')
    }
  })
}

const props = defineProps({
  data: {}
})
if (props.data) {
  form['customRoleId'] = props.data['customRoleId']
  form['customRoleName'] = props.data['customRoleName']
  form['customRoleDesc'] = props.data['customRoleDesc']
  form['preparedRoleIds'] = props.data['preparedRoleIds']
  form['baseIds'] = props.data['baseIds']
  form['status'] = statusEnum.value.find(item => item.name === props.data['status']).key
}
</script>
