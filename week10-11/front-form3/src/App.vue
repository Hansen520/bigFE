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
@import "assets/css/layer/layer.css";
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
  .pt#{$i}{
    padding-top: $i * 10 + px !important;
  }
  .pb#{Si}{
    padding-bottom: $i * 10 + 'px' !important;
  }
  .mt#{$i}{
    margin-top: $i * 10 + px !important;
  }
  .mr#{$i}{
    margin-right: $i * 10 + px !important;
  }
  .ml#{$i}{
    margin-left: $i * 10 + px !important;
  }
  .mb#{$i}{
    margin-bottom: $i * 10 + px !important;
  }
}

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
.d-hide {
  position: absolute;
  overflow: hidden;
  height: 0;
}
.d-flex{
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  &.flex-start {
    justify-content: flex-start;
  }
  &.flex-end {
    justify-content: flex-end;
  }
  &.flex-center{
    justify-content: center;
  }
}
a{
  cursor: pointer;
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes bounceOut {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.05);
  }
  100% {
    opacity: 0;
    transform: scale(0.7);
  }
}

.fade-leave-active {
  animation: bounceOut 0.3s;
}

.fade-enter-active,
.fade-enter-to{
  animation: bounceIn 0.3s;
}
</style>
