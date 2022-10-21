<template>
  <el-form :rules="rules" :model="form" label-width="160px" ref="formRef">
    <el-form-item label="培训课程名称" prop="courseName">
      <el-input v-model="form['courseName']"/>
    </el-form-item>
    <el-form-item prop="coverResourcePath" label="展示图片">
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
    <el-form-item prop="videoResourcePath" label="课程视频">
      <el-upload :on-preview="handlePreviewUpload" list-type="picture-card" v-model:file-list="videoFileList"
                 :auto-upload="false" accept="video/*"
                 :on-change="handleChangeVideoFileUpload">
        <el-button type="primary" :loading="videoUploading">
          {{ videoUploading ? '上传中...' : (videoFileList.length === 1 ? '重新上传' : '点击上传') }}
        </el-button>
        <template #file="{ file }">
          <div>
            <video class="el-upload-list__item-thumbnail" :src="file.url"/>
            <span class="el-upload-list__item-actions">
              <span
                  class="el-upload-list__item-preview"
                  @click="handlePreviewUpload(file)">
                <el-icon><zoom-in/></el-icon>
              </span>
            </span>
          </div>
        </template>

        <template #tip>
          <div class="el-upload__tip">
            <el-progress
                style="width: 202px"
                v-if="videoUploading"
                :percentage="100"
                :indeterminate="true"
                :duration="1"
                :format="() => ''"
            />
            <span v-else>请选择视频文件上传</span>
          </div>
        </template>
      </el-upload>
    </el-form-item>
    <el-form-item prop="categoryId" label="所属分类">
      <el-select v-model="form['categoryId']" placeholder="请选择所属分类" style="width: 100%">
        <el-option v-for="category in trainCourseCategorySelector" :key="category.categoryId"
                   :label="category.categoryTitle"
                   :value="category.categoryId"/>
      </el-select>
    </el-form-item>
    <el-form-item prop="status" label="当前状态">
      <el-select v-model="form['status']" placeholder="请选择状态" style="width: 100%">
        <el-option v-for="status in statusEnum" :key="status.key" :label="status.name"
                   :value="status.key"/>
      </el-select>
    </el-form-item>
    <el-form-item label="简单描述" prop="descSimple">
      <el-input type="textarea" :rows="2" v-model="form['descSimple']"/>
    </el-form-item>
    <el-form-item label="富文本描述" prop="descRichText">
      <div style="border: 1px solid #ccc">
        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
                 mode="default"/>
        <Editor style="height: 80vh;width: 100%; overflow-y: hidden;" v-model="valueHtml.html"
                :defaultConfig="editorConfig" mode="default" @onCreated="handleCreated"/>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit(formRef)">{{ data ? '更新' : '创建' }}</el-button>
      <el-button v-if="!data" @click="onResetForm(formRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { onBeforeUnmount, reactive, ref, shallowRef } from 'vue'
import { postTrainCourse, putTrainCourse } from 'src/api/train-course'
import { ElMessage } from 'element-plus'
import { useMapState } from 'src/stores'
import { useCommonStore } from 'src/stores/common_store'
import { openURL } from 'quasar'
import { getAccessUrl, sliceUploadFile } from 'src/api/cos'
import { generateAccessUrl } from 'src/api/common'
import { getTrainCourseCategorySelector } from 'src/api/train-course-category'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

const { statusEnum } = useMapState(useCommonStore, ['statusEnum'])
const bus = inject('bus')
const formRef = ref(null)
const form = reactive({})
const uploading = ref(false)
const videoUploading = ref(false)
const fileList = ref([])
const videoFileList = ref([])

