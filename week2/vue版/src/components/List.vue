<template>
  <div>
    <h1>返回结果来了</h1>
    <div>
      <!-- 这里已经完成了双向绑定 -->
      <!-- 用户输入的page与num，可以通过send方法传递HTTP请求 -->
      <label>
        <span>页码：</span>
        <input type="text" v-model="page" />
      </label>
      <label>
        <span>数量：</span>
        <input type="text" v-model="num" />
      </label>
      <!-- 这里有事件的绑定 -->
      <button type="button" @click="send()">提交</button>
    </div>
    <!-- 通过JSON.stringify格式化显示 -->
    <pre v-html="JSON.stringify(this.items, null, 2)"></pre>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "List",
  data() {
    return {
      page: 1,
      num: 3,
      // 这里是数据体
      items: []
    };
  },
  methods: {
    send () {
      // 使用axios作为http客户端，发送HTTP的GET请求
      // 传递参数num和page
      axios.get('http://api/yourdomain.test',{
        params:{
          num: this.num
        }
      }).then(
        (res)=>{
          this.items = res.data.data
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
