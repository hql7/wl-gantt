# wl-gantt

# 简介

  目前市面上最有名的几个gantt插件占据江湖了非常久远的时间，它们古老又强大。 

  但无一例外的是：它们收费或极其难用并且依赖非常古老的技术，其中有些技术现在入行的新手甚至从未听闻。  

  【jQueryGantt】【plusgantt】【dhtmlx】
  不可否认它们都非常的强大，不管是从性能还是功能性。但是大多的业务需求并不需要如此庞然大物才能满足需求。  
  另一方面古老的技术稀缺的文档又让开发者无从下手（收费版甚至不提供文档，而你的老板又肯定不会提供钱买下授权）。  

  `【wl-gantt】`出现的背景就是笔者在公司的Vue项目中使用B***Gantt插件所受到的巨大伤害：基于extjs（对于17年入行的我来说没听过）、不提供开发文档、没有中文资料、源码加密，开发全靠打印实例找属性。
  wl-gantt是一个基于Vue及elementUi的gantt甘特图插件，是一个896的码奴在仅有的剩余的1中挤时间开发而成。 
  它目前仅提供了很少的功能：自动检查源数据是否符合project任务安排规则，结束后开始的前置任务规则。yearAndmonth的gantt时间跨度。  
  但它绝对简单易用，并且高度可配置。
  它的实际年龄才只有3天，它正在我和所有热爱开源事业的朋友们手中逐渐长大。 
  下个阶段，它将学会：  
    1. yearAndMonth、monthAndDay、yearAndWeek时间跨度配置 
    2. 内置前置任务选择器 
    3. 任务连接线 
    4. 任务自定义悬浮提示 
    5. 和所有你觉得需要用到的需求 

## [在线演示](https://hql7.github.io/)
## [GitHub](https://github.com/hql7)

## 快速上手

`npm i wl-gantt --save`
或
`npm i wl-gantt -S`
`import wlGantt from 'wl-gantt'`
`import "wl-gantt/lib/wl-gantt.css"`
`Vue.use(wlGantt)`

## 文档
###  Attributes
  | 序号 | 参数 | 说明 | 类型 | 可选值 | 默认值 | 注意 |
  | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
  | 1 | data | 数据 | Array | - | [] | - |
  | 2 | dateType | gantt图区日期表头类型 | String | monthAndDay、yearAndMonth、yearAndDay | yearAndMonth | - |
  | 3 | treeProps | 树表配置项 | Object | - | - | 见下方props |
  | 4 | startDate | 项目开始时间 | String、Object | 必填 |-| 注意：不要求任务时间线在项目开始时间内，并且当任务时间超出项目时间时，将更新项目时间 |
  | 5 | endDate | 项目结束时间 | String、Object | 必填 | - | 注意：不要求任务时间线在项目开始时间内，并且当任务时间超出项目时间时，将更新项目时间 |
  | 6 | checkSource | 是否检查源数据符合规则 | Boolean | - | - | 检查源数据为自动修改不符合规范的时间为符合规则的期望值 |
  | 7 | treatIdAsIdentityId | 是否使用id来作为自增id | Boolean | - | false | 如果是请保证id本来就简短的数字型而不是较长的字符串或guid |
  | 8 | solt | 表格列支持solt自定义内容 | - | - | - | 在默认的名字、开始时间、结束时间列之后 |

### props
| 序号 | 参数 | 说明 | 默认值 |
| ---- | ---- | ---- | ---- |
| 1 | children | 数据的子集children字段 | children |
| 2 | name | 用于显示名字的字段 | name |
| 3 | id | 每条数据的id，必须唯一 | id |
| 4 | pid | 每条数据的父节点id字段 | pid |
| 5 | startDate | 每条数据的开始时间字段 | startDate |
| 6 | endDate | 每条数据的结束时间字段| endDate |
| 7 | identityId | 数据自增id | identityId |
| 8 | parents | 自增父级id树，逗号分隔 | parents |
| 9 | pre | 前置任务字段，字段值应是前置任务的id | pre|

### Events

  | 序号 | 事件名 | 说明 | 回调参数 |
  | ---- | ---- | ---- | ---- |
  | 1 | timeChange | 当任务时间发生更改时触发 | function(row) 依次为当前行数据 |

