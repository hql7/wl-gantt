import Vue from 'vue'
import { Table, TableColumn, DatePicker,Message } from 'element-ui'

Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)
Vue.prototype.$message = Message;