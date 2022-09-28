<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'

const $q = useQuasar()
$q.localStorage.set('token', 'test token')
</script>
<style>
#app {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
