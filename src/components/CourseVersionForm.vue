<template style="height: 100%">
  <el-dialog :z-index="100" append-to-body show-close fullscreen v-model="show" title="课程内容" destroy-on-close center
             align-center
             @close="onCancel"
             :close-on-click-modal="false">
    <div class="step-header">
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="课程信息"/>
        <el-step v-for="(item, index) in courseVersionForm.partNames" :key="index" :title="item"/>
      </el-steps>
      <el-divider/>
    </div>
    <div class="form-main">
      <el-scrollbar ref="scrollbarRef">
        <el-form v-if="active === 0" :model="form" label-width="120px">
          <el-form-item label="简单描述" prop="descSimple">
            <el-input v-model="courseVersionForm.info['descSimple']" :rows="2" type="textarea"
                      placeholder="请输入描述内容"/>
          </el-form-item>
          <el-form-item label="富文本描述" prop="descRichText">
            <div style="border: 1px solid #ccc">
              <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
                       mode="default"/>
              <Editor style="height: 69vh;width: 100%; overflow-y: hidden;" v-model="valueHtml.html"
                      :defaultConfig="editorConfig" mode="default" @onCreated="handleCreated"/>
            </div>
          </el-form-item>
          <el-form-item label="操作">
            <el-button type="primary" @click="nextStep">下一步</el-button>
          </el-form-item>
        </el-form>
        <el-form v-if="active === 1" :model="form" label-width="120px">
          <el-form-item prop="videoResourcePath" label="课程视频">
            <el-upload list-type="picture-card" :auto-upload="false" v-model:file-list="videoFile['part1']" accept="video/*"
                       :on-change="handleChangeFileUpload">
              <el-button type="primary" :loading="uploading">{{ uploading ? '上传中...' : '点击上传' }}</el-button>
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
                      v-if="uploading"
                      :percentage="100"
                      :indeterminate="true"
                      :duration="1"
                      :format="() => ''"/>
                  <span v-else>请选择视频文件上传</span>
                </div>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item label="简单描述" prop="descSimple">
            <el-input v-model="courseVersionForm.part1['descSimple']" :rows="2" type="textarea"
                      placeholder="请输入描述内容"/>
          </el-form-item>
          <el-form-item label="富文本描述" prop="descRichText">
            <div style="border: 1px solid #ccc">
              <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
                       mode="default"/>
              <Editor style="height: 69vh;width: 100%; overflow-y: hidden;" v-model="valueHtml.html"
                      :defaultConfig="editorConfig" mode="default" @onCreated="handleCreated"/>
            </div>
          </el-form-item>
          <el-form-item label="操作">
            <el-button type="success" @click="preStep" :disabled="uploading">上一步</el-button>
            <el-button type="primary" @click="nextStep" :disabled="uploading">下一步</el-button>
          </el-form-item>
        </el-form>
        <el-form v-if="active === 2" :model="form" label-width="120px">
          <el-form-item prop="videoResourcePath" label="课程视频">
            <el-upload list-type="picture-card" :auto-upload="false" v-model:file-list="videoFile['part2']" accept="video/*"
                       :on-change="handleChangeFileUpload">
              <el-button type="primary" :loading="uploading">{{ uploading ? '上传中...' : '点击上传' }}</el-button>
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
                      v-if="uploading"
                      :percentage="100"
                      :indeterminate="true"
                      :duration="1"
                      :format="() => ''"/>
                  <span v-else>请选择视频文件上传</span>
                </div>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item label="简单描述" prop="descSimple">
            <el-input v-model="courseVersionForm.part2['descSimple']" :rows="2" type="textarea"
                      placeholder="请输入描述内容"/>
          </el-form-item>
          <el-form-item label="富文本描述" prop="descRichText">
            <div style="border: 1px solid #ccc">
              <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
                       mode="default"/>
              <Editor style="height: 69vh;width: 100%; overflow-y: hidden;" v-model="valueHtml.html"
                      :defaultConfig="editorConfig" mode="default" @onCreated="handleCreated"/>
            </div>
          </el-form-item>
          <el-form-item label="操作">
            <el-button type="success" @click="preStep" :disabled="uploading">上一步</el-button>
            <el-button type="primary" @click="nextStep" :disabled="uploading">下一步</el-button>
          </el-form-item>
        </el-form>
        <el-form v-if="active === 3" :model="form" label-width="120px">
          <el-form-item prop="routeName" label="路线名称">
            <el-input v-model="courseVersionForm.part3['routeName']"></el-input>
          </el-form-item>
          <el-form-item label="地图工具" prop="polygonGeometry">
            <div style="height: 66vh;width: 100%;">
              <el-amap :center="amapParam.center" :zoom="amapParam.zoom">
                <el-amap-control-map-type :visible="true"></el-amap-control-map-type>
                <el-amap-search-box :visible="true" @select="selectPoi"/>
                <el-amap-control-geolocation :visible="true" @complete="getLocation"/>
                <el-amap-mouse-tool
                    :type="mouseToolType"
                    :auto-clear="true"
                    v-if="mouseToolType !== 'hidden'"
                    @draw="drawMouseTool"/>
                <el-amap-polyline
                    v-if="route.polyline.path.length !== 0"
                    :editable="route.polyline.editable"
                    :visible="route.polyline.visible"
                    :draggable="route.polyline.draggable"
                    :path="route.polyline.path"
                    @end="endEditPolyline"
                />
                <el-amap-marker
                    @dragend="handleMarkerDragEnd($event, index)"
                    @click="handleClickMarker($event, index)"
                    v-for="(marker, index) in route.markers"
                    :key="index"
                    :position="marker.position"
                    :visible="marker.visible"
                    :draggable="marker.draggable"
                    :label="marker.label"
                    :icon="icon"
                />
                <el-form-item label="工具类型" label-width="100px" style="margin-top: 10px">
                  <el-radio-group v-model="mouseToolType">
                    <el-radio-button label="hidden">选择工具</el-radio-button>
                    <el-radio-button label="polyline">路 线</el-radio-button>
                    <el-radio-button label="marker">点 位</el-radio-button>
                    <el-radio-button label="rectZoomIn">框选放大</el-radio-button>
                    <el-radio-button label="rectZoomOut">框选缩小</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="操作" label-width="100px" style="margin-top: 10px">
                  <el-radio-group v-model="mouseToolUnlock" @change="handleChangeLockStatus">
                    <el-radio-button :label="false">锁定编辑</el-radio-button>
                    <el-radio-button :label="true">解锁编辑</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-amap>
            </div>
          </el-form-item>
          <el-form-item label="简单描述" prop="descSimple" style="margin-top: 100px">
            <el-input v-model="courseVersionForm.part3['descSimple']" :rows="2" type="textarea"
                      placeholder="请输入描述内容"/>
          </el-form-item>
          <el-form-item label="富文本描述" prop="descRichText">
            <div style="border: 1px solid #ccc">
              <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
                       mode="default"/>
              <Editor style="height: 69vh;width: 100%; overflow-y: hidden;" v-model="valueHtml.html"
                      :defaultConfig="editorConfig" mode="default" @onCreated="handleCreated"/>
            </div>
          </el-form-item>
          <el-form-item label="操作">
            <el-button type="success" @click="preStep">上一步</el-button>
            <el-button type="primary" @click="nextStep">下一步</el-button>
          </el-form-item>
        </el-form>
        <el-form v-if="active === 4" :model="form" label-width="120px">
          <el-form-item prop="videoResourcePath" label="课程视频">
            <el-upload list-type="picture-card" :auto-upload="false" v-model:file-list="videoFile['part4']" accept="video/*"
                       :on-change="handleChangeFileUpload">
              <el-button type="primary" :loading="uploading">{{ uploading ? '上传中...' : '点击上传' }}</el-button>
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
                      v-if="uploading"
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
          <el-form-item label="简单描述" prop="descSimple">
            <el-input v-model="courseVersionForm.part4['descSimple']" :rows="2" type="textarea"
                      placeholder="请输入描述内容"/>
          </el-form-item>
          <el-form-item label="富文本描述" prop="descRichText">
            <div style="border: 1px solid #ccc">
              <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
                       mode="default"/>
              <Editor style="height: 69vh;width: 100%; overflow-y: hidden;" v-model="valueHtml.html"
                      :defaultConfig="editorConfig" mode="default" @onCreated="handleCreated"/>
            </div>
          </el-form-item>
          <el-form-item label="操作">
            <el-button type="success" @click="preStep" :disabled="uploading">上一步</el-button>
            <el-button type="primary" @click="onSubmit" :disabled="uploading">提交</el-button>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>
    <el-dialog append-to-body v-model="route.showPointDialog" title="点位详情" destroy-on-close center align-center>
      <el-form-item label="点位坐标">
        <el-form-item label="经度">
          <el-input-number v-model="route.dialogForm.lng" :precision="5" :step="0.00001" :min="0" :max="180"/>
        </el-form-item>
        <el-form-item label="纬度" style="margin-left: 10px">
          <el-input-number v-model="route.dialogForm.lat" :precision="5" :step="0.00001" :min="0" :max="90"/>
        </el-form-item>
      </el-form-item>
      <el-form-item label="点位名称">
        <el-input v-model="route.dialogForm.pointName"/>
      </el-form-item>
      <el-form-item label="简单描述">
        <el-input type="textarea" :rows="2" v-model="route.dialogForm.descSimple"/>
      </el-form-item>
      <el-form-item prop="videoResourcePath" label="点位视频">
        <el-upload list-type="picture-card" :auto-upload="false" v-model:file-list="videoFile[route.dialogForm['pointName']]"  accept="video/*"
                   :on-change="handleChangeFileUpload">
          <el-button type="primary" :loading="route.dialogForm.uploading">
            {{ route.dialogForm.uploading ? '上传中...' : '点击上传' }}
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
                  v-if="route.dialogForm.uploading"
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
      <template #footer>
            <span class="dialog-footer">
                <el-button type="danger" @click="handleDeletePoint">删除</el-button>
                <el-button type="primary" :disabled="route.dialogForm.uploading"
                           @click="onSubmitPointForm">保存</el-button>
            </span>
      </template>
    </el-dialog>

  </el-dialog>
