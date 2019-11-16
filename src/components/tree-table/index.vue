<template>
  <!-- 初级树表组件 -->
  <div>
    <table class="wl-tree-table">
      <!-- 表头 -->
      <tr class="wl-theader">
        <th class="wl-th" v-for="(item, index ) of columns" :key="'node_th'+index" :style="{minWidth:item.width}">
          {{item.name}}
        </th>
      </tr>
    </table>
    <!-- 表格 -->
    <div class="wl-tbox" :style="{maxHeight:height}">
      <div v-if='wlData.length == 0' class="wl-empty-box">{{emptyText}}</div>
      <tree-item v-else v-for="(item ,index) of wlData" :key="'box_'+index" :row-item="item" :props="props"></tree-item>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    // 表头数据
    columns: {
      type: Array,
      required: true
    },
    // 表格数据
    data: {
      type: Array,
      default: () => []
    },
    // 空数据提示语
    emptyText: {
      type: String,
      default: "暂无数据"
    },
    // 表格高度 用于固定表头
    height: {
      type: String
    },
    props: Object
  },
  computed: {
    wlData() {
      return this.data;
    }
  },
  components: {
    treeItem: () => import("./item.vue")
  }
};
</script>

<style lang='scss'>
table {
  table-layout: fixed;
}
.wl-tree-table {
  width: 100%;

  .wl-td {
    padding: 12px 10px;
  }
}

// 表头区
.wl-theader {
  border: {
    top: 1px solid #ebeef5;
    bottom: 1px solid #ebeef5;
  }
  background-color: #fafafa;
  > .wl-th {
    font-size: 14px;
    font-weight: 700;
    color: #333;
    padding: 12px 10px;
    cursor: default;
  }
}

// 表格区
.wl-tbox {
  overflow: auto;

  > .wl-empty-box {
    padding: 20px;
    text-align: center;
    color: #999;
    border-bottom: 1px solid #ebeef5;
  }
}
</style>
