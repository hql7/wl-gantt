<template>
  <el-table
    border
    row-key="id"
    class="wl-gantt"
    default-expand-all
    :data="selfData"
    header-row-class-name="wl-gantt-header"
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    <el-table-column
      fixed
      prop="name"
      label="名称">
    </el-table-column>
    <el-table-column
      fixed
      width="160"
      prop="startDate"
      label="开始日期">
      <template slot-scope="scope">
        <el-date-picker
          v-model="scope.row.startDate"
          type="date"
          size="medium"
          class="u-full"
          value-format="yyyy-MM-dd"          
          placeholder="请选择开始日期">
        </el-date-picker>
      </template>
    </el-table-column>
    <el-table-column
      fixed
      width="160"
      prop="endDate"
      label="结束日期">
      <template slot-scope="scope">
        <el-date-picker
          v-model="scope.row.endDate"
          type="date"
          size="medium"     
          class="u-full"            
          value-format="yyyy-MM-dd"             
          placeholder="请选择结束日期">
        </el-date-picker>
      </template>
    </el-table-column>
    <el-table-column
      v-for="year in titleDate"
      :key="year.id"
      :label="year.date">
      <el-table-column
        v-for="month in year.children"
        :key="month.id"
        :label="month.date">
        <el-table-column
          class-name="wl-gantt-item"
          v-for="day in month.children"
          width="40"
          :key="day.id"
          :label="day.date">
            <template slot-scope="scope">
              <div :class="dayGanttType(scope.row, day.full_date)"></div>
            </template>
        </el-table-column>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>

<script>
import dayjs from 'dayjs' // 导入日期js
const uuidv4 = require("uuid/v4"); // 导入uuid生成插件
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)

export default {
  name: 'wlGantt',
  data(){
    return {}
  },
  props:{
    // gantt数据
    data:{
      type: Array,
      default: () => {
        return []
      }
    },
    // 日期类型
    dateType:{
      type: String,
      default: 'yearAndDay' // monthAndDay,yearAndMonth,yearAndDay
    },
    // 开始日期
    startDate: [ String, Object],
    endDate: [ String, Object],
  },
  computed: {
    // 第一级日期
    titleDate(){
      // 分解开始和结束日期
      let start_date_spilt = dayjs(this.startDate).format('YYYY-M-D').split('-');
      let end_date_spilt = dayjs(this.endDate).format('YYYY-M-D').split('-');
      let start_year = Number(start_date_spilt[0]);
      let start_mouth = Number(start_date_spilt[1]);
      let start_day = Number(start_date_spilt[2]);
      let end_year = Number(end_date_spilt[0]);
      let end_mouth = Number(end_date_spilt[1]);
      let end_day = Number(end_date_spilt[2]);
      // 日期数据盒子
      let dates = [ {date: `${start_year}年`, id: uuidv4(), children: []} ];
      // 处理年份
      let year_diff = end_year - start_year;
      // 年间隔为同一年
      if(year_diff === 0){
        let mouths = []; // 处理月份
        let isLeap = this.isLeap(start_year);        
        for(let i = start_mouth; i < end_mouth + 1; i++){
          let days = this.generationDays(start_year, i, isLeap);
          mouths.push({date: `${i}月`, id: uuidv4(), children: days});
        }
        dates[0].children = mouths;
        return dates;
      }
      // 处理开始月份
      let start_mouths = [];   
      let startIsLeap = this.isLeap(start_year); 
      for(let i = start_mouth; i < 13; i++){
        let days = this.generationDays(start_year, i, startIsLeap);
        start_mouths.push({date: `${i}月`, id: uuidv4(), children: days});
      }
      // 处理结束月份
      let end_mouths = [];    
      let endIsLeap = this.isLeap(end_year);
      for(let i = 1; i < end_mouth + 1; i++){
        let days = this.generationDays(end_year, i, endIsLeap);        
        end_mouths.push({date: `${i}月`, id: uuidv4(), children: days});
      }
      // 年间隔等于一年
      if( year_diff === 1) {
        dates[0].children = start_mouths;
        dates.push({date: `${end_year}年`, children: end_mouths, id: uuidv4()})
        return dates
      }
      // 年间隔大于1年
      if( year_diff > 1){ 
        for(let i = 1; i < year_diff; i++){
          let item_year = start_year + i;
          let isLeap = this.isLeap(item_year);
          let month_and_day = this.generationMonths(item_year, isLeap);
          dates.push({date: `${item_year}年`, id: uuidv4(), children: month_and_day});
        }
        dates.push({date: `${end_year}年`,  children: end_mouths, id: uuidv4()})
        return dates
      }
    },
    // 数据
    selfData(){
      return this.data
    }
  },
  created() {
    console.log(this.isLeap(2019))
  },
  methods: {
    /**
     * 生成月份函数
     * year: Number 当前年份
     * isLeap: boolean 是否闰年
     */
    generationMonths(year, isLeap){
      let months = [];
      for(let i = 1; i < 13; i++){
        let days = this.generationDays(year, i, isLeap)
        months.push({date: `${i}月`, children: days, id: uuidv4()});
      }
      return months
    },
    /**
     * 生成日期函数
     * year: Number 当前年份
     * month: Number 当前月份
     * isLeap: boolean 是否闰年     
     */
    generationDays(year, month, isLeap){
      let big_month = [1, 3, 5, 7, 8, 10, 12].includes(month);
      let small_month = [4, 6, 9, 11].includes(month);
      let dates_num = big_month 
                      ? 32 
                      : small_month
                        ? 31
                        : isLeap 
                          ? 30: 29;
      let days = [];
      for(let i = 1; i < dates_num; i++){
        days.push({date: `${i}日`, id: uuidv4(), full_date: `${year}-${month}-${i}`});
      }
      return days
    },
    /**
     * 是否闰年函数
     * year: Number 当前年份
     */
    isLeap(year){
      return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
    },
    /**
     * 当前日期gantt状态
     * row: object 当前行信息
     * date: string 当前格子日期
     */
    dayGanttType(row, date){
      let start_date = row.startDate;
      let end_date = row.endDate;
      let between = dayjs(date).isBetween(start_date, end_date, 'date')
      if(between){
        return 'wl-item-on wl-item-between'        
      }
      let start = dayjs(start_date).isSame(date, 'date');
      if(start){
        return 'wl-item-on wl-item-start'
      }
      let end = dayjs(end_date).isSame(date, 'date');
      if(end){
        return 'wl-item-on wl-item-end'
      }
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
$gantt_item: 16px;
$gantt_item_half: 8px;

.wl-gantt{
  .wl-gantt-header > th{
    text-align: center;
  }

  .wl-gantt-item{
    position: relative;
    >.cell{
      padding: 0;
    }
  }
  
  .u-full.el-input{
    width: 100%;
  }

  .wl-item-on{
    position: absolute;
    top: 50%;
    left: 0;
    right: -1px;
    margin-top: -$gantt_item_half;
    height: $gantt_item;
    background: #409EFF;
  }

  .wl-item-start{
    left: 50%;
    &:after{
      position: absolute;
      top: $gantt_item;
      left: 0;
      z-index: 9;
      content: "";
      width: 0;
      height: 0;
      border-color: #409EFF transparent transparent;
      border-width: 6px 6px 6px 0;
      border-style: solid;
    }
  }

  .wl-item-end{
    right: 50%;
    &:after{
      position: absolute;
      top: $gantt_item;
      right: 0;
      z-index: 9;
      content: "";
      width: 0;
      height: 0;
      border-color: transparent #409EFF;
      border-width: 0 6px 6px 0;
      border-style: solid;
    }
  }
}
</style>
