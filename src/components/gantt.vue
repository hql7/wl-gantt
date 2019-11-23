<template>
  <el-table
    border
    row-key="id"
    ref="wl-gantt"
    class="wl-gantt"
    current-row-key="id"
    default-expand-all
    :data="selfData"
    :class="dateTypeClass"
    :tree-props="selfProps"
    header-row-class-name="wl-gantt-header"
    >
    <el-table-column :resizable="false" fixed :prop="selfProps.name" width="160" label="名称"></el-table-column>
    <el-table-column :resizable="false" fixed width="160" :prop="selfProps.startDate" label="开始日期">
      <template slot-scope="scope">
        <el-date-picker
          v-model="scope.row[selfProps.startDate]"
          @change="startDateChange(scope.row)"
          type="date"
          size="medium"
          class="u-full"
          :clearable="false"
          value-format="yyyy-MM-dd"
          placeholder="请选择开始日期"
        ></el-date-picker>
      </template>
    </el-table-column>
    <el-table-column fixed :resizable="false" width="160" :prop="selfProps.endDate" label="结束日期">
      <template slot-scope="scope">
        <el-date-picker
          v-model="scope.row[selfProps.endDate]"
          @change="endDateChange(scope.row, 'end')"
          type="date"
          size="medium"
          class="u-full"
          :clearable="false"
          value-format="yyyy-MM-dd"
          placeholder="请选择结束日期"
        ></el-date-picker>
      </template>
    </el-table-column>
    <slot></slot>
    <el-table-column :resizable="false" v-for="year in titleDate" :key="year.id" :label="year.name">
      <el-table-column
        class-name="wl-gantt-item"
        v-for="month in year.children"
        :resizable="false"
        :key="month.id"
        :label="month.name"
      >
        <template slot-scope="scope" v-if="dateType === 'yearAndMonth'">
          <div :class="dayGanttType(scope.row, month.full_date, 'months')"></div>
        </template>
        <!-- <el-table-column
          :resizable="false"
          class-name="wl-gantt-item"
          v-for="day in month.children"
          width="40"
          :key="day.id"
          :label="day.date">
            <template slot-scope="scope">
              <div :class="dayGanttType(scope.row, day.full_date)"></div>
            </template>
        </el-table-column>-->
      </el-table-column>
    </el-table-column>
  </el-table>
</template>

