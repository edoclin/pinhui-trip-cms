<template>
  <div>
    <advance-query v-if="advancedQuery.show" :conditions="conditions.map" @onSubmit="queryConditions"
                   @onCancel="advancedQuery.show = false"></advance-query>
    <el-table @sort-change='sortTable' border table-layout="auto" stripe :data="tableData.data" style="width: 100%"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="30"/>
      <el-table-column v-for="(item, index) in tableData.columns" :key="index" :sortable="item.sortable"
                       :fixed="item.fixed" :prop="item.column" :label="item.label"></el-table-column>
      <el-table-column fixed="right" label="操作">
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
  list$module_name$,
  delete$module_name$ByIds,
  get$module_name$Conditions,
  getTableColumns
} from 'src/api/$module_name_file$'
import AdvanceQuery from 'src/components/AdvanceQuery.vue'
import $component_name$FormVue from './$component_name$Form.vue'
import { date } from 'quasar'
import { listTrainCourseCategory } from '../src/api/train-course-category'

const fetchTime = ref('')
const page = reactive({
  current: 1,
  total: 0,
  size: 10
})

const conditions = reactive({
  map: []
})

get$module_name$Conditions().then(res => {
  conditions.map = res.data
})

const queryParam = reactive({
  isAsc: false,
  orderColumns: ['createdTime'],
  conditions: []
})

watch(page, () => {
  list$module_name$(page.current, page.size, queryParam).then(res => {
    tableData.data = res.data
    page.total = res.count
    fetchTime.value = date.formatDate(Date.now(), 'YYYY年MM月DD日 HH时mm分')
  })
})

list$module_name$(page.current, page.size, queryParam).then(res => {
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

  selectedData.data.forEach(item => ids.push(item.$id_name$Id))

  delete$module_name$ByIds({ ids }).then(res => {
    ElMessage({
      type: 'success',
      message: res.data
    })
    list$module_name$(page.current, page.size, { ...queryParam }).then(res => {
      tableData.data = res.data
      page.total = res.count
      fetchTime.value = date.formatDate(Date.now(), 'YYYY年MM月DD日 HH时mm分')
    })
  })
}

const sortTable = (column) => {
  queryParam.isAsc = column.order === 'ascending'
  queryParam.orderColumns = [column.prop]
  list$module_name$(page.current, page.size, queryParam).then(res => {
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
  list$module_name$(page.current, page.size, { ...queryParam }).then(res => {
    tableData.data = res.data
    page.total = res.count
    advancedQuery.show = false
    fetchTime.value = date.formatDate(Date.now(), 'YYYY年MM月DD日 HH时mm分')
  })
}


const bus = inject('bus')

const onEdit = (record) => {
  bus.emit('edit-item', {
    record,
    component: $component_name$FormVue,
    title: '$zh_module_name$编辑',
    name: record.$_name$
  })
}

const updateData = () => {
  list$module_name$(page.current, page.size, { ...queryParam }).then(res => {
    tableData.data = res.data
    page.total = res.count
    fetchTime.value = date.formatDate(Date.now(), 'YYYY年MM月DD日 HH时mm分')
  })
}

bus.on('update-$bus_name$-table', () => updateData())

</script>
<style>
</style>
