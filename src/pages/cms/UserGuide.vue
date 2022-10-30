<template >
  <v-md-preview :text="MDValue"/>
</template>
<script setup>
import { userGuideMD } from 'src/api/common'

const MDValue =  ref('')

userGuideMD().then(res => {
  MDValue.value = res.data
})
</script>
