<template>
  <course-version-form v-if="courseVersionForm['show']" :form="courseVersionForm['form']" @onSubmit="onSubmitCourseVersion"
                       @onCancel="courseVersionForm['show'] = false"></course-version-form>
  <el-form :rules="rules" :model="form" label-width="120px" ref="formRef">
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
        <el-option v-for="base in selectorData.baseSelector" :key="base.baseId" :label="base.baseName"
                   :value="base.baseId"/>
      </el-select>
    </el-form-item>
    <el-form-item label="所属分类" prop="categoryIds">
      <el-select :multiple="true" v-model="form['categoryIds']" placeholder="请选择所属分类" style="width: 100%">
        <el-option v-for="category in selectorData.baseCourseCategorySelector" :key="category.categoryId"
                   :label="category.categoryName"
                   :value="category.categoryId"/>
      </el-select>
    </el-form-item>
    <el-form-item prop="defaultCoverResourcePath" label="课程封面图">
      <el-upload :on-preview="handlePreviewUpload" list-type="picture-card" v-model:file-list="fileList"
                 :auto-upload="false" accept="image/*"
                 :on-change="handleChangeFileUpload">
        <el-button type="primary" :loading="uploading">
          {{ uploading ? '上传中...' : (fileList.length === 1 ? '重新上传' : '点击上传') }}
        </el-button>
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
    <el-form-item label="课程版本">
      <el-transfer
          v-model="form['versionNames']"
          :titles="['未添加', '已添加']"
          :button-texts="['移除', '添加']"
          @change="handleTransfer"
          :props="{disabled: false, key: 'key', label: 'name'}"
          :data="courseVersion"
          @right-check-change="addCourseVersion"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit(formRef)" :disabled="uploading">{{
          data ? '更新' : '创建'
        }}
      </el-button>
      <el-button v-if="!data" @click="onResetForm(formRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { getBaseCourseById, postBaseCourse, putBaseCourse } from 'src/api/base-course'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useMapState } from 'src/stores'
import { useCommonStore } from 'src/stores/common_store'
import { sliceUploadFile } from 'src/api/cos'
import { getBaseSelector } from 'src/api/base'
import CourseVersionForm from 'src/components/CourseVersionForm.vue'
import { generateAccessUrl } from 'src/api/common'
import { getBaseCourseCategorySelector } from 'src/api/base-course-category'

const {
  statusEnum,
  courseVersion
} = useMapState(useCommonStore, ['statusEnum', 'courseVersion'])

const bus = inject('bus')

const validateCategoryIds = (rule, value, cb) => {
  if (!form['categoryIds'] || form['categoryIds'].length === 0) {
    cb(new Error('请选择课程所属分类'))
    return false
  }
  cb()
}

const rules = reactive({
  courseName: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入培训课程名称'
    },
  ],
  baseId: [
    {
      required: true,
      trigger: 'blur',
      message: '请选择课程所属基地'
    },
  ],
  defaultCoverResourcePath: [
    {
      required: true,
      trigger: 'blur',
      message: '请上传课程展示封面'
    },
  ],
  categoryIds: [
    {
      validator: validateCategoryIds,
      trigger: 'blur'
    },
  ],
  status: [
    {
      required: true,
      trigger: 'blur',
      message: '请选择当前状态'
    },
  ],
})

const handleTransfer = (current, direction, value) => {
  if (direction === 'right') {
    ElMessageBox.alert('请点击已添加列表项上传课程', '提示', {
      confirmButtonText: '确认',
    })
  } else if (direction === 'left') {
    value.forEach(item => {
      form.versions.splice(form.versions.findIndex(version => version.version === item), 1)
    })
  }
}

const onSubmitCourseVersion = version => {
  courseVersionForm.show = false
  if (form.versions.find(item => item.version === version.result.version) !== undefined) {
    form.versions.splice(form.versions.findIndex(item => item.version === version.result.version), 1, { ...version.result })
    return
  }
  form.versions.push({ ...version.result })
}

const courseVersionForm = reactive({
  form: {
    data: {},
  },
  show: false,
})

const addCourseVersion = (selected, current) => {
  if (current.length > 1) {
    return
  }
  courseVersionForm.form['courseVersion'] = current[0]
  courseVersionForm.form['data'] = form['versions'].find(item => item['courseVersion'] === current[0])
  courseVersionForm.show = true
}

const selectorData = reactive({
  baseSelector: [],
  baseCourseCategorySelector: [],
})

getBaseSelector().then(res => {
  selectorData.baseSelector = res.data
})

getBaseCourseCategorySelector().then(res => {
  selectorData.baseCourseCategorySelector = res.data
})

const formRef = ref(null)

const form = reactive({
  versions: [],
  versionNames: []
})

const onResetForm = (formEl) => {
  if (formEl) {
    formEl.resetFields()
  }
}

const uploading = ref(false)
const fileList = ref([])
const handlePreviewUpload = (e) => {
  window.open(e.url, '_black')
}

const handleChangeFileUpload = (uploadFile) => {
  uploading.value = true
  fileList.value = []
  sliceUploadFile(uploadFile.raw, 'course-cover').then(data => {
    form.defaultCoverResourcePath = data.Key
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
    uploading.value = false
    ElMessage({
      type: 'error',
      message: '服务器繁忙,请重试!'
    })
  })
}

const onSubmit = (formEl) => {
  formEl.validate(async (valid) => {
    if (valid) {
      // update
      if (props.data) {
        await putBaseCourse(form).then(res => {
          ElMessage({
            type: 'success',
            message: res.data,
          })
        })
      } else {
        await postBaseCourse(form).then(res => {
          ElMessage({
            type: 'success',
            message: res.data,
          })
          onResetForm(formEl)
        })
      }
      bus.emit('update-base-course-table')
    }
  })
}

const props = defineProps({
  data: {}
})
if (props.data) {
  form['courseId'] = props.data['courseId']
  form['baseId'] = props.data['baseId']
  form['baseName'] = props.data['baseName']
  form['courseName'] = props.data['courseName']
  form['defaultCoverResourcePath'] = props.data['defaultCoverResourcePath']
  form['status'] = statusEnum.value.find(item => item.name === props.data['status']).key
  fileList.value = [{
    name: '',
    url: props.data['defaultCoverResourcePathUrl']
  }]
  getBaseCourseById(form['courseId']).then(res => {
    if (res.data['versions']) {
      form['versions'] = res.data.versions
      form['versions'].forEach(item => form['versionNames'].push(item.courseVersion))
    }
    form['categoryIds'] = res.data.categoryIds
  })
}
</script>
