<template>
  <transition name="fade">
    <div class="layui-layer-tips layui-edit-face" v-show="isShow" ref="wrapper">
      <div class="layui-layer-content">
        <ul class="layui-clear">
          <li v-for="(value, key) in lists" :key="'face' + key" @click="handleFaceClick(key)">
            <img :src="value" :alt="key">
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
import faces from '@/assets/js/face.js'
export default {
  name: 'Face',
  props: ['isShow', 'ctrl'],
  data () {
    return {
      lists: faces,
      
    }
  },
  methods: {
    handleFaceClick(item){
      this.$emit('addEvent', item)
      this.$emit('closeEvent')
    }
  },
  
}

</script>

<style lang="scss" scoped>
.layui-edit-face{
  position: absolute;
  z-index: 10;
  top: 40px;
}
</style>
