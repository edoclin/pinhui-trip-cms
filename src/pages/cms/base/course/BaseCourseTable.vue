<template>
  <div>
    <advance-query v-if="advancedQuery.show" :conditions="conditions.map" @onSubmit="queryConditions"
                   @onCancel="advancedQuery.show = false">
      <template v-slot:selector="scope">
        <el-form-item label="所属基地">
          <el-select :multiple="true" v-model="scope.formData['selector'].baseIds" placeholder="请选择关联基地"
                     style="width: 100%">
            <el-option v-for="base in baseSelector.data" :key="base.baseId" :label="base.baseName"
                       :value="base.baseId"/>
          </el-select>
        </el-form-item>
      </template>
    </advance-query>
    <!-- flag -->
    <el-table v-loading="tableData.loading" @sort-change='sortTable' border table-layout="auto" stripe :data="tableData.data" style="width: 100%"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="30"/>
      <!-- flag -->
      <el-table-column v-for="(item, index) in displayRows" :key="index" :sortable="item.sortable"
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
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 10px">
    <!-- flag -->
      <el-col :span="4">
        <el-pagination small background layout="total, sizes, prev, pager, next" :total="page.total"
                       :page-sizes="[10, 20, 50, 100]" v-model:currentPage="page.current"
                       v-model:page-size="page.size"/>
      </el-col>
    
    <!--      lwc_flag-->
    <el-col :span="12">
        <el-select :multiple="true" value-key="column" size="small" v-model="displayRows" placeholder="请选择需要展示的字段"
                   :style="{marginTop: '2px', width: `${autoWidth}px`}">
          <el-option
              v-for="item in tableData.columns"
              :key="item.column"
              :label="item.label"
              :value="item"
          />
        </el-select>
      </el-col>
    <!--      lwc_flag-->
      <el-col style="position: absolute;right: 0;margin-top: 5px" @click="fetchListData">
        <el-link>
          <template #icon>
            <el-icon>
              <Refresh/>
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
import {
  listBaseCourse,
  deleteBaseCourseByIds,
  getBaseCourseConditions,
  getTableColumns
} from 'src/api/base-course'
import AdvanceQuery from 'src/components/AdvanceQuery.vue'
import BaseCourseFormVue from './BaseCourseForm.vue'
import { getBaseSelector } from 'src/api/base'
import { date } from 'quasar'

const fetchTime = ref('')
const bus = inject('bus')

// lwc_flag
const displayRows = ref([])
// lwc_flag
const autoWidth = ref(0)

const baseSelector = reactive({
  data: []
})

getBaseSelector().then(res => {
  baseSelector.data = res.data
})

const page = reactive({
  current: 1,
  total: 0,
  size: 10
})

const conditions = reactive({
  map: []
})

getBaseCourseConditions().then(res => {
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
  listBaseCourse(page.current, page.size, { ...queryParam }).then(res => {
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
  selectedData.data.forEach(item => ids.push(item.courseId))

  deleteBaseCourseByIds({ ids }).then(res => {
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
    // lwc_flag 所有list**** 替换为新抽取的函数
    fetchListData()
}

const advancedQuery = reactive({
  show: false,
})

const queryConditions = ({
  conditions,
  createdBetween,
  updatedBetween,
  selector
}) => {
  queryParam.createdBetween = createdBetween
  queryParam.updatedBetween = updatedBetween
  queryParam.conditions = conditions
  queryParam.selector = selector
  
  // lwc_flag 这里由于要关闭dialog 传入一个后处理器
  fetchListData(() => {
    advancedQuery.show = false
  })
}

const onEdit = (record) => {
  bus.emit('edit-item', {
    record,
    component: BaseCourseFormVue,
    title: '课程编辑',
    name: record.courseId
  })
}

// const updateData = () => {
//   listBaseCourse(page.current, page.size, { ...queryParam }).then(res => {
//     tableData.data = res.data
//     page.total = res.count
//     fetchTime.value = date.formatDate(Date.now(), 'YYYY年MM月DD日 HH时mm分')
//   })
// }
// bus.on('update-base-course-table', () => updateData())

// lwc_flag 原来的updateData()函数删除掉
bus.on('update-role-table', () => fetchListData())
</script>
<style>
</style>
