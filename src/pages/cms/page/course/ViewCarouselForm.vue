<template>
  <el-form :model="form" label-width="120px" ref="formRef">
    <el-form-item label="轮播图类型" prop="carouselType">
      <el-select @change="handleChangeSelector" v-model="form['carouselType']" placeholder="请选择轮播图类型" style="width: 100%">
        <el-option v-for="type in carouselType" :key="type.key" :label="type.name"
                   :value="type.key"/>
      </el-select>
    </el-form-item>
    <el-form-item label="关联课程" prop="relatedId" v-if="form['carouselType']">
      <el-select v-model="form['relatedId']" placeholder="请选择关联课程" style="width: 100%">
        <el-option v-for="course in courseSelector" :key="course.courseId" :label="course.courseName"
                   :value="course.courseId"/>
      </el-select>
    </el-form-item>
    <el-form-item label="轮播图名称" prop="name">
      <el-input v-model="form['name']"/>
    </el-form-item>
    <el-form-item label="轮播图占位符" prop="placeholder">
      <el-input v-model="form['placeholder']"/>
    </el-form-item>
    <el-form-item label="轮播图片" prop="imageResourcePath">
      <el-upload :on-preview="handlePreviewUpload" list-type="picture-card" v-model:file-list="fileList" :auto-upload="false" accept="image/*"
                 :on-change="handleChangeFileUpload">
        <el-button type="primary" :loading="uploading">{{ uploading ? '上传中...' : (fileList.length === 1 ? '重新上传' : '点击上传') }}</el-button>
        <template #tip>
          <div class="el-upload__tip">
            <el-progress
                style="width: 202px"
                v-if="uploading"
                :percentage="100"
                :indeterminate="true"
                :duration="1"
                :format="() => ''"
            />
            <span v-else>请选择图片文件上传</span>
          </div>
        </template>
      </el-upload>
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
import { postViewCarousel, putViewCarousel } from 'src/api/view-carousel'
import { ElMessage } from 'element-plus'

import { useMapState } from 'src/stores'
import { useCommonStore } from 'src/stores/common_store'
import { sliceUploadFile } from 'src/api/cos'
import { generateAccessUrl, getCarouselType } from 'src/api/common'
import { getBaseCourseSelector } from 'src/api/base-course'

const { statusEnum } = useMapState(useCommonStore, ['statusEnum'])

const formRef = ref()
const carouselType = ref([])

const courseSelector = ref([])

const handleChangeSelector = (e) => {
  switch (e) {
    case "BASE_COURSE":
      getBaseCourseSelector().then(res => {
        courseSelector.value = res.data
      })
      break;
    case "TRAIN_COURSE": break;
  }
}

getCarouselType().then(res => {
  carouselType.value = res.data
})
const form = reactive({})

const onResetForm = (formEl) => {
  if (formEl) {
    formEl.resetFields()
  }
}
// const emit = defineEmits(['onUpdate'])

const bus = inject('bus')

const onSubmit = async (formEl) => {
  // update
  if (props.data) {
    await putViewCarousel(form).then(res => {
      ElMessage({
        type: 'success',
        message: res.data,
      })
    })
  } else {
    await postViewCarousel(form).then(res => {
      ElMessage({
        type: 'success',
        message: res.data,
      })
      onResetForm(formEl)
    })
  }

  bus.emit('update-course-carousel-table')
}

const props = defineProps({
  data: {}
})
if (props.data) {
}

const uploading = ref(false)
const fileList = ref([])
const handlePreviewUpload = (e) => {
  window.open(e.url, "_black")
}

const handleChangeFileUpload = (uploadFile) => {
  uploading.value = true
  fileList.value = []
  sliceUploadFile(uploadFile.raw, 'course-cover').then(data => {
    form.imageResourcePath = data.Key
    ElMessage({
      type: 'success',
      message: '上传成功'
    })
    uploading.value = false
    generateAccessUrl(data.Key).then(res => {
      fileList.value.push({
        name: '',
        url: res.data
      })
    })
  }).catch(err => {
    ElMessage({
      type: 'error',
      message: err
    })
  })
}


</script>
