<template>
  <el-form :rules="rules" :model="form" label-width="120px" ref="formRef">
    <el-form-item label=""  prop="">
      <el-input v-model="" />
    </el-form-item>
    <el-form-item label="当前状态">
      <el-select v-model="form['status']" placeholder="请选择状态" style="width: 100%">
        <el-option v-for="status in statusEnum" :key="status.key" :label="status.name"
                   :value="status.key" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit(formRef)">{{data ? '更新' : '创建'}}</el-button>
      <el-button v-if="!data" @click="onResetForm(formRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { reactive, ref } from 'vue';
import { post$module_name$, put$module_name$ } from 'src/api/$module_name_1$'
import { ElMessage } from 'element-plus'

import { useMapState } from 'src/stores';
import { useCommonStore } from 'src/stores/common_store';

const { statusEnum } = useMapState(useCommonStore, ['statusEnum'])


const bus = inject('bus')

const formRef = ref()


const form = reactive({
})

const rules = reactive({
  '': [
    {
      required: true,
      trigger: 'blur',
      message: '请输入'
    },
  ],
})
const onResetForm = (formEl) => {
  if (formEl) {
    formEl.resetFields()
  }
}


const onSubmit = (formEl) => {
  formEl.validate(async (valid) => {
    if (valid) {
      if (props.data) {
        await put$module_name$(form).then(res => {
          ElMessage({
            type: 'success',
            message: res.data,
          })
        })
      } else {
        await post$module_name$(form).then(res => {
          ElMessage({
            type: 'success',
            message: res.data,
          })
          onResetForm(formEl)
        })
      }
      bus.emit('$update-data-bus$')
    }
  })
}



const props = defineProps({
  data: {}
})
if (props.data) {
}

</script>
