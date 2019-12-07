<template>
  <div id="app">
    <img src="./assets/logo.png" />
    <div class="wl-gantt-demo">
      <wlGantt
        default-expand-all
        :data="data"
        date-type="monthAndDay"
        start-date="2019-9-02"
        end-date="2020-11-24"
        @timeChange="timeChange"
        @preChange="preChange"
        @expand-change="expandChange"
      ></wlGantt>
    </div>
  </div>
</template>

<script>
import wlGantt from "./components/gantt.vue";
// import wlGantt from '@/pages/wl-gantt'

export default {
  name: "app",
  data() {
    return {
      data: [
        {
          id: '1',
          pid: '0',
          name: "旅行",
          startDate: "2019-09-07",
          endDate: "2019-09-09",
          children: [
            {
              id: "1-1",
              pid: '1',
              name: "云台之间云台之间云台之间云台之间云台之间云台之间云台之间",
              pre: ["1-1-1"],
              startDate: "2019-09-01",
              endDate: "2019-09-09",
              children: [
                {
                  id: "1-1-1",
                  pid: "1-1",
                  name: "日落云巅",
                  pre: ["1-3"],
                  startDate: "2019-09-01",
                  endDate: "2019-09-09"
                }
              ]
            },
            {
              id: "1-2",
              pid: '1',
              pre: ["1-1-1"],
              name: "天空之镜",
              startDate: "2019-09-08",
              endDate: "2019-10-02"
            },
            {
              id: "1-3",
              name: "蓬莱之岛",
              pid: '1',
              startDate: "2019-10-20",
              endDate: "2019-11-10"
            },
            {
              id: "1-4",
              pid: '1',
              name: "西塘之南",
              startDate: "2019-10-30",
              endDate: "2019-11-02"
            },
            {
              pid: '1',
              id: "1-5",
              name: "凤凰之缘",
              startDate: "2020-01-01",
              endDate: "2020-01-10"
            }
          ]
        },
        {
          id: '2',
          name: "租房子",
          startDate: "2019-09-20",
          endDate: "2019-12-31"
        }
      ]
    };
  },
  methods: {
    /**
     * 时间发生更改
     * row: Object 当前行数据c
     */
    timeChange(row) {
      // console.log(row);
    },
    // 
    /**
     * 前置任务发生更改
     * row: Object 当前行数据
     * oldval: [String, Array] 前置修改前的旧数据
     * handle: Boolean 是否用户编辑产生的改变
     */
    preChange(row, oldval, handle){
      // console.log(row, oldval, handle);
    },
    // 数表展开行
    expandChange(row, expanded){
      // console.log(row, expanded)
    },
  },
  components: {
    wlGantt
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 20px 25px 0;
}

.wl-gantt-demo {
  margin: 40px auto;
  // width: 800px;
}
</style>
