<template>
  <div id="app">
    <img src="./assets/logo.png" />
    <div class="wl-gantt-demo">
      <wlGantt
        ref="wl-gantt-demo"
        use-real-time
        end-date="2019-11-02"
        start-date="2019-9-06"
        date-type="monthAndDay"
        :data="data"
        :columns="columns"
        :contextMenuOptions="contextMenuOptions"
        @selection-change="selectionChange"
        @expand-change="expandChange"
        @timeChange="timeChange"
        @taskRemove="taskRemove"
        @preChange="preChange"
        @taskAdd="taskAdd"
      >
        <template slot="prv">
          <!-- <el-table-column type="selection" width="55" align="center"> </el-table-column> -->
          <el-table-column type="index" width="55" label="序号"> </el-table-column>
        </template>
        <template #info-card="{ row }">
          <ul>
            <li>
              <label for="name">名称：</label><span id="name">{{ row.name }}</span>
            </li>
          </ul>
        </template>
      </wlGantt>
    </div>
  </div>
</template>

<script>
import WlGantt from "@/pages/wl-gantt";

export default {
  name: "app",
  data() {
    return {
      projectTime: {},
      data: [
        {
          id: "1",
          pid: "0",
          name: "旅行",
          startDate: "2019-09-07",
          realStartDate: "2019-09-10",
          endDate: "2019-10-31",
          realEndDate: "2019-10-19",
          children: [
            {
              id: "1-1",
              pid: "1",
              name: "云台之间",
              startDate: "2019-09-10",
              endDate: "2019-09-13",
              children: [
                {
                  id: "1-1-1",
                  pid: "1-1",
                  name: "日落云巅",
                  startDate: "2019-09-10",
                  endDate: "2019-09-13",
                },
              ],
            },
            {
              id: "1-2",
              pid: "1",
              name: "天空之镜",
              startDate: "2019-09-17",
              endDate: "2019-09-22",
            },
            {
              id: "1-3",
              name: "蓬莱之岛",
              pid: "1",
              startDate: "2019-09-25",
              endDate: "2019-09-30",
            },
            {
              id: "1-4",
              pid: "1",
              name: "西塘之南",
              startDate: "2019-10-03",
              endDate: "2019-10-07",
            },
            {
              pid: "1",
              id: "1-5",
              name: "凤凰之缘",
              startDate: "2019-10-11",
              endDate: "2019-10-19",
            },
          ],
        },
        {
          id: "2",
          name: "租房子",
          startDate: "2019-09-20",
          endDate: "2019-10-31",
        },
      ], // 数据
      selected: [], // 选中数据
      contextMenuOptions: [
        { label: "任务名称", prop: "name" },
        { label: "开始时间", prop: "startDate" },
        { label: "结束时间", prop: "endDate" },
      ],
      columns: [{ type: "name", minWidth: 200, colType: "expand" }], // 可通过此参数配置列。其中内置有名称name、开始日期startDate、结束日期endDate、前置任务preTask，如果cloumns中有type等于这四个且slot为false时，将使用内置代码，当然除了内容使用内置代码，其他字段你还拥有配置权。另外如果不是为了配置内置列参数，slot中的prv和default仍可以用来自定义列
    };
  },
  methods: {
    aa(row) {
      console.log(row, 99);
    },
    /**
     * 时间发生更改
     * row: Object 当前行数据c
     */
    timeChange(row) {
      console.log("时间修改:", row);
    },
    //
    /**
     * 前置任务发生更改
     * row: Object 当前行数据
     * oldval: [String, Array] 前置修改前的旧数据
     * handle: Boolean 是否用户编辑产生的改变
     */
    preChange(row, oldval, handle) {
      console.log("前置修改:", row, oldval, handle);
    },
    // 数表展开行
    expandChange(row, expanded) {
      console.log("展开行:", row, expanded);
    },
    // 多选选择
    selectionChange(/* val */) {
      // console.log("多选：", val);
    },
    // 删除任务
    taskRemove(item) {
      console.log("删除任务：", item);
    },
    // 添加任务
    taskAdd(item) {
      console.log("添加任务：", item);
      // 非懒加载方式直接设置子数据
      /* this.$set(
        item,
        "children",
        item.children.concat([
          {
            pid: item.id,
            id: "###",
            name: "一轮新月",
            startDate: "2019-10-11",
            endDate: "2019-10-19"
          }
        ])
      ); */
      this.$refs["wl-gantt-demo"].loadTreeAdd(item.id, [
        {
          pid: item.id,
          id: "###",
          name: "一轮新月",
          startDate: "2019-10-11",
          endDate: "2019-10-19",
        },
      ]);
    },
    // 懒加载
    lazyLoad(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve([
          {
            id: "1-1-1",
            pid: tree.id,
            name: "日落云巅",
            startDate: "2019-09-10",
            endDate: "2019-09-13",
          },
        ]);
      }, 1000);
    },
  },
  components: {
    WlGantt,
  },
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 20px 25px 0;
}

.wl-gantt-demo {
  margin: 40px auto;
  // width: 800px;
}
</style>
