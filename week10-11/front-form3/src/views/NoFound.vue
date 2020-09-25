<template>
  <div class="layui-container">
    404~~找不到页面了<br>
    <router-link to="/" class="backindex">回到首页</router-link>
  </div>
</template>

<script>
export default {
  name: 'no-found'
}

</script>

<style lang="scss" scoped>
.layui-container{
  font-weight: 400;
  font-size:30px;
}
.backindex{
  color: #0b81f7;
}
</style>
