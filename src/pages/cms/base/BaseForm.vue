<template>
  <el-form :model="form" label-width="120px" ref="formRef">
    <el-form-item label="基地名称" prop="baseName">
      <el-input v-model="form.baseName"/>
    </el-form-item>
    <el-form-item label="当前状态">
      <el-select v-model="form['status']" placeholder="请选择状态" style="width: 100%">
        <el-option v-for="status in statusEnum" :key="status.key" :label="status.name"
                   :value="status.key"/>
      </el-select>
    </el-form-item>
    <el-form-item label="基地位置" prop="polygonGeometry">
      <div style="height: calc(100vh - 80px);width: 100%;">
        <el-amap :center="amapParam.center" :zoom="amapParam.zoom">
          <el-amap-search-box :visible="true" @select="selectPoi" @choose="choosePoi"/>
          <el-amap-control-map-type :visible="true" ></el-amap-control-map-type>
          <el-amap-control-geolocation :visible="true" @complete="getLocation"/>
          <el-amap-mouse-tool v-if="form.polygonGeometry.length === 0" type="polygon" :auto-clear="true"
                              @draw="drawMouseTool"/>
          <el-amap-polygon :path="form.polygonGeometry" :visible="true" :editable="amapPolygon.editable"
                           :draggable="amapPolygon.editable" @end="end"/>
        </el-amap>
        <el-form-item v-if="form.polygonGeometry.length !== 0" label="操作" style="margin-top: 10px">
          <el-button
                     :type="amapPolygon.editable ? 'danger' : 'primary'"
                     @click="amapPolygon.editable = !amapPolygon.editable">{{ amapPolygon.editable ? '保存' : '编辑' }}
          </el-button>
        </el-form-item>

      </div>
    </el-form-item>
    <el-form-item prop="baseLocationText" label="详细位置" style="margin-top: 50px">
      <el-input v-model="form.baseLocationText"/>
    </el-form-item>
    <el-form-item prop="coverResourcePath" label="展示图片">
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
    <el-form-item label="简单描述" prop="descSimple">
      <el-input v-model="form.descSimple" :rows="2" type="textarea" placeholder="请输入描述内容"/>
    </el-form-item>
    <el-form-item label="富文本描述" prop="descRichText">
      <div style="border: 1px solid #ccc">
        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
                 mode="default"/>
        <Editor style="height:  calc(100vh - 120px);width: 100%; overflow-y: hidden;" v-model="valueHtml.html"
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
import { regeo } from 'src/api/amap'
import { sliceUploadFile, getAccessUrl } from 'src/api/cos'
import { postBase, putBase } from 'src/api/base'
import { ElMessage } from 'element-plus'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { useMapState } from 'src/stores'
import { useCommonStore } from 'src/stores/common_store'
import { generateAccessUrl } from 'src/api/common'
import { openURL } from 'quasar'

const { statusEnum } = useMapState(useCommonStore, ['statusEnum'])
const bus = inject('bus')
const valueHtml = reactive({
  html: ''
})
const editorRef = shallowRef()
const formRef = ref()

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
          getAccessUrl(600, res.Key).then(res => {
            insertFn(res.data, '', res.data)
          })
        }).catch(err => {
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
          getAccessUrl(600, res.Key).then(res => {
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
const form = reactive({
  baseName: '',
  baseLocationText: '',
  polygonGeometry: [],
  coverResourcePath: '',
  descSimple: '',
  descRichText: ''
})

const amapParam = reactive({
  center: [110, 30],
  zoom: 12
})

const onResetForm = (formEl) => {
  if (formEl) {
    formEl.resetFields()
  }
}

const onSubmit = async (formEl) => {
  form.descRichText = valueHtml.html
  // update
  if (props.data) {
    await putBase(form).then(res => {
      ElMessage({
        type: 'success',
        message: res.data,
      })
    })
  } else {
    await postBase(form).then(res => {
      ElMessage({
        type: 'success',
        message: res.data,
      })
      onResetForm(formEl)
    })
  }
  bus.emit('update-base-table')
}

const selectPoi = (e) => {
  amapParam.center = [e.poi.location.lng, e.poi.location.lat]
  regeo(e.poi.location.lng, e.poi.location.lat).then(data => {
    form.baseLocationText = data
  })
}
const choosePoi = (e) => {
}

const getLocation = (e) => {
  amapParam.center = [e.poi.location.lng, e.poi.location.lat]
}
const drawMouseTool = (e) => {
  form.polygonGeometry = e
}

const amapPolygon = reactive({
  editable: true
})
const end = ({
  type,
  target
}) => {
  form.polygonGeometry = target._opts.path
}

const uploading = ref(false)
const fileList = ref([])

const handlePreviewUpload = (e) => {
  openURL(e.url)
}

const handleChangeFileUpload = (uploadFile) => {
  uploading.value = true
  fileList.value = []
  sliceUploadFile(uploadFile.raw, 'base-cover').then(data => {
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
  }).catch(err => {
    uploading.value = false
    ElMessage({
      type: 'error',
      message: '服务器繁忙,请重试!'
    })
  })
}

const props = defineProps({
  data: {}
})
if (props.data) {
  form["baseId"] = props.data["baseId"]
  form["baseName"] = props.data["baseName"]
  form["baseLocationText"] = props.data["baseLocationText"]
  form["coverResourcePath"] = props.data["coverResourcePath"]
  form["descSimple"] = props.data["descSimple"]
  form["descRichText"] = props.data["descRichText"]
  valueHtml.html = props.data["descRichText"]
  form["status"] = statusEnum.value.find(item => item.name === props.data["status"]).key
  props.data["polygon"].forEach(item => {
    form["polygonGeometry"].push([item.lng, item.lat])
  })
  amapParam.center = [props.data["centroid"].lng, props.data["centroid"].lat]
  fileList.value = [{
    name: '',
    url: props.data["coverResourcePathUrl"]
  }]
}
</script>
