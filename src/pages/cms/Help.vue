<template >
  <v-md-preview :text="MDValue"/>
</template>
<script setup>
import { helpMD } from 'src/api/common'

const MDValue =  ref('')

helpMD().then(res => {
  MDValue.value = res.data
})
</script>
