import Vue from 'vue'
import { Table, TableColumn, DatePicker,Message,Popover, Select } from 'element-ui'

Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)
Vue.use(Popover)
Vue.use(Select)
Vue.prototype.$message = Message;