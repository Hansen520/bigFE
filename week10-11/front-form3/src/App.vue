<template>
  <div id="app">
    <Header/>
    <router-view></router-view>
    <Footer/>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
export default {
  name: 'app',
  components: {
    Header,
    Footer
  }
}
</script>

<style lang="scss">
@import "assets/css/global.css";
/* 公共样式 */
.gray{
  color: #999;
}
.fly-panel{
  margin-bottom: 15px;
}
@for $i from 0 to 5{
  .pd#{$i} {
    padding: $i * 10 + px !important;
  }
  .pl#{$i}{
    padding-left: $i * 10 + px !important;
  }
  .pr#{$i}{
    padding-right: $i * 10 + px !important;
  }
  .mr#{$i}{
    margin-right: $i * 10 + px !important;
  }
  .mt#{$i}{
    margin-right: $i * 10 + px !important;
  }
}
/* .pd20{
  padding: 20px;
} */

// .pl0{
//   padding-left: 0;
// }
.orange{
  color: #ff5722;
}
.grey{
  color: #aaa;
}
.text-center{
  text-align: center;
}
.text-left{
  text-align: left;
}
.text-right{
  text-align: right;
}
</style>
