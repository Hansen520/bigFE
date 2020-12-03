<template>
  <div>
    <i-form
      :disabled="!isEdit"
      ref="form"
      :model="formData"
      :rules="formRules"
      :label-width="80"
    >
      <i-form-item label="菜单标题" prop="title">
        <i-input
          v-model="formData.title"
          placeholder="请您输入菜单名称"
        ></i-input>
      </i-form-item>
      <i-form-item label="路径" prop="path">
        <i-input v-model="formData.path" placeholder="请输入菜单路径"></i-input>
      </i-form-item>
      <i-form-item label="菜单类型">
        <Select v-model="formData.type" placeholder="请选择菜单类型">
          <Option value="menu">目录</Option>
          <Option value="resouce">资源</Option>
        </Select>
      </i-form-item>
      <i-form-item label="组件" prop="component">
        <i-input v-model="formData.component" placeholder="请输入前端组件名称">
          <span slot="prepend">()=>import('@/view</span>
          <span slot="append">.vue')</span>
        </i-input>
      </i-form-item>
      <i-form-item label="排序">
        <i-input v-model="formData.sort" placeholder="组件默认排序"></i-input>
      </i-form-item>
      <i-form-item label="面包屑">
        不显示
        <Switch v-model="formData.hideInbread" />
        显示
      </i-form-item>
      <i-form-item label="菜单显示">
        不显示
        <Switch v-model="formData.hideInMenu" />显示
      </i-form-item>
      <i-form-item label="页面缓存">
        是
        <!-- Method 1 -->
        <!-- <i-switch v-model="formData.notCache"></i-switch> -->
        <Switch v-model="formData.notCache" />
        否
      </i-form-item>
      <i-form-item label="图标">
        <i-input
          v-model="formData.icon"
          placeholder="请输入前端组件名称"
        ></i-input>
      </i-form-item>
      <i-form-item label="重定向">
        <i-input v-model="formData.redirect" placeholder="重定向组件"></i-input>
      </i-form-item>
      <i-form-item v-if="isEdit">
        <Button type="primary" @click="_submit()">确定</Button>
        <Button style="margin-left: 8px" @click="_cancel()">取消</Button>
      </i-form-item>
    </i-form>
  </div>
</template>

<script>
export default {
  name: 'menu-form',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    formItem: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formData: {
        title: '',
        path: '',
        // 组件
        component: '',
        // 是否隐藏面包屑
        hideInBread: false,
        // 是否隐藏菜单
        hideInMenu: false,
        // 是否使用缓存,
        notCache: false,
        icon: '',
        sort: 0,
        redirect: '',
        type: 'menu',
        operations: []
      },
      formRules: {
        title: [
          {
            required: true,
            message: '菜单名称不能为空',
            trigger: 'blur'
          }
        ],
        path: [
          {
            required: true,
            message: '路由路径不得为空',
            trigger: 'blur'
          }
        ],
        component: [
          {
            required: true,
            message: '前端组件不得为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    formItem(newval, oldval) {
      this.formData = newval
    }
  },
  methods: {
    _submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 验证通过后
          const data = {
            // 节点标题
            ...this.formData,
            // 全部展开
            expand: true
          }
          // 拿出来是为了防止属性被覆盖
          // data.title = this.formData.name
          this.$emit('submit', data)
        }
      })
      // 清空formData中的数据
      this.$refs.form.resetFields()
    },
    _cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style></style>
