<template>
    <el-tabs
    v-model="currentTab.name"
    type="card"
    closable
    @tab-remove="removeTab">
    <el-tab-pane
      v-for="item in editableTabs"
      :key="item.key"
      :label="item.title"
      :name="item.name">
    <component :is="item.component" @onEdit="handleEdit" :data="children[item.name]"></component>
    </el-tab-pane>
  </el-tabs>

</template>
<script setup>
import { reactive, markRaw, ref } from 'vue';
const editableTabs = reactive([])
let currentTab = reactive({
    name: ''
})

import('./base/BaseTable.vue').then(item => {
    editableTabs.push({
        component: markRaw(item.default),
        title: '基地',
        name: '基地',
        key: "BaseTable"
    })
    currentTab.name = '基地'
})

import('./base/BaseForm.vue').then(item => {
    editableTabs.push({
        component: markRaw(item.default),
        title: '基地操作',
        name: '基地操作',
        key: "BaseForm"
    })
    currentTab.name = '基地操作'
})

const removeTab = (name) => {
    editableTabs.splice(editableTabs.findIndex(item => item.name === name), 1)
    delete children[name]
}

const children = reactive({
})

const reload = ref(true)

const handleEdit = ({record, component, title, name}) => {
    editableTabs.push({
        component: markRaw(component),
        title: title,
        name: name,
        key: component.__name
    })
    children[name] = record
    currentTab.name = name
}

</script>