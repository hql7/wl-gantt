<template>
  <div class="ft-context-menu" v-if="flag" :style="style">
    <ul class="menu-liet" v-if="useDefault">
      <li
        class="menu-item"
        v-for="(item, index) of menuList"
        :key="index"
        @click="handleMenuItem(item)"
      >
        <div class="memu-item-icon" :class="item.icon"></div>
        <div class="memu-item-title">{{item.label}}</div>
        <div class="memu-item-value">{{item.value}}</div>
      </li>
      <li class="menu-item" v-if="menuList.length === 0" @click="flag = false">
        <span class="memu-item-title">暂无菜单</span>
      </li>
    </ul>
    <slot />
  </div>
</template>

<script>
export default {
  name: "ft-contextmenu",
  props: {
    visible: {
      type: Boolean,
      default: false
    }, // 是否打开上下文菜单
    x: {
      type: Number,
      default: 0
    }, // 菜单打开坐标x轴
    y: {
      type: Number,
      default: 0
    }, // 菜单打开坐标y轴
    useDefault: {
      type: Boolean,
      default: true
    }, // 是否使用内置菜单样式
    menuList: {
      type: Array,
      default: () => []
    } // 使用内置菜单样式是，菜单列表
  },
  computed: {
    flag: {
      get() {
        if (this.visible) {
          // 注册全局监听事件 [ 目前只考虑鼠标解除触发 ]
          window.addEventListener("mousedown", this.watchContextmenu);
        }
        return this.visible;
      },
      set(newVal) {
        this.$emit("update:visible", newVal);
      }
    },
    style() {
      return {
        left: this.x + "px",
        top: this.y + "px",
        display: this.visible ? "block" : "none "
      };
    }
  },
  methods: {
    // 菜单点击事件
    handleMenuItem(item) {
      this.$emit("rowClick", item);
    },
    watchContextmenu(event) {
      if (!this.$el.contains(event.target) || event.button !== 0)
        this.flag = false;
      window.removeEventListener("mousedown", this.watchContextmenu);
      return false;
    }
  },
  mounted() {
    // 将菜单放置到body下
    document.querySelector("body").appendChild(this.$el);
  }
};
</script>

<style lang="scss">
.ft-context-menu {
  position: absolute;
  padding: 5px 0;
  z-index: 2018;
  background: #fff;
  border: 1px solid #cfd7e5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .menu-liet {
    min-width: 260px;
  }
  .menu-item {
    display: flex;
    padding: 8px 20px 8px 15px;
    margin: 0;
    font-size: 14px;
    color: #606266;
    cursor: pointer;
    &:hover {
      background: #ecf5ff;
      color: #66b1ff;
    }
    .memu-item-icon {
      font-size: 16px;
      font-weight: 600;
    }
    .memu-item-title {
      width: 80px;
      margin-left: 10px;
    }
    .memu-item-value {
      flex: 1;
    }
  }
}
</style>
