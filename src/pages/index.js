import WlGantt from "./wl-gantt/index.js";

const components = [WlGantt];

const install = function (Vue) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  WlGantt,
};
