<template>
  <el-table
    border
    row-key="id"
    class="wl-gantt"
    default-expand-all
    :data="tableData"
    header-row-class-name="wl-gantt-header"
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    <el-table-column
      fixed
      prop="name"
      label="名称">
    </el-table-column>
    <el-table-column
      prop="startDate"
      fixed
      label="开始日期">
      <template slot-scope="scope">
        <el-date-picker
          v-model="scope.row.startDate"
          type="date"
          size="medium"
          class="u-full"
          placeholder="请选择开始日期">
        </el-date-picker>
      </template>
    </el-table-column>
    <el-table-column
      prop="endDate"
      fixed
      label="结束日期">
      <template slot-scope="scope">
        <el-date-picker
          v-model="scope.row.endDate"
          type="date"
          size="medium"     
          class="u-full"               
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
          v-for="day in month.children"
          width="40"
          :key="day.id"
          :label="day.date">
        </el-table-column>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>

<script>
import dayjs from 'dayjs' // 导入日期js
const uuidv4 = require("uuid/v4"); // 导入uuid生成插件

export default {
  name: 'wlGantt',
  data(){
    return {
      tableData: [{
          id: 1,
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          id: 2,
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          id: 3,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          children: [{
              id: 31,
              date: '2016-05-01',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1519 弄'
            }, {
              id: 32,
              date: '2016-05-01',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1519 弄'
          }]
        }, {
          id: 4,
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        tableData1: [{
          id: 1,
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          id: 2,
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          id: 3,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          hasChildren: true
        }, {
          id: 4,
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
    }
  },
  props:{
    // 日期类型
    dateType:{
      type: String,
      default: 'yearAndDay' // monthAndDay,yearAndMonth,yearAndDay
    },
    // 开始日期
    startDate:[ String, Object],
    endDate:[ String, Object],
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
          let days = this.generationDays(i, isLeap);
          mouths.push({date: `${i}月`, id: uuidv4(), children: days});
        }
        dates[0].children = mouths;
        return dates;
      }
      // 处理开始月份
      let start_mouths = [];   
      let startIsLeap = this.isLeap(start_year); 
      for(let i = start_mouth; i < 13; i++){
        let days = this.generationDays(i, startIsLeap);
        start_mouths.push({date: `${i}月`, id: uuidv4(), children: days});
      }
      // 处理结束月份
      let end_mouths = [];    
      let endIsLeap = this.isLeap(end_year);
      for(let i = 1; i < end_mouth + 1; i++){
        let days = this.generationDays(i, endIsLeap);        
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
          let month_and_day = this.generationMonths(isLeap);
          dates.push({date: `${item_year}年`, id: uuidv4(), children: month_and_day});
        }
        dates.push({date: `${end_year}年`,  children: end_mouths, id: uuidv4()})
        return dates
      }
    }
  },
  methods: {
    // 生成月份函数
    generationMonths(isLeap){
      let months = [];
      for(let i = 1; i < 13; i++){
        let days = this.generationDays(i, isLeap)
        months.push({date: `${i}月`, children: days, id: uuidv4()});
      }
      return months
    },
    // 生成日期函数
    generationDays(month, isLeap){
      let big_month = [1, 3, 5, 7, 8, 10, 12].includes(month);
      let small_month = [4, 6, 9, 11].includes(month);
      let dates_num = big_month 
                      ? 31 
                      : small_month
                        ? 30
                        : isLeap 
                          ? 29: 28;
      let days = [];
      for(let i = 1; i < dates_num; i++){
        days.push({date: `${i}日`, id: uuidv4()});
      }
      return days
    },
    // 是否闰年函数
    isLeap(year){
      return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.wl-gantt{
  .wl-gantt-header > th{
    text-align: center;
  }

  .u-full.el-input{
    width: 100%;
  }
}
</style>
