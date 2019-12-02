import Vue from 'vue'
import { Table, TableColumn, DatePicker,Message,Popover } from 'element-ui'

Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)
Vue.use(Popover)
Vue.prototype.$message = Message;