const valueHtml = reactive({
  html: ''
})
const editorRef = shallowRef()
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
const handleCreated = (editor) => {
  editorRef.value = editor
}
const toolbarConfig = reactive({
  excludeKeys: [
    'fullScreen'
  ]
})
const editorConfig = reactive({
  placeholder: '请输入内容',
  MENU_CONF: {
    'uploadImage': {
      maxFileSize: 1024 * 1024 * 10,
      maxNumberOfFiles: 100,
      allowedFileTypes: ['image/*'],
      metaWithUrl: false,
      withCredentials: true,
      timeout: 10 * 1000,
      async customUpload (file, insertFn) {
        sliceUploadFile(file, 'rich_text').then(res => {
          getAccessUrl(600, res['Key']).then(res => {
            insertFn(res.data, '', res.data)
          })
        }).catch(err => {
          uploading.value = false
          ElMessage({
            type: 'error',
            message: '服务器繁忙,请重试!'
          })
        })
      }
    },
    'uploadVideo': {
      maxFileSize: 1024 * 1024 * 100 * 10, // 100M
      maxNumberOfFiles: 10,
      allowedFileTypes: ['video/*', 'audio/*'],
      metaWithUrl: false,
      withCredentials: true,
      timeout: 20 * 1000,
      async customUpload (file, insertFn) {
        sliceUploadFile(file, 'rich_text').then(res => {
          getAccessUrl(600, res['Key']).then(res => {
            insertFn(res.data, '', res.data)
          })
        }).catch(err => {
          ElMessage({
            type: 'error',
            message: '服务器繁忙,请重试!'
          })
        })
      }
    }
  }
})

const handlePreviewUpload = (e) => {
  openURL(e.url)
}

const handleChangeFileUpload = (uploadFile) => {
  uploading.value = true
  fileList.value = []
  sliceUploadFile(uploadFile.raw, 'train-course-cover').then(data => {
    form.coverResourcePath = data.Key
    ElMessage({
      type: 'success',
      message: '上传成功'
    })
    uploading.value = false
    generateAccessUrl(data['Key']).then(res => {
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

const handleChangeVideoFileUpload = (uploadFile) => {
  videoUploading.value = true
  videoFileList.value = []
  sliceUploadFile(uploadFile.raw, 'train-course-video').then(data => {
    form.videoResourcePath = data.Key
    ElMessage({
      type: 'success',
      message: '上传成功'
    })
    videoUploading.value = false
    generateAccessUrl(data['Key']).then(res => {
      videoFileList.value.push({
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

const trainCourseCategorySelector = ref([])
getTrainCourseCategorySelector().then(res => {
  trainCourseCategorySelector.value = res.data
})

const validateDescRichText = (rule, value, cb) => {
  if (form['descRichText'] === '') {
    cb(new Error('请输入富文本描述'))
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
  coverResourcePath: [
    {
      required: true,
      trigger: 'blur',
      message: '请上传封面展示图片'
    },
  ],
  videoResourcePath: [
    {
      required: true,
      trigger: 'blur',
      message: '请上传培训课程视频'
    },
  ],
  categoryId: [
    {
      required: true,
      trigger: 'blur',
      message: '请选择培训课程所属分类'
    },
  ],
  status: [
    {
      required: true,
      trigger: 'blur',
      message: '请选择当前状态'
    },
  ],
  descSimple: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入简单描述'
    },
  ],
  descRichText: [
    {
      validator: validateDescRichText,
      trigger: 'blur'
    }
  ]
})

const onResetForm = (formEl) => {
  if (formEl) {
    formEl.resetFields()
  }
}

const onSubmit = (formEl) => {
  form['descRichText'] = valueHtml.html
  formEl.validate(async (valid) => {
    if (valid) {
      if (props.data) {
        await putTrainCourse(form).then(res => {
          ElMessage({
            type: 'success',
            message: res.data,
          })
        })
      } else {
        await postTrainCourse(form).then(res => {
          ElMessage({
            type: 'success',
            message: res.data,
          })
          valueHtml.html = ''
          onResetForm(formEl)
        })
      }
      bus.emit('update-train-course-table')
    }
  })
}

const props = defineProps({
  data: {}
})
if (props.data) {
  form['categoryId'] = props.data['categoryId']
  form['categoryTitle'] = props.data['categoryTitle']
  form['courseId'] = props.data['courseId']
  form['courseName'] = props.data['courseName']
  form['coverResourcePath'] = props.data['coverResourcePath']
  form['videoResourcePath'] = props.data['videoResourcePath']
  form['descRichText'] = props.data['descRichText']
  valueHtml.html = props.data['descRichText']
  form['descSimple'] = props.data['descSimple']
  form['status'] = statusEnum.value.find(item => item.name === props.data['status']).key
  fileList.value = [{
    name: '',
    url: props.data['coverResourcePathUrl']
  }]
  videoFileList.value = [
    {
      name: '',
      url: props.data['videoResourcePathUrl']
    }
  ]
}
</script>
