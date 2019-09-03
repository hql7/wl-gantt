<template>
  <div id="app">
    <img src="./assets/logo.png">
    <div class="wl-gantt-demo">
      <wlGantt
        :data="data" 
        start-date="2019-3-02" 
        end-date="2019-11-24">
      </wlGantt>  
    </div>
  </div>
</template>

<script>
import wlGantt from './components/gantt.vue'

export default {
  name: 'app',
  data(){
    return {
      data: [
        {
          id: 1,
          name: "旅行",
          startDate: "2019-09-07",
          endDate: '2019-09-09'
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
