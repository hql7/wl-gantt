<template>
  <div id="app">
    <img src="./assets/logo.png">
    <div class="wl-gantt-demo">
      <wlGantt start-date="2018-09-02" end-date="2019-02-24"/>
    </div>
  </div>
</template>

<script>
import wlGantt from './components/gantt.vue'

export default {
  name: 'app',
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
