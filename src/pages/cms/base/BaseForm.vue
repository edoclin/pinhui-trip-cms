<template>
    <el-form :model="form" label-width="120px" ref="formRef">
        <el-form-item label="基地名称"  prop="baseName">
            <el-input v-model="form.baseName" />
        </el-form-item>
        <el-form-item label="基地位置" prop="polygonGeometry">
            <div style="height: 60vh;width: 100%;">
                <el-amap :center="amapParam.center" :zoom="amapParam.zoom">
                    <el-amap-search-box :visible="true" @select="selectPoi" @choose="choosePoi" />
                    <el-amap-control-geolocation :visible="true" @complete="getLocation" />
                    <el-amap-mouse-tool v-if="form.polygonGeometry.length === 0" type="polygon" :auto-clear="true"
                        @draw="drawMouseTool" />
                    <el-amap-polygon :path="form.polygonGeometry" :visible="true" :editable="amapPolygon.editable"
                        :draggable="amapPolygon.editable" @end="end" />
                </el-amap>
                <el-button style="width: 100%" v-if="form.polygonGeometry.length !== 0"
                    :type="amapPolygon.editable ? 'danger' : 'primary'"
                    @click="amapPolygon.editable = !amapPolygon.editable">{{amapPolygon.editable ? '保存' : '编辑'}}
                </el-button>
            </div>
        </el-form-item>
        <el-form-item prop="baseLocationText" label="详细位置" style="margin-top: 50px">
            <el-input v-model="form.baseLocationText" />
        </el-form-item>
        <el-form-item prop="coverResourcePath" label="展示图片">
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
        <el-form-item label="简单描述" prop="descSimple">
            <el-input v-model="form.descSimple" :rows="2" type="textarea" placeholder="请输入描述内容" />
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
            <el-button type="primary" @click="onSubmit(formRef)">{{data ? '更新' : '创建'}}</el-button>
            <el-button v-if="!data" @click="onResetForm(formRef)">重置</el-button>
        </el-form-item>
    </el-form>
</template>
<script setup>
import { onBeforeUnmount, reactive, ref, shallowRef } from 'vue';
import { regeo } from '../../../api/amap'
import { sliceUploadFile, getAccessUrl } from '../../../api/cos'
import { postBase, putBase } from '../../../api/base'
import { ElMessage } from 'element-plus'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

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


const onSubmit = (formEl) => {
    form.descRichText = valueHtml.html
    // update
    if (props.data) {
        putBase(form).then(res => {
            ElMessage({
                type: 'success',
                message: res.data,
            })
            onResetForm(formEl)
        })
    } else {
        postBase(form).then(res => {
            ElMessage({
                type: 'success',
                message: res.data,
            })
            onResetForm(formEl)
        })
    }
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
const end = ({ type, target }) => {
    console.log(target._opts.path);
    form.polygonGeometry = target._opts.path
}

const handleChangeFileUpload = (uploadFile) => {
    sliceUploadFile(uploadFile.raw, "base-cover").then(data => {
        form.coverResourcePath = data.Key
        ElMessage({
            type: 'success',
            message: '上传成功'
        })
    })
}


const props = defineProps({
    data: {}
})
if (props.data) {
    console.log(props.data);
    form.baseId = props.data.baseId
    form.baseName = props.data.baseName
    form.baseLocationText = props.data.baseLocationText
    form.coverResourcePath = props.data.coverResourcePath
    form.descSimple = props.data.descSimple
    form.descRichText = props.data.descRichText
    valueHtml.html = props.data.descRichText
    props.data.polygon.forEach(item => {
        console.log(item);
        form.polygonGeometry.push([item.lng, item.lat])
    })
    amapParam.center = [props.data.centroid.lng, props.data.centroid.lat]
}

</script>