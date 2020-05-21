import FtContextmenu from "./index.vue";

FtContextmenu.install = function (Vue) {
  Vue.component(FtContextmenu.name, FtContextmenu);
};

export default FtContextmenu;