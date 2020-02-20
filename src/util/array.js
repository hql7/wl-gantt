/**
 * auth: weilan
 * github: https://github.com/hql7
 * description: 一个数组操作函数库
 * date：2019-01-22
 */

"use strict";
import Vue from "vue";
import dayjs from 'dayjs' // 导入日期js

// 从树形数据中递归筛选目标值
function valInDeep(arr = [], val, id, childs) {
  return arr.reduce((flat, item) => {
    return flat.concat(item[id] == val ? item : valInDeep(item[childs] || [], val, id, childs));
  }, []);
}

// 将树形数据向上将此支线递归为一维数组
function flattenDeepParents(arr, parent) {
  return arr.reduce((flat, item) => {
    return flat.concat(item[parent] || [], item[parent] ? flattenDeepParents([item[parent]], parent) : []);
  }, []);
}

// 根据条件递归祖先元素
function regDeepParents(row, parent, cb) {
  if (row[parent]) {
    cb && cb(row[parent]);
    regDeepParents(row[parent], parent, cb);
  }
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
  flattenDeep, // 将树转化为一维数组
  deepClone, // 深拷贝
  getMax, // 获取最大值
  getMin, // 获取最小值
  valInDeep, // 递归查找
  flattenDeepParents, // 向上将树转化为数组
  regDeepParents // 根据条件查找父级树
}