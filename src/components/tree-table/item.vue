<template>
  <div>
    <table class="wl-tree-table">
      <tr>
        <td class="wl-td" v-for="(vlaue,key) in rowItem" v-if="key != 'children'" :key="'item_'+key">
          <slot :todo="rowItem">
            {{vlaue}}
          </slot>
        </td>
      </tr>
    </table>
    <tree-item v-if='rowItem.children && rowItem.children.length > 0' v-for="(item,index) of rowItem.children" :key="'child_node'+index" :row-item='item'>
    </tree-item>
  </div>
</template>

<script>
export default {
  name: "treeItem",
  props: {
    rowItem: Object
  }
};
</script>
