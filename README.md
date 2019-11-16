# wl-gantt

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

#简介
  这是一个基于elementUi的el-table组件的gantt甘特图插件
  [el-table](https://element.eleme.cn/#/zh-CN/component/table)

## [在线演示](https://hql7.github.io/)

## 快速上手

`npm i wl-gantt --save`

或

`npm i wl-gantt -S`

`import wlGantt from 'wl-gantt'`

`Vue.use(wlGantt)`

## 文档

  | 序号 | 参数 | 说明 | 类型 | 可选值 | 默认值 |
  | ---- | ---- | ---- | ---- | ---- | ---- |
  | 1 | data | 数据 | Array | - | [] |
  | 2 | dateType | gantt图区日期表头类型 | String | monthAndDay/yearAndMonth/yearAndDay | yearAndDay |
  | 3 | treeProps | 树表配置项 | Object | - | { hasChildren: 'hasChildren', children: 'children' } |
  | 4 | startDate | 项目开始时间 | String/Object | 必填 | - |
  | 5 | endDate | 项目结束时间 | String/Object | 必填 | - |
  | 6 | solt | 表格列支持solt自定义内容 | - | - | - |

## 事件

  | 序号 | 事件名 | 说明 | 参数 |
  | ---- | ---- | ---- | ---- |
  | 1 | row-change | 当前有默认了开始和结束时间列，更改时触发的change事件，返回当前行数据 | row |

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
