<template>
  <div class="performance-view">
    <h2>性能测试</h2>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'PerformanceView'
}
</script>

<style scoped>
.performance-view {
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
}
</style>