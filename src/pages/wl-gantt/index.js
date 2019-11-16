import wlGantt from "./index.vue";

wlGantt.install = function(Vue) {
  Vue.component(wlGantt.name, wlGantt);
};

export default wlGantt;
