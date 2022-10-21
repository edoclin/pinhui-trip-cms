<template>
  <el-tabs v-model="currentTab" stretch type="card" tab-position="left" @tab-change="handleTabChange">
    <el-tab-pane label="基地课程" name="BASE_COURSE">
      <draggable-transform v-if="showTransform && currentTab === 'BASE_COURSE'" :data="courseCarousel" :right="currentModel" @onDraggableChange="handleChange"></draggable-transform>
    </el-tab-pane>
    <el-tab-pane label="培训课程" name="TRAIN_COURSE">
      <draggable-transform v-if="showTransform && currentTab === 'TRAIN_COURSE'" :data="courseCarousel" :right="currentModel" @onDraggableChange="handleChange"></draggable-transform>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { reactive } from 'vue'
import { listViewCarousel, putViewCarouselBatch } from 'src/api/view-carousel'
import { ElMessage } from 'element-plus'

const courseCarousel = ref([])
const currentTab = ref('BASE_COURSE')
const currentModel= ref([])
const showTransform = ref(false)
const queryParam = reactive({
  isAsc: false,
  orderColumns: ['createdTime'],
  conditions: [
    {
      column: 'carouselType',
      value: currentTab
    }
  ]
})
const handleTabChange = (current) => {
  let displayed = []
  showTransform.value = false
  listViewCarousel(queryParam).then(res => {
    courseCarousel.value = res.data
    res.data.forEach(item => {
      if (item['displayed']) {
        displayed.push(item.carouselId)
      }
    })
    currentModel.value = displayed
    showTransform.value = true
  })
}


listViewCarousel(queryParam).then(res => {
  let displayed = []
  courseCarousel.value = res.data
  showTransform.value = false
  res.data.forEach(item => {
    if (item['displayed']) {
      displayed.push(item.carouselId)
    }
  })
  currentModel.value = displayed
  showTransform.value = true
})


const updateBatch = ref([])

const handleChange = (result) => {
  updateBatch.value = []
  result.forEach((item, index) => {
    let current = courseCarousel.value.find(carousel => carousel.carouselId === item)
    updateBatch.value.push({
      carouselId: current.carouselId,
      index: index + 1,
    })
  })

  putViewCarouselBatch(toRaw(updateBatch.value), currentTab.value).then(res => {
    ElMessage({
      type: "success",
      message: "更新成功"
    })
  })

}
</script>

<style scoped>

</style>
