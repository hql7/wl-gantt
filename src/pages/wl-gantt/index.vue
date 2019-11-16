<template>
  <div class="vue-fast-table" ref="table" v-bind:class="scrollDirection">
    <div class="table-head">
      <div
        class="module"
        v-bind:style="{ transform: 'translateX(' + scrollLeft + 'px)' }"
        v-for="(item, index) in monthData"
        v-bind:key="index"
      >
        <table cellspacing="0" cellpadding="0">
          <thead>
            <tr>
              <td colspan="30">{{item.month}}</td>
            </tr>
            <tr>
              <td
                width="100"
                v-for="(d_item, d_index) in item.days"
                v-bind:key="d_index"
                style="min-width:100px"
              >{{d_item}}</td>
            </tr>
          </thead>
        </table>
      </div>
    </div>
    <div class="table-body" @scroll="tableScroll" style="height: 300px">
      <div
        class="module"
        style="width:3000px;"
        v-for="(item, index) in monthData"
        v-bind:key="index"
      >
        <div class="content" v-if="Math.abs(index - curModule)  < 3">
          <div
            class="row"
            style="height:30px"
            v-for="(p_item, p_index) in projectData"
            v-bind:key="p_index"
          >
            <table
              width="3000"
              v-if="Math.abs(p_index - curRow)  < 10"
              cellspacing="0"
              cellpadding="0"
            >
              <tbody>
                <tr>
                  <td
                    @click="clickTd(p_index,item.month, d_item, $event)"
                    v-for="(d_item, d_index) in item.days"
                    v-bind:key="d_index"
                  >
                    <span
                      v-if="!originProjectData[p_index][''+item.month][''+d_item]['show']"
                    >{{originProjectData[p_index][''+item.month][''+d_item]['last']}}</span>
                    <input
                      @blur="blurTd(p_index,item.month, d_item)"
                      v-if="originProjectData[p_index][''+item.month][''+d_item]['show']"
                      v-model="originProjectData[p_index][''+item.month][''+d_item]['last']"
                      v-focus="originProjectData[p_index][''+item.month][''+d_item]['focus']"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="table-fix-cloumns">
      <div class="module fix-left-top">
        <table width="100" cellspacing="0" cellpadding="0">
          <thead>
            <tr>
              <td>位置</td>
            </tr>
            <tr>
              <td>position</td>
            </tr>
          </thead>
        </table>
      </div>
      <div class="module" v-bind:style="{ transform: 'translateY(' + scrollTop + 'px)' }">
        <table width="100" cellspacing="0" cellpadding="0">
          <thead>
            <tr v-for="(item, index) in projectData" v-bind:key="index">
              <td>{{item.name}}</td>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "vueFastTable",
  components: {},
  data() {
    return {
      scrollLeft: 0,
      scrollTop: 0,
      scrollDirection: "",
      monthArray: [],
      projectArray: [],
      curModule: 0,
      curRow: 0,
      originProjectData: [],
      projectData: [],
      monthData: [],
      options: {
        rowHeight: 30,
        colWidth: 100
      }
    };
  },
  methods: {
    tableScroll(e) {
      const scrollLeft = e.target.scrollLeft;
      const scrollTop = e.target.scrollTop;
      if (scrollLeft == this.scrollLeft) {
        this.scrollDirection = "vertical";
      } else {
        this.scrollDirection = "horizontal";
      }
      this.curModule = parseInt(scrollLeft / 3000);
      this.curRow = parseInt(scrollTop / 30);
      this.scrollLeft = -scrollLeft;
      this.scrollTop = -scrollTop;
    },
    clickTd(p_index, month, d_index, e) {
      this.originProjectData[p_index]["" + month]["" + d_index]["show"] = true;
      this.originProjectData[p_index]["" + month]["" + d_index]["focus"] = true;
    },
    blurTd(p_index, month, d_index) {
      this.originProjectData[p_index]["" + month]["" + d_index]["show"] = false;
      this.originProjectData[p_index]["" + month]["" + d_index][
        "focus"
      ] = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.vue-fast-table {
  overflow: hidden;
  position: relative;
  td {
    background: #fff;
    height: 30px;
  }
  &.vertical {
    .table-head {
      z-index: 1;
    }
  }
  input {
    width: 50px;
    height: 16px;
    box-sizing: border-box;
  }
}
.table-head {
  position: relative;
  display: -webkit-box;
  margin-left: 100px;
  .module {
    td {
      width: 100px;
      text-align: center;
      border: 1px solid #ccc;
      box-sizing: border-box;
    }
  }
}
.table-body {
  display: -webkit-box;
  overflow: auto;
  height: 160px;
  margin-left: 100px;
  .module {
    td {
      width: 100px;
      text-align: center;
      border: 1px solid #ccc;
      box-sizing: border-box;
    }
  }
}
.table-fix-cloumns {
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  padding-top: 60px;
  .module {
    td {
      width: 100px;
      height: 30px;
      text-align: center;
      border: 1px solid #ccc;
      box-sizing: border-box;
    }
  }
  .fix-left-top {
    position: absolute;
    top: 0;
    left: 0;
    width: 100px;
    height: 40px;
    z-index: 1;
  }
}
input {
  // display: none;
}
</style>
