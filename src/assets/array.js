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
  Array.from(data).forEach(function (record) {
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

/**
 * 筛选出数组中最大值
 * @param {*} arr 数据
 * @param {*} key 如果是复杂型数组，请指定字段key
 * @param {*} stamp 如果是时间格式，请设置以转化时间戳
 */
function getMax(arr = [], key = null, stamp = false) {
  let _o = !key ? arr : arr.map(i => i[key]);
  let _t = !stamp ? _o : _o.map(i => dayjs(i).valueOf());
  return Math.max(..._t);
}

/**
 * 筛选出数组中最小值
 * @param {*} arr 数据
 * @param {*} key 如果是复杂型数组，请指定字段key
 * @param {*} stamp 如果是时间格式，请设置以转化时间戳
 */
function getMin(arr = [], key = null, stamp = false) {
  let _o = !key ? arr : arr.map(i => i[key]);
  let _t = !stamp ? _o : _o.map(i => dayjs(i).valueOf());
  return Math.min(..._t);
}

function deepChangeObject(data) {
  let tmp = [];
  Array.from(data).forEach(function (record) {
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

export {
  treeToArray, // 
  flattenDeep, // 将树转化为一维数组
  deepClone, // 深拷贝
  getMax, // 获取最大值
  getMin, // 获取最小值
}