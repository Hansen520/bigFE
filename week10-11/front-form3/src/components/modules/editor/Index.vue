<template>
  <div class="edit-wrap">
    <div class="layui-form-item layui-form-text">
      <div class="layui-input-block">
        <div class="layui-unselect fly-edit" ref="icons">
          <!-- 表情 -->
          <span v-for="(item, key) of closeItem" :key="'item' + key" @click="close(item.status)">
            <i class="iconfont" :class="item.icon"></i>
          </span>
          <span @click="addHr()">hr</span>
          <div ref="modal">
            <face :isShow="current === 1" @closeEvent="closeModel()" @addEvent="addFace"></face>
            <img-upload :isShow="current === 2" @closeEvent="closeModel()" @addEvent="addPic"></img-upload>
            <link-add :isShow="current === 3" @closeEvent="closeModel()" @addEvent="addLink"></link-add>
            <quote :isShow="current === 4" @closeEvent="closeModel()" @addEvent="addQuote"></quote>
            <code-input :isShow="current === 5" :width="codeWidth"  :height="addCode" @closeEvent="closeModel()" @addEvent="addFace"></code-input>
            <preview :isShow="current === 6" :content="content" @closeEvent="closeModel()"></preview>
          </div>
         
        </div>
         <textarea
            id="edit"
            @focus="focusEvent()"
            @blur="blurEvent()"
            class="layui-textarea fly-editor"
            name="content"
            ref="textEdit"
            v-model="content"
          ></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import Face from './Face'
import ImgUpload from './ImgUpload'
import LinkAdd from './LinkAdd'
import Quote from './Quote'
import CodeInput from './Code'
import Preview from './Preview'
export default {
  name: 'Editor',
  props: ['initContent'],
  components: {
    Face,
    ImgUpload,
    LinkAdd,
    Quote,
    CodeInput,
    Preview
  },
  data () {
    return {
      current: '', 
      codeWidth: 500,
      codeHeight: 200,
      content: '',
      pos: '',
      closeItem: [
        // 笑脸框
        {
          status: 1,
          icon: 'icon-yxj-expression'
        },
        // 插入图片框
        {
          status: 2,
          icon: 'icon-tupian'
        },
        // 链接框
        {
          status: 3,
          icon: 'icon-lianjie'
        },
        // 引用框
        {
          status: 4,
          icon: 'icon-yinhao'
        },
        // 代码框
        {
          status: 5,
          icon: 'icon-emwdaima'
        },
        // 预览框
        {
          status: 6,
          icon: 'icon-yulan1'
        },
      ],
    }
  },
  watch: {
    // 当用户离开后还是重新回到当前界面还是继续可以编辑content内容的
    initContent(newval, oldval){
      this.content = newval
    }
  },
  updated () {
    this.$emit('changeContent', this.content)
  },
  methods: {
    handleBodyClick (e) {
      e.stopPropagation()
      // 触发隐藏本组件的关闭事件，改变isShow, 就是点击每个小图标的时候
      // 判断是否点击到了非控制ICON以外的地方
      console.log(this.$refs.icons.contains(e.target))
      if (!(this.$refs.icons.contains(e.target) || this.$refs.modal.contains(e.target))) {
        this.closeModel()
      }
    },
    // 关闭模态框
    closeModel() {
      this.current = ''
    },
    // 关闭弹窗
    close(key){
      this.current = key
    },
    // 获取焦点
    focusEvent() {
      this.getPos()
    },
    // 失去焦点
    blurEvent() {
      this.getPos()
    },
    // 计算光标的当前位置
    getPos () {
      let cursorPos = 0
      let elem = document.getElementById('edit')
      if(document.selection){
        // 兼容IE
        let selectRange = document.selection.createRange()
        selectRange.moveStart('character', -elem.value.length)
        cursorPos = selectRange.text.length
      } else if(elem.selectionStart || elem.selectionStart === '0'){
        // 兼容普通浏览器
        cursorPos = elem.selectionStart
      }
      this.pos = cursorPos
    },
    // 添加表情 item为子组件传来的参数
    addFace(item){
      const insertContent = ` face${item}`
      this.insert(insertContent)
      this.pos += insertContent.length
    },
    // 添加链接
    addLink(item){
      const insertContent = ` a(${item})[${item}]`
      this.insert(insertContent)
      this.pos += insertContent.length
    },
    // 添加代码
    addCode (item) {
      const insertContent = ` \n[pre]\n${item}\n[/pre]`
      this.insert(insertContent)
      this.pos += insertContent.length
    },
    // 添加图片链接
    addPic (item) {
      const insertContent = ` img[${item}]`
      this.insert(insertContent)
      this.pos += insertContent.length
    },
    // 添加引用
    addQuote (item) {
      const insertContent = ` \n[quote]\n${item}\n[/quote]`
      this.insert(insertContent)
      this.pos += insertContent.length
    },
    // 添加hr
    addHr () {
      this.insert('\n[hr]')
      this.pos += 5
    },
    // 插入内容进areatext
    insert(val){
      if(typeof this.content === 'undefined'){
        return
      }
      let tmp = this.content.split('')
      tmp.splice(this.pos, 0, val)
      this.content = tmp.join('')
    }
  },
  mounted () {
    // nextTick之后dom才可以被读取
    this.$nextTick(() => {
      document.querySelector('body').addEventListener('click', this.handleBodyClick)
    })
  },
  beforeDestroy () {
    document.querySelector('body').removeEventListener('click', this.handleBodyClick)
  }
}
</script>

<style lang="scss">
.fly-editor {
  height: 260px;
}
.quote {
  font-size: 22px;
  vertical-align: middle;
  position: relative;
  top: 4px;
}
.edit-wrap {
  position: relative;
}
.edit-content {
  position: absolute;
  top: 45px;
  left: 0;
  z-index: 100;
  background: #fff;
}
.icon-emwdaima {
  position: relative;
  top: 2px;
}
.layui-layer-prompt {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}
</style>