</template>

<script setup>
import { generateAccessUrl, getCourseVersionPartByVersion } from 'src/api/common'
import { getAccessUrl, sliceUploadFile } from 'src/api/cos'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { ElMessage } from 'element-plus'
import { openURL } from 'quasar'

const mouseToolType = ref('polyline')
const mouseToolUnlock = ref(true)

const videoFile = reactive({})

const handleMarkerDragEnd = (e, index) => {
  route.markers[index].position = [e.lnglat.KL, e.lnglat.kT]
}

const handleDeletePoint = () => {
  route.markers.splice(route.dialogForm.index, 1)
  route.showPointDialog = false
  ElMessage({
    type: 'success',
    message: '移除点位成功'
  })
}

const onSubmitPointForm = () => {
  route.markers[route.dialogForm.index].label.content = route.dialogForm.pointName
  route.markers[route.dialogForm.index].position = [route.dialogForm.lng, route.dialogForm.lat]
  route.markers[route.dialogForm.index].pointName = route.dialogForm.pointName
  route.markers[route.dialogForm.index].descSimple = route.dialogForm.descSimple
  route.markers[route.dialogForm.index].videoResourcePath = route.dialogForm.videoResourcePath
  route.showPointDialog = false

  ElMessage({
    type: 'success',
    message: '保存成功'
  })
}

