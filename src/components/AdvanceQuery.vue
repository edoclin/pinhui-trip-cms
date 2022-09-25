<template>
    <el-dialog v-model="show" title="高级条件查询">
        <el-form :model="conditions">
            <el-form-item v-for="(item, index) in conditions" :key="index" :label="item.name" label-width="120">
                <el-input v-model="form[item.key]">
                    <template #prefix v-if="index !== 0">
                        <el-switch v-model="isAnd[item.key]" inline-prompt active-text="与" inactive-text="或" />
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-date-picker format="YYYY-MM-DDTHH:mm:ss" v-model="form.createdBetween" type="datetimerange"
                    range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" />
            </el-form-item>
            <el-form-item label="更新时间">
                <el-date-picker format="YYYY-MM-DDTHH:mm:ss" v-model="form.updatedBetween" type="datetimerange"
                    range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="onCancel">取消</el-button>
                <el-button type="primary" @click="onSubmit">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { reactive } from 'vue';


const props = defineProps({
    conditions: []
})

const form = reactive({
})
const show = reactive(true)

const isAnd = reactive({
})

// 使用defineEmits创建名称，接受一个数组
const emit = defineEmits(['onSubmit', 'onCancel'])
const onSubmit = () => {
    let result = []
    let createdBetween = {}
    let updatedBetween = {}
    if (form.createdBetween) {
        createdBetween = {
            start: form.createdBetween[0],
            end: form.createdBetween[1],
        }
        delete form.createdBetween
    }

    if (form.updatedBetween) {
        updatedBetween = {
            start: form.updatedBetween[0],
            end: form.updatedBetween[1],
        }
        delete form.updatedBetween
    }

    Object.keys(form).forEach(key => {
        result.push({
            column: key,
            value: form[key],
            isAnd: isAnd[key] === undefined ? false : isAnd[key]
        })
    })
    emit('onSubmit', { conditions: result, createdBetween, updatedBetween })
}

const onCancel = () => {
    emit('onCancel', true)
}

</script>
