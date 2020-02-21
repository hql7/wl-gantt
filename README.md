# wl-gantt

# 简介
  甘特图（Gantt chart）又称为横道图、条状图(Bar chart)、生产计划进度图。其通过条状图来显示项目，进度，和其他时间相关的系统进展的内在关系随着时间进展的情况。以提出者亨利·劳伦斯·甘特（Henry Laurence Gantt）先生的名字命名。  
  目前市面上最有名的几个gantt插件占据江湖了非常久远的时间，它们古老又强大。 
  但无一例外的是：它们收费或极其难用并且依赖非常古老的技术，其中有些技术现在入行的新手甚至从未听闻。  
 【jQueryGantt】【plusgantt】【dhtmlx】  不可否认它们都非常的强大，不管是从性能还是功能性。但是大多的业务需求并不需要如此庞然大物才能满足需求。 另一方面古老的技术稀缺的文档又让开发者无从下手（收费版甚至不提供文档，而你的老板又肯定不会提供钱买下授权）。  
 `wl-gantt`出现的背景就是笔者在公司的Vue项目中使用B***Gantt插件所受到的巨大伤害：基于extjs（对于17年入行的我来说没听过）、不提供开发文档、没有中文资料、源码加密，开发全靠打印实例找属性。 `wl-gantt`是一个基于Vue及elementUi的gantt甘特图插件，是一个896的码奴在仅有的剩余的1中挤时间开发而成。   
  它目提供的功能有：自动检查源数据是否符合project任务安排规则、结束后开始的前置任务规则、yearAndmonth|yearAndWeek|ManthAndDay日期跨度地洞切换、内置前置任务管理器。     
  它的优点：非常简单易用，并且高度可配置，自动抹平不合格数据并给与提示，不会无缘无故产生异常。  
  它正在逐渐长大，下个阶段，它将学会：    
    1. yearAndMonth、monthAndDay、yearAndWeek时间跨度配置 【已完成，month及week格子起止位置待精确化】  
    2. 内置前置任务选择器 【已完成】  
    3. 整合树表全选联动功能 【已完成】  
    4. 添加、移除任务回调 【已完成】        
    4. 任务连接线   
    5. 任务自定义悬浮提示   
    6. 和所有你觉得需要用到的需求 

### [在线演示](https://hql7.github.io/) - [GitHub](https://github.com/hql7)

### wl-gantt 与市面应用较广的大佬型插件对比

