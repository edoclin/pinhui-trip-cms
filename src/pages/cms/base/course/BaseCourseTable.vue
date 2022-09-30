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
        </template>
      </el-table-column>
    </el-table>
    <el-pagination small background layout="total, sizes, prev, pager, next" :total="page.total"
                   :page-sizes="[10, 20, 50, 100]" v-model:currentPage="page.current" v-model:page-size="page.size"/>


  </div>
</template>
<script setup>
import { ElMessage } from 'element-plus'
import { reactive, watch } from 'vue'
import {
  listBaseCourse,
  deleteBaseCourseByIds,
  getBaseCourseConditions,
  getTableColumns
} from 'src/api/base-course'
import AdvanceQuery from 'src/components/AdvanceQuery.vue'
import BaseCourseFormVue from './BaseCourseForm.vue'
import { getSelector } from '../../../../api/base'

const baseSelector = reactive({
  data: []
})

getSelector().then(res => {
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

watch(page, () => {
  listBaseCourse(page.current, page.size, queryParam).then(res => {
    tableData.data = res.data
    page.total = res.count
  })
})

listBaseCourse(page.current, page.size, queryParam).then(res => {
  tableData.data = res.data
  page.total = res.count
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

  selectedData.data.forEach(item => ids.push(item.courseId))

  deleteBaseCourseByIds({ ids }).then(res => {
    ElMessage({
      type: 'success',
      message: res.data
    })
    listBaseCourse(page.current, page.size, { ...queryParam }).then(res => {
      tableData.data = res.data
      page.total = res.count
    })
  })
}

const sortTable = (column) => {
  queryParam.isAsc = column.order === 'ascending'
  queryParam.orderColumns = [column.prop]
  listBaseCourse(page.current, page.size, queryParam).then(res => {
    tableData.data = res.data
    page.total = res.count
  })
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
  listBaseCourse(page.current, page.size, { ...queryParam }).then(res => {
    tableData.data = res.data
    page.total = res.count
    advancedQuery.show = false
  })
}

// 使用defineEmits创建名称，接受一个数组
const emit = defineEmits(['onEdit'])

const onEdit = (record) => {
  console.log(record)
  emit('onEdit', {
    record,
    component: BaseCourseFormVue,
    title: '课程编辑',
    name: record.courseId
  })
}
</script>
<style>
</style>