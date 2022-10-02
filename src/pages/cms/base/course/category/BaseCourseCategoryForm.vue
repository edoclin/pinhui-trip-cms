<template>
  <el-form :model="form" label-width="120px" ref="formRef">
    <el-form-item label="分类名称" prop="categoryName">
      <el-input v-model="form.categoryName"/>
    </el-form-item>
    <el-form-item label="展示图片" prop="coverResourcePath">
      <el-upload :on-preview="handlePreviewUpload" :auto-upload="false" list-type="picture-card" v-model:file-list="fileList" accept="image/*"
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
    <el-form-item label="简单描述" prop="descSimple">
      <el-input type="textarea" :rows="2" v-model="form.descSimple"/>
    </el-form-item>
    <el-form-item label="富文本描述" prop="descRichText">
      <div style="border: 1px solid #ccc">
        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
                 mode="default" />
        <Editor style="height: 1000px;width: 100%; overflow-y: hidden;" v-model="valueHtml.html"
                :defaultConfig="editorConfig" mode="default" @onCreated="handleCreated" />
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit(formRef)" :disabled="uploading">{{ data ? '更新' : '创建' }}</el-button>
      <el-button v-if="!data" @click="onResetForm(formRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { onBeforeUnmount, reactive, ref, shallowRef } from 'vue'
import { postBaseCourseCategory, putBaseCourseCategory } from 'src/api/base-course-category'
import { ElMessage } from 'element-plus'

import { useMapState } from 'src/stores'
import { useCommonStore } from 'src/stores/common_store'
import { getAccessUrl, sliceUploadFile } from 'src/api/cos'

const { statusEnum } = useMapState(useCommonStore, ['statusEnum'])
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { generateAccessUrl } from 'src/api/common'

const fileList = ref([])

const handlePreviewUpload = (e) => {
  console.log(e)
  window.open(e.url, "_black")
}

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
      async customUpload(file, insertFn) {
        sliceUploadFile(file, 'rich_text').then(res => {
          getAccessUrl(600, res.Key).then(res => {
            insertFn(res.data, '', res.data)
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
      async customUpload(file, insertFn) {
        sliceUploadFile(file, 'rich_text').then(res => {
          getAccessUrl(600, res.Key).then(res => {
            insertFn(res.data, '', res.data)
          })
        })
      }
    }
  }
})

const uploading = ref(false)

const handleChangeFileUpload = (uploadFile) => {
  uploading.value = true
  fileList.value = []
  sliceUploadFile(uploadFile.raw, 'course-category-cover').then(data => {
    console.log(data)
    form.coverResourcePath = data.Key
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

  })
}

const formRef = ref()

const form = reactive({})

const onResetForm = (formEl) => {
  if (formEl) {
    formEl.resetFields()
  }
}


const emit = defineEmits(['onUpdate'])

const onSubmit = (formEl) => {
  form.descRichText = valueHtml.html
  // update
  if (props.data) {
    putBaseCourseCategory(form).then(res => {
      ElMessage({
        type: 'success',
        message: res.data,
      })
      onResetForm(formEl)
    })
  } else {
    postBaseCourseCategory(form).then(res => {
      ElMessage({
        type: 'success',
        message: res.data,
      })
      onResetForm(formEl)
    })
  }
  emit('onUpdate', 'BaseCourseCategoryTable')
}

const props = defineProps({
  data: {}
})
if (props.data) {
  form['categoryId'] = props.data['categoryId']
  form['categoryName'] = props.data['categoryName']
  form['coverResourcePath'] = props.data['coverResourcePath']
  form['descSimple'] = props.data['descSimple']
  form['descRichText'] = props.data['descRichText']
  console.log(statusEnum)
  form['status'] = statusEnum.value.find(item => item.name === props.data['status']).key
  valueHtml.html = props.data['descRichText']
  fileList.value.push({
    name: '',
    url: props.data['coverResourcePathUrl']
  })
}

</script>
