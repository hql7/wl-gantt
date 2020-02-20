<template>
<div class="wl-gantt"> 
  <!-- 主体图形部分 -->
  <el-table
    ref="wl-gantt"
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
    >
    <slot name="prv"></slot>
    <el-table-column
      fixed
      label="名称"
      min-width="200"
      show-overflow-tooltip
      :prop="selfProps.name"
      :formatter="nameFormatter"
    ></el-table-column>
    <el-table-column
      :resizable="false"
      fixed
      min-width="110"
      align="center"
      :prop="selfProps.startDate"
      label="开始日期"
     >
      <template slot-scope="scope">
        {{timeFormat(scope.row[selfProps.startDate])}}
        <!-- <el-date-picker
          v-if="self_cell_edit === '_s_d_' + scope.$index"
          v-model="scope.row[selfProps.startDate]"
          @change="startDateChange(scope.row)"
          @blur="self_cell_edit = null"
          type="date"
          size="medium"
          class="u-full"
          :clearable="false"
          ref="wl-start-date"
          value-format="yyyy-MM-dd"
          placeholder="请选择开始日期"
        ></el-date-picker>
        <div
          v-else
          class="h-full"
          @click="cellEdit( '_s_d_' + scope.$index, 'wl-start-date')"
        >{{timeFormat(scope.row[selfProps.startDate])}}</div> -->
      </template>
    </el-table-column>
    <el-table-column
      fixed
      :resizable="false"
      min-width="110"
      align="center"
      :prop="selfProps.endDate"
      label="结束日期"
      >
      <template slot-scope="scope">
        {{timeFormat(scope.row[selfProps.endDate])}}
        <!-- <el-date-picker
          v-if="self_cell_edit === '_e_d_' + scope.$index"
          v-model="scope.row[selfProps.endDate]"
          @change="endDateChange(scope.row)"
          @blur="self_cell_edit = null"
          type="date"
          size="medium"
          class="u-full"
          :clearable="false"
          ref="wl-end-date"
          value-format="yyyy-MM-dd"
          placeholder="请选择结束日期"
        ></el-date-picker>
        <div
          v-else
          class="h-full"
          @click="cellEdit('_e_d_' + scope.$index, 'wl-end-date')"
        >{{timeFormat(scope.row[selfProps.endDate])}}</div> -->
      </template>
    </el-table-column>
    <el-table-column
      v-if="usePreColumn"
      align="center"
      min-width="100"
      label="前置任务"
      show-overflow-tooltip
      :prop="selfProps.endDate"
      >
      <template slot-scope="scope">
        {{preFormat(scope.row)}}
        <!-- @blur="self_cell_edit = null" @blur="preEditBlur" -->
        <!-- <el-select
          v-if="self_cell_edit === '_p_t_' + scope.$index"
          @change="preChange"
          v-model="scope.row[selfProps.pre]"
          collapse-tags
          :multiple="preMultiple"
          ref="wl-pre-select"
          placeholder="请选择前置任务"
          >
          <el-option
            v-for="item in pre_options"
            :key="item[selfProps.id]"
            :label="item[selfProps.name]"
            :value="item[selfProps.id]"
          ></el-option>
        </el-select>
        <div
          v-else
          class="h-full"
          @click="preCellEdit(scope.row, '_p_t_' + scope.$index, 'wl-pre-select')"
        >{{preFormat(scope.row)}}</div> -->
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
            <div v-if="useRealTime" :class="realDayGanttType(scope.row, month.full_date, 'months')"></div>
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
            <div v-if="useRealTime" :class="realDayGanttType(scope.row, t.full_date, 'week')"></div>
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
            <div v-if="useRealTime" :class="realDayGanttType(scope.row, t.full_date)"></div>
          </template>
        </el-table-column>
      </el-table-column>
    </template>
  </el-table>
  <!-- 编辑表单部分 -->
  <el-dialog class="wl-gantt-dialog" title="编辑任务" :modal="false" :visible.sync="task_edit_show" width="420px">
  <el-form :model="task_edit_form" size="medium" label-width="110px">
    <el-form-item label="任务名称">
      <el-input v-model="task_edit_form.name" placeholder="请填写任务名称"></el-input>
    </el-form-item>
    <el-form-item label="开始时间">
      <el-date-picker
        class="u-full"
        v-model="task_edit_form.start_time"
        type="date"
        placeholder="请选择开始时间">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="结束时间">
      <el-date-picker
        class="u-full"
        v-model="task_edit_form.end_time"
        type="date"
        placeholder="请选择结束时间">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="实际开始时间">
      <el-date-picker
        class="u-full"
        v-model="task_edit_form.real_start_time"
        type="date"
        placeholder="请选择实际开始时间">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="实际结束时间">
      <el-date-picker
        class="u-full"
        v-model="task_edit_form.real_end_time"
        type="date"
        placeholder="请选择实际结束时间">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="前置任务">
      <el-select
          class="u-full"
          @change="preChange"
          v-model="task_edit_form.pre_task"
          collapse-tags
          :multiple="preMultiple"
          placeholder="请选择前置任务"
          >
          <el-option
            v-for="item in pre_options"
            :key="item[selfProps.id]"
            :label="item[selfProps.name]"
            :value="item[selfProps.id]"
          ></el-option>
        </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="task_edit_show = false">取 消</el-button>
    <el-button type="primary" @click="taskEdit()">确 定</el-button>
  </div>
  </el-dialog>
