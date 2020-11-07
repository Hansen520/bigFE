<template>
  <div id="home">
   <div>{{msg}}1</div>
   <div class="left">
     <form action="" v-if="isShow">
       <div class="item">
         菜品名称
         <input type="text" v-model="unit.name">
       </div>
       <div class="item">
         菜品图片
         <input type="text" v-model="unit.pic">
       </div>
       <div class="item">
         菜品分类
         <input type="text" v-model="unit.type">
       </div>
       <div class="item">
         菜品单价
         <input type="text" v-model="unit.price">
       </div>
       <button type="button" @click="submit">确定</button>
     </form>
     <div class="info" v-else>
       {{unit.name}}-{{unit.pic}}-{{unit.type}}-{{unit.price}}
       <div class="ctrl">
         <button type="button" @click="add">添加</button>
         <button @click="cencel">取消</button>
       </div>
     </div>
   </div>
   <div class="right">
     <ul>
       <li v-for="(item,index) of list" :key="index">
         {{item.name}} -- {{item.type}} -- {{item.price}}
       </li>
     </ul>
   </div>
  </div>
</template>

<script>
export default {
  name: 'menus',
  data(){
    return {
      msg: 'hello hangzhou!',
      unit:{
        name: '',
        pic: '',
        type: '',
        price: ''
      },
      isShow: true,
      list: []
    }
  },
  components:{},
  mounted(){
    this.list = this.$store.state.list
  },
  methods:{
    submit(){
      this.isShow = false
    },
    add(){
      // 必需要用扩展运算符，不然指向同一个地址，这里特别注意
      this.list.push({...this.unit})
      // console.log(this.list)
      this.$store.commit('setList', this.list)
      this.unit.name = ''
      this.unit.pic = ''
      this.unit.type = ''
      this.unit.price = ''
      this.isShow = true
    },
    cencel(){
      this.isShow = true
    }
  }
}

</script>

<style>
  #home{
   width: 400px 
  }
  .left{
    float: left;
  }
  .right{
    float: right;
  }
</style>
