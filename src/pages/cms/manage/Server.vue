<!--<template>-->
<!--  <div id="main" style="width: 100%; height: 400px"></div>-->
<!--</template>-->

<!--<script setup>-->
<!--import * as echarts from 'echarts'-->
<!--import { onMounted, reactive } from 'vue'-->
<!--import { getServerInfo } from '../../../api/common'-->

<!--onMounted(() => {-->
<!--  // 基于准备好的dom，初始化echarts实例-->
<!--  let instance = echarts.init(document.getElementById('main'))-->
<!--  const option = {-->
<!--    title: {-->
<!--      text: '系统状态',-->
<!--      left: 'center'-->
<!--    },-->
<!--    tooltip: {-->
<!--      trigger: 'item'-->
<!--    },-->
<!--    legend: {-->
<!--      top: '5%',-->
<!--      left: 'center'-->
<!--    },-->
<!--    dataset: [],-->
<!--    series: []-->
<!--  }-->
<!--  getServerInfo().then(res => {-->
<!--    let data = res.data-->
<!--    console.log(res)-->
<!--    option.dataset.push({-->
<!--      -->
<!--    })-->
<!--    option.series.push({-->
<!--      name: 'CPU',-->
<!--      type: 'pie',-->
<!--      radius: ['0%', '40%'],-->
<!--      avoidLabelOverlap: false,-->
<!--      itemStyle: {-->
<!--        borderRadius: 10,-->
<!--        borderColor: '#fff',-->
<!--        borderWidth: 2-->
<!--      },-->
<!--      label: {-->
<!--        show: false,-->
<!--        position: 'center',-->
<!--        formatter: '{d}%'-->
<!--      },-->
<!--      emphasis: {-->
<!--        label: {-->
<!--          show: true,-->
<!--          fontSize: '25',-->
<!--          fontWeight: 'bold'-->
<!--        }-->
<!--      },-->
<!--      labelLine: {-->
<!--        show: true-->
<!--      },-->
<!--      datasetIndex: 1-->
<!--    })-->
<!--    instance.setOption(option)-->
<!--  })-->

<!--})-->

<!--</script>-->

<!--<style scoped>-->

<!--</style>-->