</div>
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
      self_id: 1, // 自增id
      self_cell_edit: null, // 正在编辑的单元格
      self_dependent_store: [], // 自身依赖库
      multipleSelection: [], // 多选数据
      currentRow: null, // 单选数据
      pre_options: [], // 可选前置节点
      task_edit_show: false, // 是否显示任务编辑表单
      task_edit_form: {}, // 任务编辑表单
      edit_row: {}, // 记录编辑行
      update: true // 更新视图
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
    // 是否使用实际开始时间、实际结束时间
    useRealTime: {
      type: Boolean,
      default: false
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
    },
    nameFormatter: Function, // 名称列的格式化内容函数
    // 是否使用内置前置任务列
    usePreColumn: {
      type: Boolean,
      default: true
    },
    // 是否开启前置任务多选 如果开启多选则pre字段必须是Array，否则可以是Number\String
    preMultiple: {
      type: Boolean,
      default: true
    },
    preFormatter: Function, // 前置任务列的格式化内容函数
    // 空单元格占位符
    emptyCellText: {
      type: String,
      default: ""
    },
    // 内置列
    builtInColumn: Object,
    // ---------------------------------------------以下为el-table Attributes--------------------------------------------
    defaultExpandAll: {
      type: Boolean,
      default: false
    }, // 是否全部展开
    rowKey: {
      type: String,
      default: "id"
    }, // 必须指定key来渲染树形数据
    height: [String, Number], // 列表高度
    maxHeight: [String, Number], // 列表最大高度
    stripe: {
      type: Boolean,
      default: false
    }, // 是否为斑马纹
    highlightCurrentRow: {
      type: Boolean,
      default: false
    }, // 是否要高亮当前行
    border: {
      type: Boolean,
      default: true
    }, // 是否带有纵向边框
    fit: {
      type: Boolean,
      default: true
    }, // 列的宽度是否自撑开
    size: String, // Table 的尺寸
    rowClassName: Function, // 行的 className 的回调方法
    rowStyle: Function, // 行的 style 的回调方法
    cellClassName: Function, // 单元格的 className 的回调方法
    cellStyle: Function, // 单元格的 style 的回调方法
    headerRowClassName: {
      type: [Function, String],
      default: "wl-gantt-header"
    }, // 表头行的 className 的回调方法
    headerRowStyle: [Function, Object], // 表头行的 style 的回调方法
    headerCellClassName: [Function, String], // 表头单元格的 className 的回调方法
    headerCellStyle: [Function, Object], // 表头单元格的 style 的回调方法
    expandRowKeys: Array // 可以通过该属性设置 Table 目前的展开行
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
      // 生成一维数据
      this.self_data_list = flattenDeep(_data, this.selfProps.children);
      // 处理源数据合法性
      this.handleData(_data);
      // 处理前置依赖
      this.handleDependentStore();
      return _data;
    },
    // 树表配置项
    selfProps() {
      return {
        hasChildren: "hasChildren", // 字段来指定哪些行是包含子节点
        children: "children", // children字段来表示有子节点
        name: "name", // 任务名称字段
        id: "id", // id字段
        pid: "pid", // pid字段
        startDate: "startDate", // 开始时间字段
        realStartDate: "realStartDate", // 实际开始时间字段
        endDate: "endDate", // 结束时间字段
        realEndDate: "realEndDate", // 实际结束时间字段
        identityId: "identityId",
        parents: "parents",
        pre: "pre", // 前置任务字段【注意：如果使用recordParents，则pre值应是目标对象的identityId字段(可配置)】
        ...this.props
      };
    },
    // 内置表格列
    selfBuiltInColumn(){
      return {
        
      }
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
    // 任务编辑
    taskEdit(){
      this.$set(this.edit_row,)
      this.task_edit_show = false;
    },
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
     * 前置任务改变
     * row: object 当前行数据
     */
    preChange(row) {
      this.emitTimeChange(row);
      this.self_cell_edit = null;
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
     * 前置任务内容格式化函数
     * data：[String, Array] 前置任务
     */
    preFormat(row) {
      // 自定义格式化前置任务列函数
      if (this.preFormatter) {
        return this.preFormatter(row);
      }
      let data = row[this.selfProps.pre];
      if (!data) return this.emptyCellText;
      if (Array.isArray(data)) {
        if (data.length === 0) return this.emptyCellText;
        let _pre_text = "";
        data.forEach(i => {
          let _act = this.self_data_list.find(t => t[this.selfProps.id] === i);
          if (_act) _pre_text += `${_act[this.selfProps.name]},`;
        });
        return _pre_text;
      }
      let _act = this.self_data_list.find(t => t[this.selfProps.id] === data);
      return _act ? _act[this.selfProps.name] : this.emptyCellText;
    },
    // 前置下拉框失去焦点事件，change会触发blur，如果不延时则chang失效，如果延时则也只是延迟触发，会造成选一次就关闭无法多选
    /* preEditBlur(){
      setTimeout(()=>{
        this.self_cell_edit = null
      },500)
    }, */
    /**
     * 前置任务编辑
     */
    preCellEdit(row) {
      this.pre_options = [];
      this.self_data_list.forEach(i => {
        if (i[this.selfProps.id] !== row[this.selfProps.id]) {
          this.pre_options.push({ ...i, [this.selfProps.children]: null });
        }
      });
      // 再剔除所有前置链涉及到的节点
      this.deepFindToSelf(row);
    },
    /**
     * 找出to为当前元素的form，并将form作为to继续查找
     * item: Object 当前元素
     * targets: Array 需要过滤的数据(废弃)
     */
    deepFindToSelf(item) {
      let _parents = item._parents.split(","); // 父祖节点不可选
      let _children = item._all_children.map(i => i._identityId); // 子孙节点不可选
      let _parents_and_children = _children.concat(_parents);
      this.pre_options = this.pre_options.filter(
        i => !_parents_and_children.some(t => t == i._identityId)
      );
      this.self_dependent_store.forEach(i => {
        let _tag = this.preMultiple
          ? i.to.some(t => t[this.selfProps.id] === item[this.selfProps.id])
          : i.to[this.selfProps.id] === item[this.selfProps.id];
        if (_tag) {
          this.pre_options = this.pre_options.filter(
            t => t[this.selfProps.id] !== i.form[this.selfProps.id]
          );
          this.deepFindToSelf(i.form);
        }
      });
    },
    /**
     * 单元格编辑(废弃)
     * key: string 需要操作的单元格key
     * ref：object 需要获取焦点的dom
     */
    /* cellEdit(key, ref) {
      this.self_cell_edit = key;
      this.$nextTick(() => {
        this.$refs[ref].focus();
      });
    }, */
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
        if (_start_day_inweek !== 0) {
          _day = 8 - _start_day_inweek;
        }
        for (let i = _day; i < dates_num; i += 7) {
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
    /**
     * 实际日期gantt状态
     * row: object 当前行信息
     * date: string 当前格子日期
     * unit: string 时间单位，以天、月、年计算
     */
    realDayGanttType(row, date, unit = "days") {
      let start_date = row[this.selfProps.realStartDate];
      let end_date = row[this.selfProps.realEndDate];
      let between = dayjs(date).isBetween(start_date, end_date, unit);
      if (between) {
        return "wl-real-on";
      }
      let start = dayjs(start_date).isSame(date, unit);
      let end = dayjs(end_date).isSame(date, unit);
      if (start && end) {
        return "wl-real-on wl-real-full";
      }
      if (start) {
        return "wl-real-on wl-real-start";
      }
      if (end) {
        return "wl-real-on wl-real-end";
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
      return date ? dayjs(date).format(format) : this.emptyCellText;
    },
    /**
     * 查询时间是周几
     */
    timeInWeek(date) {
      return dayjs(date).day();
    },
    // 以下为输出数据函数 --------------------------------------------------------------输出数据------------------------------------
    // 任务时间更改
    emitTimeChange(item) {
      this.$emit("timeChange", item);
      this.$nextTick(() => {
        this.$set(item, "_oldStartDate", item[this.selfProps.startDate]);
        this.$set(item, "_oldEndDate", item[this.selfProps.endDate]);
      });
    },
    /**
     * 前置任务更改
     * item: Object 发生更改的行数据
     * oldval: [String, Array] 修改前数据
     * handle: Boolean true为操作选择框修改 false为源数据不符合规范的修正更改
     */
    emitPreChange(item, oldval, handle = false) {
      this.$emit("preChange", item, oldval, handle);
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
        // 添加自增id字段及树链组成的parents字段
        this.recordIdentityIdAndParents(i);
        // 处理前置任务
        // this.handlePreTask(i);
        // 如果当前节点的开始时间早于父节点的开始时间，则将开始时间与父节点相同
        this.parentStartDateToChild(i);
        // 校验结束时间是否晚于子节点，如不则将节点结束时间改为最晚子节点
        this.childEndDateToParent(i);
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
    // 处理前置任务节点    /// ---- 此使前置任务校验处理还没开始，因此出错，前置处理后手动调用vue视图更新试试
    handlePreTask(item) {
      // 统一在一维化数据中处理前置任务
      let _pre_target = this.self_dependent_store.find(
        i => i.form[this.selfProps.id] === item[this.selfProps.id]
      );
      if (!_pre_target) return;
      let _pre_end_date = this.preMultiple
        ? getMax(_pre_target.to, this.selfProps.endDate, true) // 取前置点中最晚的结束时间
        : _pre_target.to[this.selfProps.endDate];
      /* 在数据循环中处理前置
      let pres = item[this.selfProps.pre];
      if(!pres) return;
      let _pre_target = null, _pre_end_date = null;
      if(this.preMultiple){
        if(!Array.isArray(pres) || pres.length ===0) return;
        _pre_target = this.self_data_list.filter(i => pres.includes(i[this.selfProps.id]));
        _pre_end_date = getMax(_pre_target, this.selfProps.endDate, true);
      }else{
        _pre_target = this.self_data_list.find(i => i[this.selfProps.id] === pres);
        if(!_pre_target) return;
        _pre_end_date = _pre_target[this.selfProps.endDate]
      } */
      // 查看是否需要根据前置时间，如果不符合规则，更新后置时间
      let _start_early_prvend = this.timeIsBefore(
        item[this.selfProps.startDate],
        _pre_end_date
      );
      if (_start_early_prvend) {
        let _cycle = item._cycle - 1;
        let _to_startDate = this.timeAdd(_pre_end_date, 1);
        let _to_endDate = this.timeAdd(_to_startDate, _cycle);
        this.$set(item, this.selfProps.startDate, _to_startDate);
        this.$set(item, this.selfProps.endDate, _to_endDate);
      }
    },
    /**
     * 检查前置任务合法性
     * ！！已废弃：改为从一维数据列收集form、to并校验，不再在递归中检查 -> handleDependentStore
     */
    checkPreTaskValidity(item) {
      // 没有前置任务退出
      if (!item[this.selfProps.pre]) return false;
      // 多前置任务模式
      if (this.preMultiple) {
        let _pres = item[this.selfProps.pre];
        // 不是数组退出
        if (!Array.isArray(_pres)) {
          this.emitPreChange(item, item[this.selfProps.pre]);
          this.$set(item, this.selfProps.pre, []);
          return false;
        }
        // 数组为空退出
        if (_pres.length === 0) return false;
        // 前置任务有自己时，剔除自己
        let _net_self_pres = _pres.filter(i => i !== item[this.selfProps.id]);
        if (_net_self_pres.length !== _pres.length) {
          this.emitPreChange(item, item[this.selfProps.pre]);
          this.$set(item, this.selfProps.pre, _net_self_pres);
        }
        // 剔除前置任务找不到目标数据的元素
        let _pre_exist = _net_self_pres.filter(i => this.targetInAllData(i));
        if (_pre_exist.length !== _net_self_pres.length) {
          this.emitPreChange(item, item[this.selfProps.pre]);
          this.$set(item, this.selfProps.pre, _pre_exist);
        }
        let _no_par_chi = []; // 声明非父、祖、子、孙节点的盒子
        for (let i of _pre_exist) {
          let _pre_target = this.self_data_list.find(
            t => t[this.selfProps.id] === i
          );
          if (!_pre_target) continue;
          let _pre_par_chi = this.targetInParentsOrChildren(item, _pre_target);
          _pre_par_chi || _no_par_chi.push(i);
        }
        // 前置任务是自己的父祖或子孙节点, 剔除此前置
        if (_no_par_chi.length !== _pre_exist.length) {
          this.emitPreChange(item, item[this.selfProps.pre]);
          this.$set(item, this.selfProps.pre, _no_par_chi);
        }
        // 处理前置任务链链中产生了回环【A->B,B->C,C->D,D->B】即前置链中形成了相互前置的节点，剔除其错误前置数据
        this.targetLinkLoopback(item);
        return true;
      }
      // 单前置任务模式
      if (item[this.selfProps.pre] === item[this.selfProps.id]) {
        this.$set(item, this.selfProps.pre, null);
        return false;
      } // 前置任务是自己退出
      // 找到前置目标节点
      let _pre_target = this.self_data_list.find(
        i => i[this.selfProps.id] == item[this.selfProps.pre]
      );
      // 没找到前置任务节点数据退出
      if (!_pre_target) {
        this.$set(item, this.selfProps.pre, null);
        return false;
      }
      // 前置任务是自己的父祖或子孙节点退出
      let is_pre_standard = this.targetInParentsOrChildren(item, _pre_target);
      if (is_pre_standard) {
        this.$set(item, this.selfProps.pre, null);
        return false;
      }
      // 处理前置任务链链中产生了回环【A->B,B->C,C->D,D->B】即前置链中形成了相互前置的节点，剔除其错误前置数据
      this.targetLinkLoopback(item);
      return true;
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
    /**
     * 查询目标是否在父级链或者全部子集中
     * item 当前节点
     * pre 前置节点
     */
    targetInParentsOrChildren(item, pre) {
      let _parents = item._parents.split(",");
      let _children = item._all_children.map(i => i._identityId);
      return _children.concat(_parents).some(i => i == pre._identityId);
    },
    // 查询目标节点是否在数据中存在,并返回数据
    targetInAllData(target_id) {
      return this.self_data_list.find(i => i[this.selfProps.id] === target_id);
    },
    /**
     * 处理前置任务链链中产生了回环【A->B,B->C,C->D,D->B】即前置链中形成了相互前置的节点，剔除其错误前置数据
     * item: Object 当前节点数据
     * pre_tesk: Array 前置链上所有id
     * ！！已废弃：下方尝试改成form to结构收集起来处理，不再循环中反复循环处理 -> terseTargetLinkLoopback
     */
    targetLinkLoopback(item, pre_tesk = []) {
      pre_tesk.push(item[this.selfProps.id]);
      let _pres = item[this.selfProps.pre];
      if (this.preMultiple) {
        let _legal_pres = _pres.filter(i => !pre_tesk.includes(i));
        if (_legal_pres.length !== _pres.length) {
          this.emitPreChange(item, item[this.selfProps.pre]);
          this.$set(item, this.selfProps.pre, _no_par_chi);
        }
        _legal_pres.forEach(i => {
          let _pre_target = this.self_data_list.find(
            t => t[this.selfProps.id] === i
          );
          if (
            _pre_target &&
            Array.isArray(_pre_target[this.selfProps.pre]) &&
            _pre_target[this.selfProps.pre].length > 0
          ) {
            this.targetLinkLoopback(_pre_target, pre_tesk);
          }
        });
      } else {
        if (pre_tesk.includes(_pres)) {
          this.emitPreChange(item, item[this.selfProps.pre]);
          this.$set(item, this.selfProps.pre, _no_par_chi);
        }
        let _pre_target = this.self_data_list.find(
          t => t[this.selfProps.id] === i
        );
        if (_pre_target) {
          this.targetLinkLoopback(_pre_target, pre_tesk);
        }
      }
    },
    /**
     * 处理前置任务链链中产生了回环【A->B,B->C,C->D,D->B】即前置链中形成了相互前置的节点，剔除其错误前置数据
     * item: Object 当前节点数据
     * flow_pre_tesk: Array 前置链上所有id
     */
    terseTargetLinkLoopback(item, flow_pre_tesk = []) {
      flow_pre_tesk.push(item.form[this.selfProps.id]);
      if (this.preMultiple) {
        let _legal_pre = [], // 收集合法数据
          _next_form = []; // 收集所有前置的前置
        for (let i of item.to) {
          let _to_id = i[this.selfProps.id];
          if (flow_pre_tesk.includes(_to_id)) continue;
          _legal_pre.push(_to_id);
          flow_pre_tesk.push(_to_id);
          let _store_next_form = this.self_dependent_store.filter(
            t => t.form[this.selfProps.id] === _to_id
          );
          _next_form = _next_form.concat(_store_next_form);
        }
        // 剔除不合法前置
        if (_legal_pre.length !== item.to.length) {
          this.emitPreChange(item.form, item.form[this.selfProps.pre]);
          this.$set(item.form, this.selfProps.pre, _legal_pre);
        }
        // 向前置的前置递归
        _next_form.forEach(t => {
          this.terseTargetLinkLoopback(t, flow_pre_tesk);
        });
      } else {
        let _to_id = item.to[this.selfProps.id];
        if (flow_pre_tesk.includes(_to_id)) {
          this.emitPreChange(item.form, item.form[this.selfProps.pre]);
          this.$set(item.form, this.selfProps.pre, null);
          return;
        }
        let _next_form = this.self_dependent_store.find(
          t => t.form[this.selfProps.id] === _to_id
        );
        if (!_next_form) return;
        this.terseTargetLinkLoopback(_next_form, flow_pre_tesk);
      }
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
        // this.handlePreTask(i);
      });
    },
    // 生成前置依赖库, 校验前置合法性并剔除不合法数据
    handleDependentStore() {
      this.self_dependent_store = [];
      // 多选前置模式
      if (this.preMultiple) {
        for (let i of this.self_data_list) {
          let _pres = i[this.selfProps.pre];
          if (!_pres) continue;
          // 不是数组退出
          if (!Array.isArray(_pres)) {
            this.emitPreChange(i, i[this.selfProps.pre]);
            this.$set(i, this.selfProps.pre, []);
            continue;
          }
          // 数组为空退出
          if (_pres.length === 0) continue;
          // 查询不到数据的不收集，是父、祖、子、孙节点的不收集
          let _pre_exist_node = [],
            _pre_exist_id = [];
          for (let t of _pres) {
            let target_node = this.targetInAllData(t);
            if (!target_node) continue; // 查询不到数据的不收集
            let in_per_chi = this.targetInParentsOrChildren(i, target_node);
            if (in_per_chi) continue; // 是父、祖、子、孙节点的不收集
            _pre_exist_node.push(target_node);
            _pre_exist_id.push(target_node[this.selfProps.id]);
          }
          if (_pre_exist_node.length !== _pres.length) {
            this.emitPreChange(i, i[this.selfProps.pre]);
            this.$set(i, this.selfProps.pre, _pre_exist_id);
          }
          this.self_dependent_store.push({
            form: i,
            to: _pre_exist_node
          });
        }
      } else {
        // 单选前置模式
        for (let i of this.self_data_list) {
          if (!i[this.selfProps.pre]) continue;
          let _pre_target = this.targetInAllData(i[this.selfProps.pre]);
          // 处理前置任务找不到的情况
          if (!_pre_target) {
            this.emitPreChange(i, i[this.selfProps.pre]);
            this.$set(i, this.selfProps.pre, null);
            continue;
          }
          // 处理前置任务是父祖子孙节点的情况
          let in_per_chi = this.targetInParentsOrChildren(i, _pre_target);
          if (in_per_chi) {
            this.emitPreChange(i, i[this.selfProps.pre]);
            this.$set(i, this.selfProps.pre, null);
            continue;
          }
          this.self_dependent_store.push({
            form: i,
            to: _pre_target
          });
        }
      }
      // 处理合格前置任务
      this.self_dependent_store.forEach(i => {
        this.terseTargetLinkLoopback(i);
      });
      // 处理前置依赖
      this.self_data_list.forEach(i => {
        this.handlePreTask(i);
      });
      // 暂时强制更新视图
      if (this.update) {
        this.update = false;
        this.selfData.sort();
      }
    },
    // el-table事件----------------------------------------------以下为原el-table事件输出------------------------------------------------
    handleSelectionChange(val) {
      this.$emit("selection-change", val);
      this.multipleSelection = val;
    }, // 当选择项发生变化时会触发该事件
    handleCurrentChange(val, oldVal) {
      this.$emit("current-change", val, oldVal);
      this.currentRow = val;
    }, // 当表格的当前行发生变化的时候会触发该事件
    handleSelectAll(val) {
      this.$emit("select-all", val);
    }, // 当用户手动勾选全选 Checkbox 时触发的事件
    handleSelect(selection, row) {
      this.$emit("select", selection, row);
    }, // 当用户手动勾选全选 Checkbox 时触发的事件
    handleMouseEnter(row, column, cell, event) {
      this.$emit("cell-mouse-enter", row, column, cell, event);
    }, // 当单元格 hover 进入时会触发该事件
    handleMouseLeave(row, column, cell, event) {
      this.$emit("cell-mouse-leave", row, column, cell, event);
    }, // 当单元格 hover 退出时会触发该事件
    handleCellClick(row, column, cell, event) {
      this.$emit("cell-click", row, column, cell, event);
    }, // 当某个单元格被点击时会触发该事件
    handleCellDbClick(row, column, cell, event) {
      this.$emit("cell-dblclick", row, column, cell, event);
    }, // 当某个单元格被双击击时会触发该事件
    handleRowClick(row, column, event) {
      this.$emit("row-click", row, column, event);
    }, // 当某一行被点击时会触发该事件
    handleRowContextMenu(row, column, event) {
      this.$emit("row-contextmenu", row, column, event);
    }, // 当某一行被鼠标右键点击时会触发该事件
    handleRowDbClick(row, column, event) {
      this.preCellEdit(row);
      this.task_edit_form = {
        name: row[this.selfProps.name],
        start_time: row[this.selfProps.startDate],
        end_time: row[this.selfProps.endDate],
        real_start_time: row[this.selfProps.realStartDate],
        real_end_time: row[this.selfProps.realEndDate],
        pre_task: row[this.selfProps.pre]
      }
      this.task_edit_show = true;
      this.edit_row = row;
      this.$emit("row-dblclick", row, column, event);
    }, // 当某一行被双击时会触发该事件
    handleHeaderClick(column, event) {
      this.$emit("header-click", column, event);
    }, // 当某一列的表头被点击时会触发该事件
    handleHeaderContextMenu(column, event) {
      this.$emit("header-contextmenu", column, event);
    }, // 当某一列的表头被鼠标右键点击时触发该事件
    handleSortChange(e) {
      this.$emit("sort-change", e);
    }, // 当表格的排序条件发生变化的时候会触发该事件
    handleFilterChange(filters) {
      this.$emit("filter-change", filters);
    }, // 当表格的筛选条件发生变化的时候会触发该事件
    handleExpandChange(row, expanded) {
      this.$emit("expand-change", row, expanded);
    } // 当表格的筛选条件发生变化的时候会触发该事件
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

  .h-full {
    height: 100%;
  }

  .wl-gantt-item {
    position: relative;
    transition: all 0.3s;
    > .cell {
      padding: 0;
    }
  }

  .u-full, .u-full.el-input {
    width: 100%;
  }

  // 计划时间gantt开始
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
  // 计划时间gantt结束

  // 实际时间gantt开始
  .wl-real-on {
    position: absolute;
    top: 70%;
    left: 0;
    right: -1px;
    z-index: 1;
    margin-top: -$gantt_item_half;
    height: $gantt_item;
    background: #faa792; //rgba(250, 167, 146, .6);
    transition: all 0.4s;
  }
  .wl-real-start {
    left: 50%;
    &:after {
      position: absolute;
      top: $gantt_item;
      left: 0;
      z-index: 2;
      content: "";
      width: 0;
      height: 0;
      border-color: #faa792 transparent transparent;
      border-width: 6px 6px 6px 0;
      border-style: solid;
    }
  }

  .wl-real-end {
    right: 50%;
    &:after {
      position: absolute;
      top: $gantt_item;
      right: 0;
      z-index: 2;
      content: "";
      width: 0;
      height: 0;
      border-color: transparent #faa792;
      border-width: 0 6px 6px 0;
      border-style: solid;
    }
  }

  .wl-real-full {
    left: 0;
    right: 0;
    &:before {
      position: absolute;
      top: $gantt_item;
      left: 0;
      z-index: 2;
      content: "";
      width: 0;
      height: 0;
      border-color: #faa792 transparent transparent;
      border-width: 6px 6px 6px 0;
      border-style: solid;
    }
    &:after {
      position: absolute;
      top: $gantt_item;
      right: 0;
      z-index: 2;
      content: "";
      width: 0;
      height: 0;
      border-color: transparent #faa792;
      border-width: 0 6px 6px 0;
      border-style: solid;
    }
  }
  // 实际时间gantt结束

    // 任务编辑表单区
  .wl-gantt-dialog{
    .el-dialog__body{
      padding: 0 20px;
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
