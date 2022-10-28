<template>
  <div>
    <advance-query v-if="advancedQuery.show" :conditions="conditions.map" @onSubmit="queryConditions"
                   @onCancel="advancedQuery.show = false"></advance-query>
    <el-table @sort-change='sortTable' border table-layout="auto" stripe :data="tableData.data" style="width: 100%"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="30"/>
      <el-table-column v-for="(item, index) in tableData.columns" :key="index" :sortable="item.sortable"
                       :fixed="item.fixed" :prop="item.column" :label="item.label"></el-table-column>
      <el-table-column :fixed="'right'" label="操作">
        <template #header v-if="selectedData.data.length !== 0">
          <el-popconfirm @confirm="deleteSelected" :title="`确定删除所选中的${selectedData.data.length}条记录?`">
            <template #reference>
              <el-button type="danger" size="small">删除选中</el-button>
            </template>
          </el-popconfirm>
        </template>
        <template #header v-else>
          <el-button type="primary" @click="advancedQuery.show = true" size="small">高级查询</el-button>
        </template>
        <template #default="scope">
          <el-button type="success" link @click="onEdit(scope.row)" size="small">编辑</el-button>
          <el-popover placement="left" :width="626" trigger="hover" @after-leave="resetRelatedCourseData" @show="fetchRelatedCourse(scope.row.categoryId)">
            <template #reference>
              <el-button type="primary" link size="small" style="margin-right: 16px">课程
              </el-button>
            </template>
            <el-table v-loading="loadingRelatedCourse" :data="relatedCourse">
              <el-table-column width="300" property="baseName" label="所属基地"></el-table-column>
              <el-table-column width="300" property="courseName" label="课程名称">
                <template #default="scope">
                  <el-button type="success" link size="small" @click="copyCourseId(scope.row.courseId)">
                    {{ scope.row.courseName }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 10px">
      <el-col :span="12">
        <el-pagination small background layout="total, sizes, prev, pager, next" :total="page.total"
                       :page-sizes="[10, 20, 50, 100]" v-model:currentPage="page.current"
                       v-model:page-size="page.size"/>
      </el-col>
      <el-col style="position: absolute;right: 0;color: #919398;font-size: 12px;margin-top: 5px">数据更新时间:
        {{ fetchTime }}
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import { ElMessage } from 'element-plus'
import { reactive, watch } from 'vue'
import {
  listBaseCourseCategory,
  deleteBaseCourseCategoryByIds,
  getBaseCourseCategoryConditions,
  getTableColumns, listRelatedCourseById
} from 'src/api/base-course-category'
import AdvanceQuery from 'src/components/AdvanceQuery.vue'
import BaseCourseCategoryFormVue from './BaseCourseCategoryForm.vue'
import { copyToClipboard } from 'quasar'

const bus = inject('bus')
import { date } from 'quasar'
const fetchTime = ref('')
const loadingRelatedCourse = ref(true)
const relatedCourse = ref([])

const resetRelatedCourseData = () => {
  relatedCourse.value = []
  loadingRelatedCourse.value = true
}


const copyCourseId = (courseId) => {
  copyToClipboard(courseId)
      .then(() => {
        ElMessage({
          type: 'success',
          message: '课程编号已复制'
        })
      })
      .catch(() => {
      })
}

const fetchRelatedCourse = (categoryId) => {
  listRelatedCourseById(categoryId).then(res => {
    setTimeout(() => {
      relatedCourse.value = res.data
      loadingRelatedCourse.value = false
    }, 500)
  })
}

const page = reactive({
  current: 1,
  total: 0,
  size: 10
})

const conditions = reactive({
  map: []
})

getBaseCourseCategoryConditions().then(res => {
  conditions.map = res.data
})

const queryParam = reactive({
  isAsc: false,
  orderColumns: ['createdTime'],
  conditions: []
})

watch(page, () => {
  listBaseCourseCategory(page.current, page.size, queryParam).then(res => {
    tableData.data = res.data
    page.total = res.count
    fetchTime.value = date.formatDate(Date.now(), 'YYYY年MM月DD日 HH时mm分')
  })
})

listBaseCourseCategory(page.current, page.size, queryParam).then(res => {
  tableData.data = res.data
  page.total = res.count
  fetchTime.value = date.formatDate(Date.now(), 'YYYY年MM月DD日 HH时mm分')
})

getTableColumns().then(res => {
  tableData.columns = res.data
})

const tableData = reactive({
  data: [],
  columns: []
})

const selectedData = reactive({
  data: []
})

const handleSelectionChange = (value) => {
  selectedData.data = [...value]
}

const deleteSelected = () => {
  let ids = []
  selectedData.data.forEach(item => ids.push(item.categoryId))

  deleteBaseCourseCategoryByIds({ ids }).then(res => {
    ElMessage({
      type: 'success',
      message: res.data
    })
    listBaseCourseCategory(page.current, page.size, { ...queryParam }).then(res => {
      tableData.data = res.data
      page.total = res.count
      fetchTime.value = date.formatDate(Date.now(), 'YYYY年MM月DD日 HH时mm分')
    })
  })
}

const sortTable = (column) => {
  queryParam.isAsc = column.order === 'ascending'
  queryParam.orderColumns = [column.prop]
  listBaseCourseCategory(page.current, page.size, queryParam).then(res => {
    tableData.data = res.data
    page.total = res.count
    fetchTime.value = date.formatDate(Date.now(), 'YYYY年MM月DD日 HH时mm分')
  })
}

const advancedQuery = reactive({
  show: false,
})

const queryConditions = ({
  conditions,
  createdBetween,
  updatedBetween
}) => {
  queryParam.createdBetween = createdBetween
  queryParam.updatedBetween = updatedBetween
  queryParam.conditions = conditions
  listBaseCourseCategory(page.current, page.size, { ...queryParam }).then(res => {
    tableData.data = res.data
    page.total = res.count
    advancedQuery.show = false
    fetchTime.value = date.formatDate(Date.now(), 'YYYY年MM月DD日 HH时mm分')
  })
}

const onEdit = (record) => {
  bus.emit('edit-item', {
    record,
    component: BaseCourseCategoryFormVue,
    title: '分类编辑',
    name: record.categoryId
  })
}

const updateData = () => {
  listBaseCourseCategory(page.current, page.size, { ...queryParam }).then(res => {
    console.log(res.data)
    tableData.data = res.data
    page.total = res.count
    fetchTime.value = date.formatDate(Date.now(), 'YYYY年MM月DD日 HH时mm分')
  })
}
bus.on('update-base-course-category-table', () => updateData())

// 组件是默认关闭的, 无法通过ref获取到
// https://blog.csdn.net/qq_35443423/article/details/125574122?spm=1001.2101.3001.6650.9&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-9-125574122-blog-116994776.pc_relevant_default&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-9-125574122-blog-116994776.pc_relevant_default&utm_relevant_index=10
// defineExpose({updateData, name: 'BaseCourseCategoryTable'})
</script>
<style>
</style>
