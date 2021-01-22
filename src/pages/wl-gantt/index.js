import WlGantt from "./index.vue";

WlGantt.install = function(Vue) {
  Vue.component(WlGantt.name, WlGantt);
};

export default WlGantt;
