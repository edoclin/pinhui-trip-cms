<template>
  <el-transfer
      id="transfer"
      v-model="currentModel"
      filterable
      filter-placeholder="请输入关键字"
      :titles="['未添加', '已添加']"
      :button-texts="['移除', '添加']"
      :data="data"
      :props="{disabled: false, key: 'carouselId', label: 'name'}"
      @change="handleTransferChange"
      target-order="push"
  >
    <template v-slot="{option}" >{{ option.name}}</template>
  </el-transfer>
</template>

<script setup>
import Sortable from 'sortablejs'
import { ElMessageBox } from 'element-plus'
const props = defineProps({
  data: [],
  right: [],
})

const result = ref([])
const currentModel = ref([])

if (props) {
  currentModel.value = props.right
  result.value = props.right
}

const emit = defineEmits(['onDraggableChange'])

onMounted(() => {
  let rightEl = window.document.getElementById("transfer").getElementsByClassName("el-transfer-panel")[1].getElementsByClassName("el-transfer-panel__body")[0].getElementsByClassName("el-transfer-panel__list")[0]
  Sortable.create(rightEl,{
    delay: 1,
    animation: 1000,
    onEnd: (e) => {
      const {newIndex, oldIndex} = e
      let temp = result.value[newIndex]
      result.value[newIndex] = result.value[oldIndex]
      result.value[oldIndex] = temp
      currentModel.value = result.value
      emit('onDraggableChange', toRaw(result.value))
    }
  })
})

const handleTransferChange = (selectedKeys, direction, currentKeys) => {
  if (direction === 'right') {
    result.value = result.value.concat(currentKeys)
    currentModel.value = result.value
    ElMessageBox.alert('长按可拖动已添加列表项排序', '提示', {
      confirmButtonText: '确认',
    })
  } else {
    result.value = selectedKeys
    currentModel.value = result.value
  }
  emit('onDraggableChange', toRaw(result.value))
}
</script>
