/**
 * @Author: jianglei
 * @Date:   2017-10-12 12:06:49
 */
"use strict";
import Vue from "vue";
import dayjs from 'dayjs' // 导入日期js

/**
 * tree to array
 * @param {*} data 
 * @param {*} children 
 * @param {*} parent 
 * @param {*} level 
 */
function treeToArray(
  data,
  children,
  parent = null,
  level = null
) {
  let tmp = [];
  Array.from(data).forEach(function(record) {
    let _level = 1;
    if (level !== undefined && level !== null) {
      _level = level + 1;
    }
    Vue.set(record, "_level", _level);
    let _parents = parent ? parent._parents + record.id : record.id;
    Vue.set(record, "_parents", _parents);

    Vue.set(record, "_level", _level);
    if (record.startDate && record.endDate) {
      let days = dayjs(record.endDate).diff(dayjs(record.startDate), 'day');
      Vue.set(record, "_duration", days);
    }
    if (record.startDate) {
      Vue.set(record, "_old_startDate", record.startDate);
    }
    if (record.endDate) {
      Vue.set(record, "_old_endDate", record.endDate);
    }
    // 如果有父元素
    if (parent) {
      Vue.set(record, "_parent", parent);
    }
    tmp.push(record);
    if (record[children] && record[children].length > 0) {
      const childs = treeToArray(record[children], children, record, _level);
      // tmp = tmp.concat(childs);
    }
  });
  return tmp;
}

/**
 * 将树形数据向下递归为一维数组
 * @param {*} arr 数据源
 * @param {*} childs  子集key
 */
function flattenDeep(arr = [], childs = "Children") {
  return arr.reduce((flat, item) => {
    return flat.concat(
      item,
      item[childs] ? flattenDeep(item[childs], childs) : []
    );
  }, []);
}

/**
 * 深拷贝
 * @param {*} source 要拷贝的数据
 */
function deepClone(source) {
  if (!source && typeof source !== "object") {
    throw new Error("error arguments", "shallowClone");
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === "object") {
      targetObj[keys] = source[keys].constructor === Array ? [] : {};
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

let data = [{
    path: '/timeline',
    name: 'dashboard',
    component: 'Main',
    children: [{
      path: 'timeline',
      name: 'timeline',
      meta: {
        icon: 'ios-clock-outline',
        title: '时间轴'
      },
      component: ''
    }]
  },
  {
    path: '/permission',
    name: 'roles',
    component: 'Main',
    children: [{
      path: 'permission',
      name: 'permission',
      meta: {
        icon: 'ios-lock',
        title: '权限'
      },
      component: ''
    }]
  },
  {
    path: '/doc',
    name: 'doc',
    meta: {
      icon: 'md-menu',
      title: '文档'
    },
    children: [{
        path: 'doc',
        name: 'doc',
        meta: {
          icon: 'md-funnel',
          title: '官方文档',
          href: 'https://lison16.github.io/iview-admin-doc/#/'
        }
      },
      {
        path: 'role-doc',
        name: 'role-doc',
        meta: {
          icon: 'md-funnel',
          title: '权限文档',
          href: 'https://www.jianshu.com/p/ece6fa64e8ad'
        }
      }
    ]
  }
]


function deepChangeObject(data) {
  let tmp = [];
  Array.from(data).forEach(function(record) {
    Vue.set(record, "_level", _level);
    Vue.set(record, "_parents", _parents);

    Vue.set(record, "_level", _level);
    if (record.startDate && record.endDate) {
      let days = dayjs(record.endDate).diff(dayjs(record.startDate), 'day');
      Vue.set(record, "_duration", days);
    }
    if (record.startDate) {
      Vue.set(record, "_old_startDate", record.startDate);
    }
    if (record.endDate) {
      Vue.set(record, "_old_endDate", record.endDate);
    }
    // 如果有父元素
    if (parent) {
      Vue.set(record, "_parent", parent);
    }
    tmp.push(record);
    if (record[children] && record[children].length > 0) {
      deepChangeObject(record[children], children, record, _level);
    }
  });
  return tmp;
}

/* class DeepChangeObject {
  constructor(val) {
    this.data = val;
    this.new_data = [];
    this.id = 0;
  }

  changeData(arr = this.data) {
    this.id + 1;
    arr.forEach(item => {
      if (item.meta) {
        let _item = {
          id: this.id,
          pid: 
          title: item.meta.title,
          children: item.children || []
        }
        if (children > 0) {
          this.changeData(children)
        }
      } else {
        let [_first_child] = item.children;
        let _item = { title: _first_child.meta.title }
      }
      this.new_data.push(_item);
    })
  }
} */

export {
  treeToArray,
  flattenDeep,
  deepClone
}