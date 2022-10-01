<template>
  <course-version-form v-if="courseVersionForm.show" :form="courseVersionForm.form" @onSubmit="onSubmitCourseVersion"
                 @onCancel="courseVersionForm.show = false"></course-version-form>
  <el-form :model="form" label-width="120px" ref="formRef">
    <el-form-item label="课程名称" prop="courseName">
      <el-input v-model="form['courseName']"/>
    </el-form-item>
    <el-form-item label="当前状态">
      <el-select v-model="form['status']" placeholder="请选择状态" style="width: 100%">
        <el-option v-for="status in statusEnum" :key="status.key" :label="status.name"
                   :value="status.key"/>
      </el-select>
    </el-form-item>
    <el-form-item label="所属基地" prop="baseId">
      <el-select v-model="form['baseId']" placeholder="请选择所属基地" style="width: 100%">
        <el-option v-for="base in baseSelector.data" :key="base.baseId" :label="base.baseName"
                   :value="base.baseId"/>
      </el-select>
    </el-form-item>
    <el-form-item prop="defaultCoverResourcePath" label="课程封面图">
      <el-upload :auto-upload="false" :show-file-list="false" accept="image/*"
                 :on-change="handleChangeFileUpload">
        <el-button type="primary">点击上传</el-button>
        <template #tip>
          <div class="el-upload__tip">
            请选择图片上传
          </div>
        </template>
      </el-upload>
    </el-form-item>
    <el-form-item label="课程版本">
      <el-transfer
          v-model="form['versions']"
          :titles="['未添加', '已添加']"
          :button-texts="['移除', '添加']"
          @change="showTransferTip"
          :props="{disabled: false, key: 'key', label: 'name'}"
          :data="courseVersion"
          @right-check-change="addCourseVersion"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit(formRef)">{{ data ? '更新' : '创建' }}</el-button>
      <el-button v-if="!data" @click="onResetForm(formRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { postBaseCourse, putBaseCourse } from 'src/api/base-course'
import { ElMessage, ElMessageBox } from 'element-plus'

import { useMapState } from 'src/stores'
import { useCommonStore } from 'src/stores/common_store'
import { sliceUploadFile } from 'src/api/cos'
import { getSelector } from 'src/api/base'
import CourseVersionForm from 'src/components/CourseVersionForm.vue'

const { statusEnum, courseVersion } = useMapState(useCommonStore, ['statusEnum', 'courseVersion'])


const showTransferTip = (current, direction, value) => {
  if (direction === 'right') {
    ElMessageBox.alert('请点击已添加列表项上传课程', '提示', {
      confirmButtonText: '确认',
    })
  }
}

const onSubmitCourseVersion = version => {
  console.log("onSubmitCourseVersion")
  console.log(version)
  courseVersionForm.show = false
  if (courseVersionForm.form.versions.find(item => item.version === version.version) !== undefined) {
    console.log("AAAAAAAAAA")
    return
  }
  courseVersionForm.form.versions.push({ ...version })
}

const courseVersionForm = reactive({
  form: {
    versions: []
  },
  show: false,
})

const addCourseVersion = (selected, current) => {
  if (current.length > 1) {
    return
  }
  courseVersionForm.form['courseVersion'] = current[0]
  courseVersionForm.show = true
}

const baseSelector = reactive({
  data: []
})


getSelector().then(res => {
  baseSelector.data = res.data
})

const formRef = ref()

const form = reactive({})

const onResetForm = (formEl) => {
  if (formEl) {
    formEl.resetFields()
  }
}

const handleChangeFileUpload = (uploadFile) => {
  sliceUploadFile(uploadFile.raw, 'course-cover').then(data => {
    form.defaultCoverResourcePath = data.Key
    ElMessage({
      type: 'success',
      message: '上传成功'
    })
  })
}

const onSubmit = (formEl) => {
  // update
  if (props.data) {
    putBaseCourse(form).then(res => {
      ElMessage({
        type: 'success',
        message: res.data,
      })
      onResetForm(formEl)
    })
  } else {
    postBaseCourse(form).then(res => {
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