<script>
import dayjs from "dayjs"; // 导入日期js
const uuidv4 = require("uuid/v4"); // 导入uuid生成插件
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import {
  deepClone,
  treeToArray,
  flattenDeep,
  getMin,
  getMax
} from "@/assets/array.js";
export default {
  name: "wleGantt",
  data() {
    return {
      self_start_date: "", // 项目开始时间
      self_end_date: "", // 项目结束时间
      self_data_list: [] // 一维化后的gantt数据
    };
  },
  props: {
    // gantt数据
    data: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 日期类型
    dateType: {
      type: String,
      default: "yearAndMonth" // monthAndDay,yearAndMonth,yearAndWeek
    },
    // 树表配置项
    props: Object,
    // 开始日期
    startDate: {
      type: [String, Object],
      required: true
    },
    // 结束时间
    endDate: {
      type: [String, Object],
      required: true
    },
    // 是否检查源数据符合规则，默认开启，如果源数据已遵循project规则，可设置为false以提高性能
    checkSource: {
      type: Boolean,
      default: true
    }
    // 是否使用一维数据组成树
    /* arrayToTree: {
      type: Boolean,
      default: false
    } */
  },
  computed: {
    // 第一级日期
    titleDate() {
      // 分解开始和结束日期
      let start_date_spilt = dayjs(this.self_start_date)
        .format("YYYY-M-D")
        .split("-");
      let end_date_spilt = dayjs(this.self_end_date)
        .format("YYYY-M-D")
        .split("-");
      let start_year = Number(start_date_spilt[0]);
      let start_mouth = Number(start_date_spilt[1]);
      let start_day = Number(start_date_spilt[2]);
      let end_year = Number(end_date_spilt[0]);
      let end_mouth = Number(end_date_spilt[1]);
      let end_day = Number(end_date_spilt[2]);
      // 日期数据盒子
      let dates = [
        {
          name: `${start_year}年`,
          date: start_year,
          id: uuidv4(),
          children: []
        }
      ];
      // 处理年份
      let year_diff = end_year - start_year;
      // 年间隔为同一年
      if (year_diff === 0) {
        let mouths = []; // 处理月份
        let isLeap = this.isLeap(start_year);
        for (let i = start_mouth; i < end_mouth + 1; i++) {
          let days = this.generationDays(start_year, i, isLeap);
          mouths.push({
            name: `${i}月`,
            date: i,
            full_date: `${start_year}-${i}`,
            id: uuidv4(),
            children: days
          });
        }
        dates[0].children = mouths;
        return dates;
      }
      // 处理开始月份
      let start_mouths = [];
      let startIsLeap = this.isLeap(start_year);
      for (let i = start_mouth; i < 13; i++) {
        let days = this.generationDays(start_year, i, startIsLeap);
        start_mouths.push({
          name: `${i}月`,
          date: i,
          full_date: `${start_year}-${i}`,
          id: uuidv4(),
          children: days
        });
      }
      // 处理结束月份
      let end_mouths = [];
      let endIsLeap = this.isLeap(end_year);
      for (let i = 1; i < end_mouth + 1; i++) {
        let days = this.generationDays(end_year, i, endIsLeap);
        end_mouths.push({
          name: `${i}月`,
          date: i,
          full_date: `${end_year}-${i}`,
          id: uuidv4(),
          children: days
        });
      }
      // 年间隔等于一年
      if (year_diff === 1) {
        dates[0].children = start_mouths;
        dates.push({
          name: `${end_year}年`,
          date: end_year,
          children: end_mouths,
          id: uuidv4()
        });
        return dates;
      }
      // 年间隔大于1年
      if (year_diff > 1) {
        for (let i = 1; i < year_diff; i++) {
          let item_year = start_year + i;
          let isLeap = this.isLeap(item_year);
          let month_and_day = this.generationMonths(item_year, isLeap);
          dates.push({
            name: `${item_year}年`,
            date: item_year,
            id: uuidv4(),
            children: month_and_day
          });
        }
        dates.push({
          name: `${end_year}年`,
          date: item_year,
          children: end_mouths,
          id: uuidv4()
        });
        return dates;
      }
    },
    // 数据
    selfData() {
      let _data = this.data || [];
      this.handleData(_data);
      this.self_data_list = flattenDeep(_data, this.selfProps.children);
      return _data;
    },
    // 树表配置项
    selfProps() {
      return {
        hasChildren: "hasChildren",
        children: "children",
        name: "name",
        id: "id",
        pid: "pid",
        startDate: "startDate",
        endDate: "endDate",
        ...this.props
      };
    },
    // 根据日期类型改样式
    dateTypeClass(){
      if(this.dateType === "yearAndMonth"){
        return 'year-and-month'
      }else if(this.dateType === "monthAndDay"){
        return 'month-and-day'
      }else if(this.dateType === "yearAndWeek"){
        return 'year-and-week'
      }
    }
  },
  methods: {
    /**
     * 开始时间改变
     * row: object 当前行数据
     */
    startDateChange(row) {
      console.log(row);
      // 当有父级时，判断需处理父级逻辑
      if (row._parent) {
      }
      // 如果开始晚于结束，提示
      if (
        this.timeIsBefore(
          row[this.selfProps.endDate],
          row[this.selfProps.startDate]
        )
      ) {
        row[this.selfProps.startDate] = row._oldStartDate;
        this.$message({
          showClose: true,
          message: "开始时间不可以晚于结束时间",
          type: "error"
        });
        return;
      }
      // 如果开始早于项目开始，则把项目开始提前
      if (
        this.timeIsBefore(row[this.selfProps.startDate], this.self_start_date)
      ) {
        this.self_start_date = row[this.selfProps.startDate];
      }
    },
    /**
     * 结束时间改变
     * row: object 当前行数据
     */
    endDateChange(row) {
      console.log(row);
    },
    // 递归处理父级数据-开始时间更改
    deepHandleParnet() {
      let aa = "";
    },
    // 以下是表格-日期-gantt生成函数----------------------------------------生成gantt表格-------------------------------------
    /**
     * 生成月份函数
     * year: Number 当前年份
     * isLeap: boolean 是否闰年
     */
    generationMonths(year, isLeap) {
      let months = [];
      for (let i = 1; i < 13; i++) {
        let days = this.generationDays(year, i, isLeap);
        months.push({
          name: `${i}月`,
          date: i,
          full_date: `${year}-${i}`,
          children: days,
          id: uuidv4()
        });
      }
      return months;
    },
    /**
     * 生成日期函数
     * year: Number 当前年份
     * month: Number 当前月份
     * isLeap: boolean 是否闰年
     */
    generationDays(year, month, isLeap) {
      let big_month = [1, 3, 5, 7, 8, 10, 12].includes(month);
      let small_month = [4, 6, 9, 11].includes(month);
      let dates_num = big_month ? 32 : small_month ? 31 : isLeap ? 30 : 29;
      let days = [];
      for (let i = 1; i < dates_num; i++) {
        days.push({
          date: i,
          name: `${i}日`,
          id: uuidv4(),
          full_date: `${year}-${month}-${i}`
        });
      }
      return days;
    },
    /**
     * 是否闰年函数
     * year: Number 当前年份
     */
    isLeap(year) {
      return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
    },
    /**
     * 当前日期gantt状态
     * row: object 当前行信息
     * date: string 当前格子日期
     * unit: string 时间单位，以天、月、年计算
     */
    dayGanttType(row, date, unit = "days") {
      let start_date = row[this.selfProps.startDate];
      let end_date = row[this.selfProps.endDate];
      let between = dayjs(date).isBetween(start_date, end_date, unit);
      if (between) {
        return "wl-item-on";
      }
      let start = dayjs(start_date).isSame(date, unit);
      let end = dayjs(end_date).isSame(date, unit);
      if (start && end) {
        return "wl-item-on wl-item-full";
      }
      if (start) {
        return "wl-item-on wl-item-start";
      }
      if (end) {
        return "wl-item-on wl-item-end";
      }
    },
    // 以下是时间计算类函数 ------------------------------------------------------时间计算---------------------------------------
    /**
     * 计算时差
     * startDate：开始时间
     * endDate：结束时间
     * unit：单位 days、months、yesrs
     */
    timeDiffTime(startDate, endDate, unit = "days") {
      return dayjs(endDate).diff(startDate, unit);
    },
    /**
     * 比较时间，是否之前
     * startDate：开始时间
     * endDate：结束时间
     * unit：单位 days、months、yesrs
     */
    timeIsBefore(startDate, endDate, unit = "days") {
      return dayjs(startDate).isBefore(endDate, unit);
    },
    /**
     * 时间加计算函数
     * date：原时间
     * num：需要增加的时间数量
     * nuit：增加时间的单位 day year
     */
    timeAdd(date, num = 1, nuit = "day", format = "YYYY-MM-DD") {
      return dayjs(date)
        .add(num, nuit)
        .format(format);
    },
    /**
     * 时间格式化函数
     * date 需要格式化的数据
     * format 格式化的格式
     */
    timeFormat(date, format = "YYYY-MM-DD") {
      return dayjs(date).format(format);
    },
    // 以下为输出数据函数 --------------------------------------------------------------输出数据------------------------------------
    emitTimeChange(item) {
      this.$emit("timeChange", item);
    },
    // 处理外部数据 ---------------------------------------------------------------原始数据处理-------------------------------------
    handleData(data, parent = null, level = 0) {
      level++;
      data.forEach((i, idx) => {
        i._parent = parent; // 添加父级字段
        i._level = level; // 添加层级字段
        // 当结束时间早于开始时间时，自动处理结束时间为开始时间延后一天
        let _end_early_start = this.timeIsBefore(
          i[this.selfProps.endDate],
          i[this.selfProps.startDate]
        );
        if (_end_early_start) {
          i[this.selfProps.endDate] = this.timeAdd(i[this.selfProps.startDate]);
          i._cycle = 1; // 添加工期字段
          this.emitTimeChange(i); // 将发生时间更新的数据输出
        } else {
          i._cycle = this.timeDiffTime(
            i[this.selfProps.startDate],
            i[this.selfProps.endDate]
          );
        }
        // 如果当前节点的开始时间早于父节点的开始时间，则将开始时间与父节点相同
        if (i._parent) {
          // 如果子节点时间早于父节点，则将子节点开始时间后移至父节点开始时间,并将结束时间平移【即工期不变】
          let _child_early_parent = this.timeIsBefore(
            i[this.selfProps.startDate],
            i._parent[this.selfProps.startDate]
          );
          if (_child_early_parent) {
            i[this.selfProps.startDate] = i._parent[this.selfProps.startDate]; // 修正子节点开始事件
            i[this.selfProps.endDate] = this.timeAdd(
              i[this.selfProps.startDate],
              i._cycle
            ); // 修正子节点结束时间
          }
        }
        this.childEndDateToParent(i); // 校验结束时间是否晚于子节点，如不则将节点结束时间改为最晚子节点
        if (!i._oldStartDate) {
          this.$set(i, "_oldStartDate", i[this.selfProps.startDate]);
        }
        if (!i._oldEndDate) {
          this.$set(i, "_oldEndDate", i[this.selfProps.endDate]);
        }
        if (Array.isArray(i[this.selfProps.children])) {
          i._isLeaf = false;
          this.handleData(i[this.selfProps.children], i, level);
        } else {
          i._isLeaf = true;
        }
      });
    },
    // 取数组结束时间最大值，如果最大值比父级结束时间大，更新父级结束时间
    childEndDateToParent(item) {
      if (!item || !Array.isArray(item[this.selfProps.children])) return;
      let _child_max = getMax(
        item[this.selfProps.children],
        this.selfProps.endDate,
        true
      );
      let _parent_end = dayjs(item[this.selfProps.endDate]).unix();
      if (_child_max > _parent_end) {
        item[this.selfProps.endDate] = this.timeFormat(_child_max);
      }
    },
    // 简洁处理数据
    terseHandleData(data, parent = null, level = 0) {
      level++;
      data.forEach(i => {
        i._parent = parent; // 添加父级字段
        i._level = level; // 添加层级字段
        i._cycle = this.timeDiffTime(
          // 添加工期字段
          i[this.selfProps.startDate],
          i[this.selfProps.endDate]
        );
        if (!i._oldStartDate) {
          // 添加开始时间字段
          this.$set(i, "_oldStartDate", i[this.selfProps.startDate]);
        }
        if (!i._oldEndDate) {
          // 添加结束字段时间
          this.$set(i, "_oldEndDate", i[this.selfProps.endDate]);
        }
        if (Array.isArray(i[this.selfProps.children])) {
          // 添加是否叶子节点字段
          i._isLeaf = false;
          this.terseHandleData(i[this.selfProps.children], i, level);
        } else {
          i._isLeaf = true;
        }
      });
    }
  },
  watch: {
    startDate(val) {
      this.self_start_date = val;
    },
    endDate(val) {
      this.self_end_date = val;
    }
  },
  created() {
    this.self_start_date = this.startDate;
    this.self_end_date = this.endDate;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
$gantt_item: 16px;
$gantt_item_half: 8px;

.wl-gantt {
  .wl-gantt-header > th {
    text-align: center;
  }

  .wl-gantt-item {
    position: relative;
    transition: all 0.3s;
    > .cell {
      padding: 0;
    }
  }

  .u-full.el-input {
    width: 100%;
  }

  .wl-item-on {
    position: absolute;
    top: 50%;
    left: 0;
    right: -1px;
    margin-top: -$gantt_item_half;
    height: $gantt_item;
    background: #409eff;
    transition: all 0.4s;
  }

  .wl-item-start {
    left: 50%;
    &:after {
      position: absolute;
      top: $gantt_item;
      left: 0;
      z-index: 1;
      content: "";
      width: 0;
      height: 0;
      border-color: #409eff transparent transparent;
      border-width: 6px 6px 6px 0;
      border-style: solid;
    }
  }

  .wl-item-end {
    right: 50%;
    &:after {
      position: absolute;
      top: $gantt_item;
      right: 0;
      z-index: 1;
      content: "";
      width: 0;
      height: 0;
      border-color: transparent #409eff;
      border-width: 0 6px 6px 0;
      border-style: solid;
    }
  }

  .wl-item-full {
    left: 0;
    right: 0;
    &:before {
      position: absolute;
      top: $gantt_item;
      left: 0;
      z-index: 1;
      content: "";
      width: 0;
      height: 0;
      border-color: #409eff transparent transparent;
      border-width: 6px 6px 6px 0;
      border-style: solid;
    }
    &:after {
      position: absolute;
      top: $gantt_item;
      right: 0;
      z-index: 1;
      content: "";
      width: 0;
      height: 0;
      border-color: transparent #409eff;
      border-width: 0 6px 6px 0;
      border-style: solid;
    }
  }
}

.year-and-month{
  .wl-item-start {
    left: 5%;
    &:after {
      position: absolute;
      top: $gantt_item;
      left: 0;
      z-index: 1;
      content: "";
      width: 0;
      height: 0;
      border-color: #409eff transparent transparent;
      border-width: 6px 6px 6px 0;
      border-style: solid;
    }
  }

  .wl-item-end {
    right: 5%;
    &:after {
      position: absolute;
      top: $gantt_item;
      right: 0;
      z-index: 1;
      content: "";
      width: 0;
      height: 0;
      border-color: transparent #409eff;
      border-width: 0 6px 6px 0;
      border-style: solid;
    }
  }
}
</style>
