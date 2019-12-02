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
    <!-- year and mouth gantt -->
    <template v-if="self_date_type === 'yearAndMonth'">
      <el-table-column
        :resizable="false"
        v-for="year in ganttTitleDate"
        :label="year.name"
        :key="year.id"
      >
        <el-table-column
          class-name="wl-gantt-item"
          v-for="month in year.children"
          :resizable="false"
          :key="month.id"
          :label="month.name"
        >
          <template slot-scope="scope">
            <div :class="dayGanttType(scope.row, month.full_date, 'months')"></div>
          </template>
        </el-table-column>
      </el-table-column>
    </template>
    <!-- year and week gantt -->
    <template v-else-if="self_date_type === 'yearAndWeek'">
      <el-table-column
        :resizable="false"
        v-for="i in ganttTitleDate"
        :label="i.full_date"
        :key="i.id"
      >
        <el-table-column
          class-name="wl-gantt-item"
          v-for="t in i.children"
          :resizable="false"
          :key="t.id"
          :label="t.name"
        >
          <template slot-scope="scope">
            <div :class="dayGanttType(scope.row, t.full_date, 'week')"></div>
          </template>
        </el-table-column>
      </el-table-column>
    </template>
    <!-- mouth and day gantt -->
    <template v-else>
      <el-table-column
        :resizable="false"
        v-for="i in ganttTitleDate"
        :label="i.full_date"
        :key="i.id"
      >
        <el-table-column
          class-name="wl-gantt-item"
          v-for="t in i.children"
          :resizable="false"
          :key="t.id"
          :label="t.name"
        >
          <template slot-scope="scope">
            <div :class="dayGanttType(scope.row, t.full_date)"></div>
          </template>
        </el-table-column>
      </el-table-column>
    </template>
  </el-table>
</template>

