<template>
  <div>
    <table class="layui-table">
      <thead>
        <tr>
          <th>
            <div class="layui-table-cell pl0 title">
              <span>帖子标题</span>
            </div>
          </th>
          <th>
            <div class="layui-table-cell text-right">
              <span>收藏时间</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>收藏的帖子标题323</td>
          <td class="text-right">2020-01-01 00：00：00</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'my-collection'
}

</script>

<style lang="scss" scoped>
.title{
  width: 500px;
}
</style>
