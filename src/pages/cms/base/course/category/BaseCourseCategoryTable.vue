<template>
  <div>
    <advance-query v-if="advancedQuery.show" :conditions="conditions.map" @onSubmit="queryConditions"
      @onCancel="advancedQuery.show = false"></advance-query>
    <!-- lwc_flag  v-loading="tableData.loading"   -->
    <el-table v-loading="tableData.loading" @sort-change='sortTable' border table-layout="auto" stripe
      :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="30" />
      <!-- lwc_flag  displayRows  -->
      <el-table-column v-for="(item, index) in displayRows" :key="index" :sortable="item.sortable" :fixed="item.fixed"
        :prop="item.column" :label="item.label"></el-table-column>
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
          <el-popover placement="left" :width="626" trigger="hover" @after-leave="resetRelatedCourseData"
            @show="fetchRelatedCourse(scope.row.categoryId)">
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
      <!--      lwc_flag-->
      <el-col :span="4">
        <el-pagination small background layout="total, sizes, prev, pager, next" :total="page.total"
          :page-sizes="[10, 20, 50, 100]" v-model:currentPage="page.current" v-model:page-size="page.size" />
      </el-col>
      <!--      lwc_flag-->
      <el-col :span="12">
        <el-select :multiple="true" value-key="column" size="small" v-model="displayRows" placeholder="请选择需要展示的字段"
          :style="{ marginTop: '2px', width: `${autoWidth}px` }">
          <el-option v-for="item in tableData.columns" :key="item.column" :label="item.label" :value="item" />
        </el-select>
      </el-col>
      <!--      lwc_flag-->
      <el-col style="position: absolute;right: 0;margin-top: 5px" @click="fetchListData">
        <el-link>
          <template #icon>
            <el-icon>
              <Refresh />
            </el-icon>
          </template>
          <div style="color: #919398;font-size: 12px;">
            数据更新时间:
            {{ fetchTime }}
          </div>
        </el-link>
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

import { date } from 'quasar'

const bus = inject('bus')
const fetchTime = ref('')
const loadingRelatedCourse = ref(true)
const relatedCourse = ref([])
// lwc_flag
const displayRows = ref([])
// lwc_flag
const autoWidth = ref(0)

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

// lwc_flag tableData 定义放在fetchListData()之前
const tableData = reactive({
  data: [],
  columns: [],
  // lwc_flag
  loading: true
})

// lwc_flag fetchListData() 放在调用前
const fetchListData = (postHandler) => {
  tableData.loading = true
  listBaseCourseCategory(page.current, page.size, { ...queryParam }).then(res => {
    tableData.data = res.data
    page.total = res.count
    fetchTime.value = date.formatDate(Date.now(), 'YYYY年MM月DD日 HH时mm分')

    // 延迟 500ms 防止画面闪烁
    setTimeout(() => {
      tableData.loading = false
    }, 500)

    if (typeof postHandler === 'function') {
      postHandler()
    }
  })
}

// lwc_flag
watch(page, () => fetchListData())

// lwc_flag
watch(displayRows, () => {
  if (displayRows.value.length <= 3) {
    autoWidth.value = 300
  } else {
    autoWidth.value = 90 * displayRows.value.length
  }
})

// lwc_flag list** 替换为 fetchListData
fetchListData()

getTableColumns().then(res => {
  tableData.columns = res.data

  // lwc_flag
  displayRows.value = res.data
  if (res.data.length <= 3) {
    autoWidth.value = 300
  } else {
    autoWidth.value = 90 * res.data.length
  }
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

    // lwc_flag 所有list**** 替换为新抽取的函数
    fetchListData()
  })
}

const sortTable = (column) => {
  queryParam.isAsc = column.order === 'ascending'
  queryParam.orderColumns = [column.prop]
  // lwc_flag
  fetchListData()
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
  // lwc_flag 这里由于要关闭dialog 传入一个后处理器
  fetchListData(() => {
    advancedQuery.show = false
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

// const updateData = () => {
//   listBaseCourseCategory(page.current, page.size, { ...queryParam }).then(res => {
//     console.log(res.data)
//     tableData.data = res.data
//     page.total = res.count
//     fetchTime.value = date.formatDate(Date.now(), 'YYYY年MM月DD日 HH时mm分')
//   })
// }
// bus.on('update-base-course-category-table', () => updateData())

bus.on('update-role-table', () => fetchListData())

// 组件是默认关闭的, 无法通过ref获取到
// https://blog.csdn.net/qq_35443423/article/details/125574122?spm=1001.2101.3001.6650.9&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-9-125574122-blog-116994776.pc_relevant_default&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-9-125574122-blog-116994776.pc_relevant_default&utm_relevant_index=10
// defineExpose({updateData, name: 'BaseCourseCategoryTable'})
</script>
<style>

</style>