const handleClickMarker = (e, index) => {
  console.log(index)
  let marker = route.markers[index]
  route.dialogForm = {
    lng: marker.position[0],
    lat: marker.position[1],
    index: index,
    pointName: marker.label.content,
    descSimple: marker.descSimple,
    videoResourcePath: marker.videoResourcePath,

  }
  route.showPointDialog = true
}
const endEditPolyline = (e) => {
  route.polyline.path = e.target._opts.path
}

const route = reactive({
  polyline: {
    path: [],
    editable: true,
    visible: true,
    draggable: true,
  },
  markers: [],
  showPointDialog: false,
  dialogForm: {}
})

const handleChangeLockStatus = (current) => {
  route.polyline.editable = current
  route.polyline.draggable = current

  route.markers.forEach(item => {
    item.editable = current
    item.draggable = current
  })
}
const getLocation = (e) => {
  amapParam.center = [e.poi.location.lng, e.poi.location.lat]
}

const amapParam = reactive({
  center: [110, 30],
  zoom: 12
})

const selectPoi = (e) => {
  amapParam.center = [e.poi.location.lng, e.poi.location.lat]
}
const drawMouseTool = (data, target) => {
  if (mouseToolType.value === 'polyline') {
    route.polyline.path = data
  } else if (mouseToolType.value === 'marker') {
    route.markers.push({
      position: data,
      editable: true,
      visible: true,
      draggable: true,
      label: {
        content: route.markers.length + 1
      }
    },)
  }

}

