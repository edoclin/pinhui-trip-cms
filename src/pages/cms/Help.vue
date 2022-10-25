<template >
  <v-md-preview :text="helpMDValue"/>
</template>
<script setup>
import { helpMD } from 'src/api/common'

const helpMDValue =  ref('')

helpMD().then(res => {
  helpMDValue.value = res.data
})
</script>