<script>
import dayjs from "dayjs"; // 导入日期js
const uuidv4 = require("uuid/v4"); // 导入uuid生成插件
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import { deepClone, flattenDeep, getMin, getMax } from "@/assets/array.js";
export default {
  name: "wlGantt",
  data() {
    return {
      self_start_date: "", // 项目开始时间
      self_end_date: "", // 项目结束时间
      self_data_list: [], // 一维化后的gantt数据
      self_date_type: "", // 自身日期类型
      self_id: 1 // 自增id
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
    },
    // 废弃：反而会因为频繁的判断而影响性能
    // 是否生成自增id并组成parents来满足树链的查询条件，如果数据本身已有自增id，可设置为false以提高性能
    // 如果设置为false，则数据内必须包含自增id字段：identityId，parents字段必须以`,`分割。
    // 字段名可通过props配置，自增id必须唯一并尽可能的短，如1，2，3...，parents应为祖先自增id通过`,`拼接直至父级
    recordParents: {
      type: Boolean,
      default: true
    },
    // 是否使用id来作为自增id，如果是请保证id本来就简短的数字型而不是较长的字符串或guid
    treatIdAsIdentityId: {
      type: Boolean,
      default: false
    },
    // 自动变化gantt标题日期模式
    autoGanttDateType: {
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
    // 甘特图标题日期分配
    ganttTitleDate() {
      // 分解开始和结束日期
      let start_date_spilt = dayjs(this.self_start_date)
        .format("YYYY-M-D")
        .split("-");
      let end_date_spilt = dayjs(this.self_end_date)
        .format("YYYY-M-D")
        .split("-");
      let start_year = Number(start_date_spilt[0]);
      let start_mouth = Number(start_date_spilt[1]);
      let end_year = Number(end_date_spilt[0]);
      let end_mouth = Number(end_date_spilt[1]);
      // 自动更新日期类型以适应任务时间范围跨度
      if (this.autoGanttDateType) {
        // 计算日期跨度
        let mouth_diff = this.timeDiffTime(
          this.self_start_date,
          this.self_end_date,
          "months"
        );
        if (mouth_diff > 12) {
          // 12个月以上的分到yearAndMouth
          this.self_date_type = "yearAndMonth";
        } else if (mouth_diff > 2) {
          // 2个月以上的分到yearAndWeek
          this.self_date_type = "yearAndWeek";
        } else {
          this.self_date_type = "monthAndDay";
        }
      }
      // 不自动更新日期类型，以dateType固定展示
      if (this.self_date_type === "yearAndWeek") {
        return this.yearAndWeekTitleDate(
          start_year,
          start_mouth,
          end_year,
          end_mouth
        );
      } else if (this.self_date_type === "monthAndDay") {
        return this.mouthAndDayTitleDate(
          start_year,
          start_mouth,
          end_year,
          end_mouth
        );
      } else {
        return this.yearAndMouthTitleDate(
          start_year,
          start_mouth,
          end_year,
          end_mouth
        );
      }
    },
    // 数据
    selfData() {
      let _data = this.data || [];
      this.self_data_list = flattenDeep(_data, this.selfProps.children);
      this.handleData(_data);
      return _data;
    },
    // 树表配置项
    selfProps() {
      return {
        hasChildren: "hasChildren",
        children: "children", // children字段
        name: "name", // 任务名称字段
        id: "id", // id字段
        pid: "pid", // pid字段
        startDate: "startDate", // 开始时间字段
        endDate: "endDate", // 结束时间字段
        identityId: "identityId",
        parents: "parents",
        pre: "pre", // 前置任务字段【注意：如果使用recordParents，则pre值应是目标对象的identityId字段(可配置)】
        ...this.props
      };
    },
    // 根据日期类型改样式
    dateTypeClass() {
      if (this.self_date_type === "yearAndMonth") {
        return "year-and-month";
      } else if (this.self_date_type === "monthAndDay") {
        return "month-and-day";
      } else if (this.self_date_type === "yearAndWeek") {
        return "year-and-week";
      }
    }
  },
  methods: {
    /**
     * 开始时间改变
     * row: object 当前行数据
     */
    startDateChange(row) {
      // 如果将开始时间后移，结束时间也应后移
      let _delay = this.timeIsBefore(
        row._oldStartDate,
        row[this.selfProps.startDate]
      );
      if (_delay) {
        row[this.selfProps.endDate] = this.timeAdd(
          row[this.selfProps.endDate],
          row._cycle
        );
      }
      // 如果开始早于项目开始，则把项目开始提前
      let _early_project_start = this.timeIsBefore(
        row[this.selfProps.startDate],
        this.self_start_date
      );
      if (_early_project_start) {
        this.self_start_date = row[this.selfProps.startDate];
      }
      this.emitTimeChange(row); 
    },
    /**
     * 结束时间改变
     * row: object 当前行数据
     */
    endDateChange(row) {
      this.emitTimeChange(row); 
      // 如果开始晚于结束，提示
      /* if (
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
      } */
    },
    /**
     * 查询目标是否在父级链或者全部子集中
     * item 当前节点
     * pre 前置节点
     */
    targetInParentsOrChildren(item, pre) {
      let _parents = item._parents.split(",");
      let _children = item._all_children.map(i => i._identityId);
      return _children.concat(_parents).some(i => i == pre._identityId);
      /* let _parents = item[this.selfProps.parents].split(",").filter(i => !!i);
      let _children = item._all_children.map(i => i[this.selfProps.identityId]);
      return _children.push(..._parents).some(i => i == item[this.selfProps.pre]); */
    },
    // 以下是表格-日期-gantt生成函数----------------------------------------生成gantt表格-------------------------------------
    /**
     * 年-月模式gantt标题
     * start_year: 起始年
     * start_mouth：起始月
     * end_year：结束年
     * end_mouth：结束月
     */
    yearAndMouthTitleDate(start_year, start_mouth, end_year, end_mouth) {
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
        let isLeap = this.isLeap(start_year); // 是否闰年
        let mouths = this.generationMonths(
          start_year,
          start_mouth,
          end_mouth + 1,
          isLeap,
          false
        ); // 处理月份
        dates[0].children = mouths;
        return dates;
      }
      // 处理开始月份
      let startIsLeap = this.isLeap(start_year);
      let start_mouths = this.generationMonths(
        start_year,
        start_mouth,
        13,
        startIsLeap,
        false
      );
      // 处理结束月份
      let endIsLeap = this.isLeap(end_year);
      let end_mouths = this.generationMonths(
        end_year,
        1,
        end_mouth + 1,
        endIsLeap,
        false
      );
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
          let month_and_day = this.generationMonths(
            item_year,
            1,
            13,
            isLeap,
            false
          );
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
    /**
     * 年-周模式gantt标题
     * start_year: 起始年
     * start_mouth：起始月
     * end_year：结束年
     * end_mouth：结束月
     */
    yearAndWeekTitleDate(start_year, start_mouth, end_year, end_mouth) {
      // 处理年份
      let year_diff = end_year - start_year;
      // 只存在同年或前后年的情况
      if (year_diff === 0) {
        // 年间隔为同一年
        let isLeap = this.isLeap(start_year); // 是否闰年
        let mouths = this.generationMonths(
          start_year,
          start_mouth,
          end_mouth + 1,
          isLeap,
          true,
          true
        ); // 处理月份
        return mouths;
      }
      // 处理开始月份
      let startIsLeap = this.isLeap(start_year);
      let start_mouths = this.generationMonths(
        start_year,
        start_mouth,
        13,
        startIsLeap,
        true,
        true
      );
      // 处理结束月份
      let endIsLeap = this.isLeap(end_year);
      let end_mouths = this.generationMonths(
        end_year,
        1,
        end_mouth + 1,
        endIsLeap,
        true,
        true
      );
      return start_mouths.concat(end_mouths);
    },
    /**
     * 月-日模式gantt标题
     * start_year: 起始年
     * start_mouth：起始月
     * end_year：结束年
     * end_mouth：结束月
     */
    mouthAndDayTitleDate(start_year, start_mouth, end_year, end_mouth) {
      // 处理年份
      let year_diff = end_year - start_year;
      // 只存在同年或前后年的情况
      if (year_diff === 0) {
        // 年间隔为同一年
        let isLeap = this.isLeap(start_year); // 是否闰年
        let mouths = this.generationMonths(
          start_year,
          start_mouth,
          end_mouth + 1,
          isLeap
        ); // 处理月份
        return mouths;
      }
      // 处理开始月份
      let startIsLeap = this.isLeap(start_year);
      let start_mouths = this.generationMonths(
        start_year,
        start_mouth,
        13,
        startIsLeap
      );
      // 处理结束月份
      let endIsLeap = this.isLeap(end_year);
      let end_mouths = this.generationMonths(
        end_year,
        1,
        end_mouth + 1,
        endIsLeap
      );
      return start_mouths.concat(end_mouths);
    },
    /**
     * 生成月份函数
     * year: Number 当前年份
     * start_num: Number 开始月分
     * end_num：Number 结束月份
     * isLeap: Boolean 是否闰年
     * insert_days: Boolean 是否需要插入 日
     * week: 是否以周的间隔
     */
    generationMonths(
      year,
      start_num = 1,
      end_num = 13,
      isLeap = false,
      insert_days = true,
      week = false
    ) {
      let months = [];
      if (insert_days) {
        // 无需 日 的模式
        for (let i = start_num; i < end_num; i++) {
          // 需要 日 的模式
          let days = this.generationDays(year, i, isLeap, week);
          months.push({
            name: `${i}月`,
            date: i,
            full_date: `${year}-${i}`,
            children: days,
            id: uuidv4()
          });
        }
        return months;
      }
      for (let i = start_num; i < end_num; i++) {
        // 需要 日 的模式
        months.push({
          name: `${i}月`,
          date: i,
          full_date: `${year}-${i}`,
          id: uuidv4()
        });
      }
      return months;
    },
    /**
     * 生成日期函数
     * year: Number 当前年份
     * month: Number 当前月份
     * isLeap: Boolean 是否闰年
     * week: Boolean 是否间隔一周
     */
    generationDays(year, month, isLeap = false, week = false) {
      let big_month = [1, 3, 5, 7, 8, 10, 12].includes(month);
      let small_month = [4, 6, 9, 11].includes(month);
      let dates_num = big_month ? 32 : small_month ? 31 : isLeap ? 30 : 29;
      let days = [];
      if (week) {
        let _day = 1; // 从周日开始
        let _start_day_inweek = this.timeInWeek(`${year}-${month}-1`);
        if( _start_day_inweek !== 0){
          _day = 8 - _start_day_inweek
        }
        for (let i = _day; i < dates_num; i+=7) {
          days.push({
            date: i,
            name: `${i}日`,
            id: uuidv4(),
            full_date: `${year}-${month}-${i}`
          });
        }
      } else {
        for (let i = 1; i < dates_num; i++) {
          days.push({
            date: i,
            name: `${i}日`,
            id: uuidv4(),
            full_date: `${year}-${month}-${i}`
          });
        }
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
    /**
     * 查询时间是周几
     */
    timeInWeek(date){
      return dayjs(date).day();
    },
    // 以下为输出数据函数 --------------------------------------------------------------输出数据------------------------------------
    emitTimeChange(item) {
      this.$emit("timeChange", item);
      this.$nextTick(() => {
        this.$set(item, "_oldStartDate", item[this.selfProps.startDate]);
        this.$set(item, "_oldEndDate", item[this.selfProps.endDate]);
      });
    },
    // 处理外部数据 ---------------------------------------------------------------原始数据处理-------------------------------------
    handleData(data, parent = null, level = 0) {
      level++;
      data.forEach(i => {
        this.$set(i, "_parent", parent); // 添加父级字段
        this.$set(i, "_level", level); // 添加层级字段
        if (!i._oldStartDate) {
          this.$set(i, "_oldStartDate", i[this.selfProps.startDate]);
        }
        if (!i._oldEndDate) {
          this.$set(i, "_oldEndDate", i[this.selfProps.endDate]);
        }
        // 当结束时间早于开始时间时，自动处理结束时间为开始时间延后一天
        let _end_early_start = this.timeIsBefore(
          i[this.selfProps.endDate],
          i[this.selfProps.startDate]
        );
        if (_end_early_start) {
          this.$set(i, this.selfProps.endDate, i[this.selfProps.startDate]);
          this.$set(i, "_cycle", 1); // 添加工期字段
          this.emitTimeChange(i); // 将发生时间更新的数据输出
        } else {
          let _time_diff = this.timeDiffTime(
            i[this.selfProps.startDate],
            i[this.selfProps.endDate]
          );
          this.$set(i, "_cycle", _time_diff + 1); // 添加工期字段
        } // 添加工期字段
        // 如果当前节点的开始时间早于父节点的开始时间，则将开始时间与父节点相同
        this.parentStartDateToChild(i);
        // 校验结束时间是否晚于子节点，如不则将节点结束时间改为最晚子节点
        this.childEndDateToParent(i);
        // 添加自增id字段及树链组成的parents字段
        this.recordIdentityIdAndParents(i);
        if (Array.isArray(i[this.selfProps.children])) {
          this.$set(i, "_isLeaf", false); // 添加是否叶子节点字段
          let _all_children = flattenDeep(
            i[this.selfProps.children],
            this.selfProps.children
          );
          this.$set(i, "_all_children", _all_children); // 添加全部子节点字段
          this.handleData(i[this.selfProps.children], i, level);
        } else {
          this.$set(i, "_isLeaf", true); // 添加是否叶子节点字段
          this.$set(i, "_all_children", []); // 添加全部子节点字段
        }
        // 处理前置任务
        this.handlePreTask(i);
      });
    },
    // 取父节点开始时间给早于父节点开始时间的子节点
    parentStartDateToChild(item) {
      if (!item._parent) return;
      // 如果子节点时间早于父节点，则将子节点开始时间后移至父节点开始时间,并将结束时间平移【即工期不变】
      let _child_early_parent = this.timeIsBefore(
        item[this.selfProps.startDate],
        item._parent[this.selfProps.startDate]
      );
      if (_child_early_parent) {
        // 修正子节点开始时间
        this.$set(
          item,
          this.selfProps.startDate,
          item._parent[this.selfProps.startDate]
        );
        // 修正子节点结束时间
        let _to_endDate = this.timeAdd(
          item[this.selfProps.startDate],
          item._cycle
        );
        this.$set(item, this.selfProps.endDate, _to_endDate);
        this.emitTimeChange(item); // 将发生时间更新的数据输出
      }
    },
    // 取数组结束时间最大值，如果最大值比父级结束时间大，更新父级结束时间
    childEndDateToParent(item) {
      if (!Array.isArray(item[this.selfProps.children])) return;
      let _child_max = getMax(
        item[this.selfProps.children],
        this.selfProps.endDate,
        true
      ); // 取子节点中最晚的结束时间
      let _parent_end = dayjs(item[this.selfProps.endDate]).valueOf();
      if (_child_max > _parent_end) {
        // 如果子节点结束时间比父节点晚，则将父节点结束时间退后
        this.$set(item, this.selfProps.endDate, this.timeFormat(_child_max));
        this.emitTimeChange(item); // 将发生时间更新的数据输出
      }
    },
    // 处理前置任务节点
    handlePreTask(item) {
      if (!item[this.selfProps.pre]) return;
      // 找到前置目标节点
      let _pre_target = this.self_data_list.find(
        i => i[this.selfProps.id] == item[this.selfProps.pre]
      );
      if (!_pre_target) return;
      let is_pre_standard = this.targetInParentsOrChildren(item, _pre_target);
      if (is_pre_standard) return;
      // 查看是否需要根据前置时间，如果不符合规则，更新后置时间
      let _start_early_prvend = this.timeIsBefore(
        item[this.selfProps.startDate],
        _pre_target[this.selfProps.endDate]
      );
      if (_start_early_prvend) {
        let _cycle = item._cycle - 1;
        let _to_startDate = this.timeAdd(
          _pre_target[this.selfProps.endDate],
          1
        );
        let _to_endDate = this.timeAdd(_to_startDate, _cycle);
        this.$set(item, this.selfProps.startDate, _to_startDate);
        this.$set(item, this.selfProps.endDate, _to_endDate);
      }
    },
    // 处理数据生成自增id和树链parents
    recordIdentityIdAndParents(item) {
      // if (!this.recordParents) return;
      if (this.treatIdAsIdentityId) {
        let _parents = item._parent
          ? item._parent._parents + "," + item._parent[this.selfProps.id]
          : "";
        this.$set(item, "_parents", _parents);
        this.$set(item, "_identityId", item[this.selfProps.id]);
        return;
      }
      // 添加自增id
      this.$set(item, "_identityId", this.self_id);
      this.self_id++;
      // 添加parents字段
      let _parents = item._parent
        ? item._parent._parents + "," + item._parent._identityId
        : "";
      this.$set(item, "_parents", _parents);
    },
    // 简洁处理数据
    terseHandleData(data, parent = null, level = 0) {
      level++;
      data.forEach(i => {
        this.$set(i, "_parent", parent); // 添加父级字段
        this.$set(i, "_level", level); // 添加层级字段
        let _time_diff = this.timeDiffTime(
          i[this.selfProps.startDate],
          i[this.selfProps.endDate]
        );
        i._cycle = _time_diff + 1;
        if (!i._oldStartDate) {
          // 添加开始时间字段
          this.$set(i, "_oldStartDate", i[this.selfProps.startDate]);
        }
        if (!i._oldEndDate) {
          // 添加结束字段时间
          this.$set(i, "_oldEndDate", i[this.selfProps.endDate]);
        }
        // 添加自增id字段及树链组成的parents字段
        this.recordIdentityIdAndParents(i);
        if (Array.isArray(i[this.selfProps.children])) {
          this.$set(i, "_isLeaf", false); // 添加是否叶子节点字段
          let _all_children = flattenDeep(
            i[this.selfProps.children],
            this.selfProps.children
          );
          this.$set(i, "_all_children", _all_children); // 添加全部子节点字段
          this.terseHandleData(i[this.selfProps.children], i, level);
        } else {
          this.$set(i, "_isLeaf", true); // 添加是否叶子节点字段
        }
        // 处理前置任务
        this.handlePreTask(i);
      });
    }
  },
  watch: {
    dateType(val) {
      this.self_date_type = val;
    },
    startDate(val) {
      this.self_start_date = val;
    },
    endDate(val) {
      this.self_end_date = val;
    }
  },
  created() {
    this.self_date_type = this.dateType;
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

.year-and-month {
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

  .wl-item-full {
    left: 5%;
    right: 5%;
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
</style>