const icon = new AMap.Icon({
  size: new AMap.Size(20, 30),    // 图标尺寸
  image: 'https://webapi.amap.com/theme/v1.3/markers/b/mark_bs.png',  // Icon的图像
  imageOffset: new AMap.Pixel(0, 0),  // 图像相对展示区域的偏移量，适于雪碧图等
  imageSize: new AMap.Size(20, 30)   // 根据所设置的大小拉伸或压缩图片
});

const amapPolygon = reactive({
  editable: true
})
const end = ({
  type,
  target
}) => {
  console.log(target)
}

const props = defineProps({
  form: {}
})

const active = ref(0)

const courseVersionForm = reactive({
  partNames: [],
  info: {},
  part1: {},
  part2: {},
  part3: {},
  part4: {},
})
if (props.form) {
  getCourseVersionPartByVersion(props.form['courseVersion']).then(res => {
    courseVersionForm['partNames'] = res.data
    courseVersionForm.info['descSimple'] = props.form['data']['descSimple']
    courseVersionForm.info['descRichText'] = props.form['data']['descRichText']
    valueHtml.html = courseVersionForm.info['descRichText']

    let part = props.form['data']['parts'][0]
    courseVersionForm.part1['descSimple'] = part['descSimple']
    courseVersionForm.part1['descRichText'] = part['descRichText']
    videoFile['part1'] = [{
      name: '',
      url: part['videoResourcePathUrl']
    }]

    part = props.form['data']['parts'][1]
    courseVersionForm.part2['descSimple'] = part['descSimple']
    courseVersionForm.part2['descRichText'] = part['descRichText']
    videoFile['part2'] = [{
      name: '',
      url: part['videoResourcePathUrl']
    }]

    part = props.form['data']['parts'][3]
    courseVersionForm.part4['descSimple'] = part['descSimple']
    courseVersionForm.part4['descRichText'] = part['descRichText']
    videoFile['part4'] = [{
      name: '',
      url: part['videoResourcePathUrl']
    }]

    part = props.form['data']['parts'][2]
    courseVersionForm.part3['routeName'] = part['route']['routeName']
    courseVersionForm.part3['descSimple'] = part['route']['descSimple']
    courseVersionForm.part3['descRichText'] = part['route']['descRichText']
    route.polyline.path = part['route']['polylineGeometry']
    route.polyline.editable = false
    route.polyline.draggable = false
    route.markers = part['route']['points']
    if (route.markers !== undefined) {
      route.markers.forEach(item => {
        videoFile[item['pointName']] = [{
          name: '',
          url: item['videoResourcePathUrl']
        }]
      })
    }

    amapParam.center = [part['route']['polylineCentroid'].lng, part['route']['polylineCentroid'].lat]
    amapParam.zoom = 18
    mouseToolUnlock.value = false

    mouseToolType.value = 'hidden'
  })
}
const show = ref(true)
const scrollbarRef = ref(null)

