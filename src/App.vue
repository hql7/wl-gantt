<template>
  <div id="app">
    <img src="./assets/logo.png">
    <div class="wl-gantt-demo">
      <wlGantt
        :data="data" 
        start-date="2019-9-02" 
        end-date="2020-11-24"
        @row-change="rowChange"
        >
      </wlGantt>  
    </div>
  </div>
</template>

<script>
import wlGantt from './components/gantt.vue'
// import wlGantt from '@/pages/wl-gantt'

export default {
  name: 'app',
  data(){
    return {
      data: [
        {
          id: 1,
          name: "旅行",
          startDate: "2019-09-07",
          endDate: '2020-09-09',
          children: [
            {
              id: '1-1',
              name: '云台之间',
              startDate: "2019-09-07",
              endDate: '2019-09-09',
            },
            {
              id: '1-2',
              name: '天空之镜',
              startDate: "2019-09-28",
              endDate: '2019-10-02',
            },
            {
              id: '1-3',
              name: '蓬莱之岛',
              startDate: "2019-10-20",
              endDate: '2019-11-10',
            },
            {
              id: '1-4',
              name: '西塘之南',
              startDate: "2019-12-02",
              endDate: '2019-12-07',
            },
            {
              id: '1-5',
              name: '凤凰之缘',
              startDate: "2020-01-01",
              endDate: '2020-01-10',
            },
          ]
        },
        {
          id: 2,
          name: "租房子",
          startDate: "2019-09-20",
          endDate: '2019-12-31'
        }
      ]
    }
  },
  methods: {
    rowChange(row){
      // console.log(row)
    }
  },
  components: {
    wlGantt
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 25px;
}

.wl-gantt-demo{
  margin: 50px auto;
  // width: 800px;
}
</style>
