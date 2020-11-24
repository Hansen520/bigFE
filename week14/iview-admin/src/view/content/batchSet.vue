<template>
  <div>
    <Modal v-model="showStatus" title="批量设置" @on-ok="ok" @on-cancel="cancel">
      <Form :model="localItem" :label-width="80" ref="table">
        <FormItem label="分类">
          <Select v-model="localItem.catalog">
            <Option
              v-for="(item,index) in catalog"
              :value="item"
              :key="'editTypes-' + index"
            >{{ item }}</Option>
          </Select>
        </FormItem>
        <FormItem label="标签">
          <Select v-model="localItem.tags" multiple>
            <Option
              v-for="(item,index) in tags"
              :value="item"
              :key="'editTags-' + index"
            >{{ item }}</Option>
          </Select>
        </FormItem>
        <FormItem label="是否结束">
          <RadioGroup v-model="localItem.isEnd">
            <Radio label>不设置</Radio>
            <Radio label="0">否</Radio>
            <Radio label="1">是</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="关闭评论">
          <RadioGroup v-model="localItem.iscomment">
            <Radio label>不设置</Radio>
            <Radio label="0">打开回复</Radio>
            <Radio label="1">关闭回复</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否置顶">
          <RadioGroup v-model="localItem.isTop">
            <Radio label>不设置</Radio>
            <Radio label="0">否</Radio>
            <Radio label="1">是</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isShow () {
      this.showStatus = this.isShow
    }
  },
  data () {
    return {
      showStatus: false,
      catalog: ['提问', '建议'],
      tags: ['wa', '哈哈', '你好'],
      localItem: {
        catalog: [],
        tags: [],
        status: '',
        isTop: '',
        isEnd: ''
      }
    }
  },
  methods: {
    ok () {
      // this.$refs.table.resetFields()
      this.$emit('changeEvent', false)
      const result = {}
      for (var key of Object.keys(this.localItem)) {
        if (this.localItem[key] !== '') {
          // 按照步骤赋值
          result[key] = this.localItem[key]
        }
      }
      this.$emit('editEvent', result)
      this.$Message.info('设置成功！')
    },
    cancel () {
      this.$refs.table.resetFields()
      this.$emit('changeEvent', false)
      this.$Message.info('取消设置！')
    }
  }
}
</script>
