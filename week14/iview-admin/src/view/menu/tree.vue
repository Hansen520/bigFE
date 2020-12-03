<template>
  <div>
    <i-card :dis-hover="true" :shadow="true">
      <i-row type="flex" align="middle" justify="center">
        <ButtonGroup class="imooc-btn-group">
          <Button :size="size" :disabled="isEdit">
            <Dropdown @on-click="treeAddMenu">
              <a href="javascript:void(0)">
                <Icon type="md-add"></Icon>
                <span class="imooc-dropdown">新增</span>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name="bro">兄弟节点</DropdownItem>
                <DropdownItem name="child" :disabled="menuData.length === 0"
                  >孩子节点
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Button>
          <Button
            :size="size"
            icon="ios-create"
            type="primary"
            @click="treeEditMenu"
            :disabled="isEdit"
            >修改
          </Button>
          <Button
            :size="size"
            icon="md-trash"
            type="error"
            @click="treeDeleteMenu"
            :disabled="isEdit"
            >删除
          </Button>
        </ButtonGroup>
      </i-row>
      <Tree
        :data="menuData"
        ref="tree"
        @on-select-change="handleTreeChange"
        :disabled="isEdit"
      ></Tree>
    </i-card>
  </div>
</template>

<script>
export default {
  name: 'menu-tree',
  props: {
    size: {
      type: String,
      default: 'small'
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    menuData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    // 添加菜单，name为bro或child
    treeAddMenu(name) {
      this.$emit('addMenu', name)
    },
    // 编辑菜单
    treeEditMenu() {
      this.$emit('editMenu')
    },
    // 删除菜单
    treeDeleteMenu() {
      this.$emit('deleteMenu')
    },
    // 当前已选中的节点数组、当前项
    handleTreeChange(item) {
      // console.log(item)
      this.$emit('handleTreeChange', item)
    }
  }
}
</script>

<style lang="scss">
@media screen and (max-width: 1200px) {
  .imooc-btn-group {
    .ivu-btn:not(:nth-child(1)) {
      span {
        display: none;
      }
    }
    .imooc-dropdown {
      display: none;
    }
  }
}

.imooc-btn-group {
  .ivu-btn {
    span {
      margin-left: 0;
    }
  }
}

.imooc-page.ivu-col {
  position: static;
}

.ivu-btn-group:not(.ivu-btn-group-vertical)
  .ivu-btn-primary:not(:first-child):not(:last-child) {
  border-color: #dcdee2;
}
</style>