const nextStep = () => {
  if (active.value === 0) {
    courseVersionForm[`info`]['descRichText'] = valueHtml.html
    active.value += 1
    valueHtml.html = courseVersionForm[`part${active.value}`]['descRichText']
  } else if (active.value === 3 && mouseToolUnlock.value) {
    ElMessage({
      type: 'error',
      message: '请锁定编辑地图！'
    })
  } else {
    courseVersionForm[`part${active.value}`]['descRichText'] = valueHtml.html
    active.value += 1
    valueHtml.html = courseVersionForm[`part${active.value}`]['descRichText']
  }
  scrollbarRef.value.setScrollTop(0)
}

const preStep = () => {
  if (active.value === 1) {
    valueHtml.html = courseVersionForm[`info`]['descRichText']
    active.value -= 1
  } else if (active.value === 3 && mouseToolUnlock.value) {
    ElMessage({
      type: 'error',
      message: '请锁定编辑地图！'
    })
  } else {
    valueHtml.html = courseVersionForm[`part${active.value -= 1}`]['descRichText']
  }
  scrollbarRef.value.setScrollTop(0)
}

const uploading = ref(false)

const handleChangeFileUpload = (uploadFile) => {
  if (route.showPointDialog) {
    route.dialogForm['uploading'] = true
  } else {
    uploading.value = true
  }
  sliceUploadFile(uploadFile.raw, 'course-version-part-version').then(data => {
    if (route.showPointDialog) {
      route.dialogForm['videoResourcePath'] = data['Key']
      ElMessage({
        type: 'success',
        message: '上传成功'
      })
      route.dialogForm['uploading'] = false
      generateAccessUrl(data['Key']).then(res => {
        videoFile[`${route.dialogForm['pointName']}`] = [{
          name: '',
          url: res.data
        }]
      })
    } else {
      courseVersionForm[`part${active.value}`]['videoResourcePath'] = data.Key
      ElMessage({
        type: 'success',
        message: '上传成功'
      })
      uploading.value = false
      generateAccessUrl(data['Key']).then(res => {
        videoFile[`part${active.value}`] = [{
          name: '',
          url: res.data
        }]
      })
    }
  }).catch(err => {
    if (route.showPointDialog) {
      route.dialogForm['uploading'] = false
    } else {
      uploading.value = false
    }
    ElMessage({
      type: 'error',
      message: '服务器繁忙,请重试!'
    })
  })
}

const valueHtml = reactive({
  html: ''
})
const editorRef = shallowRef()
const formRef = ref(null)

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

const handlePreviewUpload = (e) => {
  console.log(e)
  openURL(e.url)
}

// 使用defineEmits创建名称，接受一个数组
const emit = defineEmits(['onSubmit', 'onCancel'])
const onSubmit = () => {
  let result = {
    descSimple: courseVersionForm.info.descSimple,
    descRichText: courseVersionForm.info.descRichText,
    version: props.form['courseVersion'],
    parts: [
      {
        partNumber: 1,
        descSimple: courseVersionForm.part1.descSimple,
        descRichText: courseVersionForm.part1.descRichText,
        videoResourcePath: courseVersionForm.part1.videoResourcePath,
      },
      {
        partNumber: 2,
        descSimple: courseVersionForm.part2.descSimple,
        descRichText: courseVersionForm.part2.descRichText,
        videoResourcePath: courseVersionForm.part2.videoResourcePath,
      },
      {
        partNumber: 3,
        route: {
          routeName: courseVersionForm.part3.routeName,
          descSimple: courseVersionForm.part3.descSimple,
          descRichText: courseVersionForm.part3.descRichText,
          polylineGeometry: route.polyline.path,
          points: route.markers
        }
      },
      {
        partNumber: 4,
        descSimple: courseVersionForm.part4.descSimple,
        descRichText: valueHtml.html,
        videoResourcePath: courseVersionForm.part4.videoResourcePath,
      },
    ]
  }
  emit('onSubmit', { result })
}

const onCancel = () => {
  emit('onCancel', true)
}

</script>

<style scoped>

.step-header {
  margin-top: 10px;
  position: relative;
  width: 100%;
  height: 60px;
}

.form-main {
  position: absolute;
  margin: auto 6%;
  top: 180px;
  bottom: 0;
}
</style>