> wl-gantt 外观简洁清爽，非常简单易用，高度可配置
  ![wl-gantt](https://wlsy.oss-cn-hangzhou.aliyuncs.com/wl-gantt.png?Expires=1576325132&OSSAccessKeyId=TMP.hj6HZTBBv18AYim1116sfYs2Fryvwdds6GLGUC3jnUJXXbU967q63s7hDRWE1ZpbFm18SVDbBihEFfxRnfAE2z2Gr2SrqqRLTSeZ5cYs4nXWuSKo6Mv7v6SHfE8aU5.tmp&Signature=bc0tl%2BKboG%2FgYaVJ%2BXuD3BIF1lI%3D)
  
> jquery Gantt 笨重、老旧、较丑但文档还算清晰
  ![jquery Gantt](https://wlsy.oss-cn-hangzhou.aliyuncs.com/jq-gantt.png?Expires=1576325361&OSSAccessKeyId=TMP.hj6HZTBBv18AYim1116sfYs2Fryvwdds6GLGUC3jnUJXXbU967q63s7hDRWE1ZpbFm18SVDbBihEFfxRnfAE2z2Gr2SrqqRLTSeZ5cYs4nXWuSKo6Mv7v6SHfE8aU5.tmp&Signature=oKqyBzbICfik8TEEX9E2ddDwguQ%3D)

> js gantt 不想多说了
  ![js gantt](https://wlsy.oss-cn-hangzhou.aliyuncs.com/js-gantt.png?Expires=1576325512&OSSAccessKeyId=TMP.hj6HZTBBv18AYim1116sfYs2Fryvwdds6GLGUC3jnUJXXbU967q63s7hDRWE1ZpbFm18SVDbBihEFfxRnfAE2z2Gr2SrqqRLTSeZ5cYs4nXWuSKo6Mv7v6SHfE8aU5.tmp&Signature=yeFQ8%2Bn8gpnyFMZ4Eaj5McLtebg%3D)

> dhtmlxGantt 功能强大、全面；但是使用难度高，不切合现代框架及ui库，很难在项目中完美应用
  ![dhtmlxGantt](https://wlsy.oss-cn-hangzhou.aliyuncs.com/dhtmlxGantt.png?Expires=1576325689&OSSAccessKeyId=TMP.hj6HZTBBv18AYim1116sfYs2Fryvwdds6GLGUC3jnUJXXbU967q63s7hDRWE1ZpbFm18SVDbBihEFfxRnfAE2z2Gr2SrqqRLTSeZ5cYs4nXWuSKo6Mv7v6SHfE8aU5.tmp&Signature=P8JP1UWDwISboj85lTlluzTk6ks%3D)

> frappe-gantt 功能好少
  ![frappe](https://wlsy.oss-cn-hangzhou.aliyuncs.com/frappe.png?Expires=1576326005&OSSAccessKeyId=TMP.hj6HZTBBv18AYim1116sfYs2Fryvwdds6GLGUC3jnUJXXbU967q63s7hDRWE1ZpbFm18SVDbBihEFfxRnfAE2z2Gr2SrqqRLTSeZ5cYs4nXWuSKo6Mv7v6SHfE8aU5.tmp&Signature=GH2aSHTVl2gKk0CNPZomZLb5yqo%3D)

> bryntum 唯一较美观的，但是可配置性差，无法和组件结合;不校验源数据正确性就报错、崩溃;规则死板不符合项目使用；收费年950$; 功能强大但文档只有简单介绍。  
  ![bryntum](https://wlsy.oss-cn-hangzhou.aliyuncs.com/bryntum.png?Expires=1576326783&OSSAccessKeyId=TMP.hj6HZTBBv18AYim1116sfYs2Fryvwdds6GLGUC3jnUJXXbU967q63s7hDRWE1ZpbFm18SVDbBihEFfxRnfAE2z2Gr2SrqqRLTSeZ5cYs4nXWuSKo6Mv7v6SHfE8aU5.tmp&Signature=gQk2kyuTwU0zoEVwOOeFlqje3E0%3D)

### 更新说明

  > 2020-02-20 更新gantt，详见版本说明1.0.1
  > 2019-12-14 更新gantt，增加内置前置任务列，支持多选前置和单选前置，并自动校验源数据前置任务合法性。
  > 2019-12-3 更新gantt。1表格支持[el-table](https://element.eleme.cn/#/zh-CN/component/table)大部分`Attributes`和`Events`,详细列表见下方；2名称列增加`nameFormatter`格式化内容函数支持；3日期列改为点击显示编辑输入框的形式。  
  > 2019-12-2 更新gantt.1日期支持` yearAndMonth、monthAndDay、yearAndWeek`类型，详见`版本记录1`；2修复部分时间更改情况不回调的问题。


#### 已支持el-table参数及事件列表
```
    :fit="fit"
    :size="size"
    :border="border"
    :data="selfData"
    :stripe="stripe"
    :height="height"
    :row-key="rowKey"
    :row-style="rowStyle"
    :class="dateTypeClass"
    :cell-style="cellStyle"
    :max-height="maxHeight"
    :tree-props="selfProps"
    :current-row-key="rowKey"
    :row-class-name="rowClassName"
    :cell-class-name="cellClassName"
    :expand-row-keys="expandRowKeys"
    :header-row-style="headerRowStyle"
    :header-cell-style="headerCellStyle"
    :default-expand-all="defaultExpandAll"
    :header-row-class-name="headerRowClassName"
    :highlight-current-row="highlightCurrentRow"
    :header-cell-class-name="headerCellClassName"
    @header-contextmenu="handleHeaderContextMenu"
    @selection-change="handleSelectionChange"
    @row-contextmenu="handleRowContextMenu"
    @current-change="handleCurrentChange"
    @cell-mouse-enter="handleMouseEnter"
    @cell-mouse-leave="handleMouseLeave"
    @expand-change="handleExpandChange"
    @filter-change="handleFilterChange"
    @cell-dblclick="handleCellDbClick"
    @header-click="handleHeaderClick"
    @row-dblclick="handleRowDbClick"
    @sort-change="handleSortChange"
    @cell-click="handleCellClick"
    @select-all="handleSelectAll"
    @row-click="handleRowClick"
    @select="handleSelect"
```

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
  | 8 | autoGanttDateType | 自动调整gantt时间跨度类型，具体规则见`版本记录1` | Boolean | - | true | - |
  | 9 | nameFormatter | 名称列格式化内容函数 | Function | - | - | Function(row, column, cellValue, index) |
  | 10 | 其他Table Attributes | [文档地址](https://element.eleme.cn/#/zh-CN/component/table) | - | - | - | - |
  | 11 | usePreColumn | 是否使用内置前置任务列 | Boolean | - | false | - |
  | 12 | preMultiple | 前置任务是否可以多选 | Boolean | - | true | 如果开启多选则pre字段必须是Array，否则可以是Number\String | 
  | 13 | preFormatter | 前置内容列格式化函数 | Function | - | - | 如不传则根据`prop name字段+，`拼接 | 
  | 14 | emptyCellText | 空值单元格占位符 | String | - | '-' | - | 
  | 15 | useCheckColumn | 是否使用内置复选框列 | Boolean | - | false | - |
  | 16 | useIndexColumn | 是否使用内置序号列 | Boolean | - | false | - | 
  | 17 | edit | 是否可编辑 | Boolean | - | true | - |
  | 18 | parentChild | 使用复选框时，是否父子关联 | Boolean | - | true | 必须配置props的id、children字段 |

### props
| 序号 | 参数 | 说明 | 默认值 |
| ---- | ---- | ---- | ---- |
| 1 | children | 数据的子集children字段,表示为树表 | children |
| 2 | name | 用于显示名字的字段 | name |
| 3 | id | 每条数据的id，必须唯一 | id |
| 4 | pid | 每条数据的父节点id字段 | pid |
| 5 | startDate | 每条数据的开始时间字段 | startDate |
| 6 | endDate | 每条数据的结束时间字段| endDate |
| 7 | identityId | 数据自增id | identityId |
| 8 | parents | 自增父级id树，逗号分隔 | parents |
| 9 | pre | 前置任务字段，字段值应是前置任务的id | pre |
| 10 | hasChildren | 指定哪些行是包含子节点 | hasChildren |

### Events
  | 序号 | 事件名 | 说明 | 回调参数 |
  | ---- | ---- | ---- | ---- |
  | 1 | timeChange | 当任务时间发生更改时触发 | function(row) 依次为当前行数据 |
  | 2 | 其他Table Events | [文档地址](https://element.eleme.cn/#/zh-CN/component/table) | - | - |
  | 3 | preChange | 前置任务修改事件 | function(row) 依次为当前行数据 |
  | 4 | nameChange | 名称修改事件 |  function(row) 依次为当前行数据 |
  | 5 | taskAdd | 添加任务事件 |  function(row) 依次为当前行数据 |
  | 6 | taskRemove | 删除任务事件 |  function(row) 依次为当前行数据 |

### slot
  | 序号 | 名字 | 说明 |
  | ---- | ---- | ---- |
  | 1 | prv | 用于插入列表中名称前的列，如不生效需加`fixed` |
  | 2 | - | 插入在默认列及甘特图之间的列 |

### 版本记录

> 4. 1.0.1版本 增加内置复选框列、序号列；增加是否可编辑参数；修改内置前置任务列配置参数值为false；增加复选框的父子联动属性；增加名称列可编辑逻辑；增加添加、移除任务事件；

> 3. 1.0.0版本 增加内置前置任务列，支持多选前置和单选前置，并自动校验源数据前置任务合法性。

> 2. 0.1.6版本 更新gantt。1表格支持[el-table](https://element.eleme.cn/#/zh-CN/component/table)大部分`Attributes`和`Events`；2名称列增加`nameFormatter`格式化内容函数支持；3日期列改为点击显示编辑输入框的形式。注意树表时`rowKey`参数必须传，默认为`id`。

> 1. 0.1.5版本 更新gantt日期支持` yearAndMonth、monthAndDay、yearAndWeek`类型，并自动调整，规则为：大于12个月的自动调整为`yearAndMonth`,3个月到12个月之间的，自动调整为`yearAndWeek`, 2个月及以内的自动调整为`monthAndDay`。新增参数`autoGanttDateType`可以管理是否自动调整，如果要关闭自动调整请保证时间跨度尽可能的少，否则会有明显的性能问题。修复部分时间更改情况不回调的问题。