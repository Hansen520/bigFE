<template>
  <div class="wrapper">
    <template v-if="item.type==='radio'">
      <RadioGroup @on-change="handleChange" :value="inputValue">
        <Radio :label="obj.value" v-for="(obj,index) in finalRadio" :key="'search-radio-'+index">
          <span>{{obj.key}}</span>
        </Radio>
      </RadioGroup>
    </template>
    <template v-else-if="item.type === 'date'">
      <DatePicker
        @on-change="handleChange"
        :value="inputValue"
        type="daterange"
        placement="bottom-end"
        placeholder="请选择时间段"
        style="width: 200px"
      >
      </DatePicker>
    </template>
    <template v-else-if="item.type === 'select'">
      <Select
        @on-change="handleChange"
        :value="inputValue"
        v-model="selection"
        multiple
        style="width:260px"
      >
        <Option v-for="obj in item.options" :value="obj.value" :key="obj.value">{{ obj.key }}</Option>
      </Select>
    </template>
    <!-- 最后一种为通用情况，即item.type === 'input' -->
    <template v-else>
      <Input
        @on-change="handleChange"
        :value="inputValue"
        clearable
        placeholder="输入关键字搜索"
        class="search-input"
        v-model="searchValue"
      />
    </template>
    <!-- 后面还可以继续添加相应的类型 -->
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    value: {
      type: [String, Array, Number],
      default: ''
    }
  },
  data () {
    return {
      searchValue: '',
      selection: [],
      // 默认的
      radiosOptions: [
        {
          key: '全部',
          value: ''
        },
        {
          key: '否',
          value: '0'
        },
        {
          key: '是',
          value: '1'
        }
      ]
    }
  },
  computed: {
    // 多思考下呆会儿
    finalRadio () {
      let result = {}
      if (this.item.type === 'radio') {
        if (this.item.options) {
          result = this.item.options
        } else {
          result = this.radiosOptions
        }
        return result
      }
    },
    inputValue () {
      return this.value
    }
  },
  methods: {
    handleChange (value) {
      console.log(value)
      this.$emit('changeEvent', value)
    }
  }
}

</script>

<style lang="scss" scoped>
.wrapper {
  display: inline-block;
  margin: 0 10px;
}
</style>
