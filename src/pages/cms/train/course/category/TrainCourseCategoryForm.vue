<template>
  <el-form :rules="rules" :model="form" label-width="120px" ref="formRef">
   <el-form-item label="分类标题" prop="categoryTitle">
      <el-input v-model="form['categoryTitle']"/>
    </el-form-item>
    <el-form-item label="分类副标题" prop="categorySubTitle">
      <el-input v-model="form['categorySubTitle']"/>
    </el-form-item>
    <el-form-item label="分类展示颜色" prop="color">
      <el-color-picker v-model="form['color']" show-alpha color-format="hex"/>
    </el-form-item>
    <el-form-item label="当前状态" prop="status">
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
import { postTrainCourseCategory, putTrainCourseCategory } from 'src/api/train-course-category'
import { ElMessage } from 'element-plus'
import { useMapState } from 'src/stores'
import { useCommonStore } from 'src/stores/common_store'
const { statusEnum } = useMapState(useCommonStore, ['statusEnum'])

const formRef = ref(null)
const bus = inject('bus')

const rules = reactive({
  categoryTitle: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入分类标题'
    },
  ],
  categorySubTitle: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入分类副标题'
    }
  ],
  color: [
    {
      required: true,
      trigger: 'blur',
      message: '请选择分类展示颜色'
    },
  ],
  status: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入分类状态'
    },
  ],
})
const form = reactive({})
const onResetForm = (formEl) => {
  if (formEl) {
    formEl.resetFields()
  }
}

const onSubmit = (formEl) => {
  formEl.validate(async (valid) => {
    if (valid) {
      if (props.data) {
        await putTrainCourseCategory(form).then(res => {
          ElMessage({
            type: 'success',
            message: res.data,
          })
        })
      } else {
        await postTrainCourseCategory(form).then(res => {
          ElMessage({
            type: 'success',
            message: res.data,
          })
          onResetForm(formEl)
        })
      }
      bus.emit('update-train-course-category-table')
    }
  })
}

const props = defineProps({
  data: {}
})
if (props.data) {
  form['categoryId'] = props.data['categoryId']
  form['categorySubTitle'] = props.data['categorySubTitle']
  form['categoryTitle'] = props.data['categoryTitle']
  form['color'] = props.data['color']
  form['status'] = statusEnum.value.find(item => item.name === props.data['status']).key
}
</script>
