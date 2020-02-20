import Vue from 'vue'
import { Table, TableColumn, DatePicker, Message, Popover, Select, Option, Form, FormItem, Input, Dialog, Button} from 'element-ui'

Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(DatePicker)
Vue.use(Popover)
Vue.use(Option)
Vue.use(Select)
Vue.use(Input)
Vue.use(Dialog)
Vue.use(Button)
Vue.prototype.$message = Message;