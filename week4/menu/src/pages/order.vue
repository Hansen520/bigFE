<template>
  <div class="home">
    <div class="left">下单1
      <ul>
        <li v-for="(item, index) in list" :key="'order'+ index">
          <!-- <span>{{item.name}} -- {{item.price}}</span>
          <button type="button" @click="minus(item, index)">-</button>
          <span>{{typeof item.num === 'undefined' ? 0: item.num}}</span>
          <button type="button" @click="add(item, index)">+</button> -->
        </li>
      </ul>
    </div>
    <div class="righ">right</div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'order',
  data () {
    return {
      list: this.$store.list
    }
  },
  computed:{
    list(){
      return this.$store.list
    }
  },
  mounted(){
    console.log(this.list)
  },
  methods: {
    minus(item, index){
      if(typeof item.num === 'undefined'){
        item.num = 0
      }
      item.num--
      if(item.num < 0){
        item.num = 0
      }
      // 因为vue2不会自动往对象中添加属性，所以要使用set
      // 1数组、索引，索引对应该变化的值
      this.$set(this.list, index, item)
    },
    add(item, index){
      if(typeof item.num === 'undefined'){
        item.num = 0
      }
      item.num++
      if(item.num > 100){
        item.num = 100
      }
      this.$set(this.list, index, item)
    }
  }
}

</script>

<style>
.home{
   width: 600px 
  }
  .left{
    float: left;
  }
  .right{
    float: right;
  }
</style>
