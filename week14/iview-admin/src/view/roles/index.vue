<template>
  <div>
    <Row :gutter="10">
      <Col span="6" :sm="24" :md="9" :lg="6">
        <Card :dis-hover="true" :shadow="true">
          <Tree :data="data1"></Tree>
        </Card>
      </Col>
      <Col span="18" :sm="24" :md="15" :lg="18">
        <Card
          :title="$t('Menu Options')"
          icon="ios-options"
          :dis-hover="true"
          :shadow="true"
          style="margin-bottom: 10px"
        >
          <Form
            ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="80"
          >
            <FormItem label="Name" prop="name">
              <Input
                v-model="formValidate.name"
                placeholder="Enter your name"
              ></Input>
            </FormItem>
            <FormItem label="E-mail" prop="mail">
              <Input
                v-model="formValidate.mail"
                placeholder="Enter your e-mail"
              ></Input>
            </FormItem>
            <FormItem label="City" prop="city">
              <Select
                v-model="formValidate.city"
                placeholder="Select your city"
              >
                <Option value="beijing">New York</Option>
                <Option value="shanghai">London</Option>
                <Option value="shenzhen">Sydney</Option>
              </Select>
            </FormItem>
            <FormItem label="Date">
              <Row>
                <Col span="11">
                  <FormItem prop="date">
                    <DatePicker
                      type="date"
                      placeholder="Select date"
                      v-model="formValidate.date"
                    ></DatePicker>
                  </FormItem>
                </Col>
                <Col span="2" style="text-align: center">-</Col>
                <Col span="11">
                  <FormItem prop="time">
                    <TimePicker
                      type="time"
                      placeholder="Select time"
                      v-model="formValidate.time"
                    ></TimePicker>
                  </FormItem>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="Gender" prop="gender">
              <RadioGroup v-model="formValidate.gender">
                <Radio label="male">Male</Radio>
                <Radio label="female">Female</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="Hobby" prop="interest">
              <CheckboxGroup v-model="formValidate.interest">
                <Checkbox label="Eat"></Checkbox>
                <Checkbox label="Sleep"></Checkbox>
                <Checkbox label="Run"></Checkbox>
                <Checkbox label="Movie"></Checkbox>
              </CheckboxGroup>
            </FormItem>
            <FormItem label="Desc" prop="desc">
              <Input
                v-model="formValidate.desc"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 5 }"
                placeholder="Enter something..."
              ></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="handleSubmit('formValidate')"
                >Submit</Button
              >
              <Button
                @click="handleReset('formValidate')"
                style="margin-left: 8px"
                >Reset</Button
              >
            </FormItem>
          </Form>
        </Card>
        <Card :title="$t('resources')" :dis-hover="true" :shadow="true">
          <Table
            border
            ref="selection"
            :columns="columns4"
            :data="data2"
          ></Table>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data1: [
        {
          title: 'parent 1',
          expand: true,
          children: [
            {
              title: 'parent 1-1',
              expand: true,
              children: [
                {
                  title: 'leaf 1-1-1'
                },
                {
                  title: 'leaf 1-1-2'
                }
              ]
            },
            {
              title: 'parent 1-2',
              expand: true,
              children: [
                {
                  title: 'leaf 1-2-1'
                },
                {
                  title: 'leaf 1-2-1'
                }
              ]
            }
          ]
        }
      ],
      formValidate: {
        name: '',
        mail: '',
        city: '',
        gender: '',
        interest: [],
        date: '',
        time: '',
        desc: ''
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: 'The name cannot be empty',
            trigger: 'blur'
          }
        ],
        mail: [
          {
            required: true,
            message: 'Mailbox cannot be empty',
            trigger: 'blur'
          },
          { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
        ],
        city: [
          {
            required: true,
            message: 'Please select the city',
            trigger: 'change'
          }
        ],
        gender: [
          { required: true, message: 'Please select gender', trigger: 'change' }
        ],
        interest: [
          {
            required: true,
            type: 'array',
            min: 1,
            message: 'Choose at least one hobby',
            trigger: 'change'
          },
          {
            type: 'array',
            max: 2,
            message: 'Choose two hobbies at best',
            trigger: 'change'
          }
        ],
        date: [
          {
            required: true,
            type: 'date',
            message: 'Please select the date',
            trigger: 'change'
          }
        ],
        time: [
          {
            required: true,
            type: 'string',
            message: 'Please select time',
            trigger: 'change'
          }
        ],
        desc: [
          {
            required: true,
            message: 'Please enter a personal introduction',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 20,
            message: 'Introduce no less than 20 words',
            trigger: 'blur'
          }
        ]
      },
      columns4: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Age',
          key: 'age'
        },
        {
          title: 'Address',
          key: 'address'
        }
      ],
      data2: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          date: '2016-10-04'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped></style>
