<template>
  <div class="ui-component-group">
    <div class="ui-component-group-title">{{ title }}</div>
    <div class="ui-component-group-body">
      <div class="ui-component-group-line"></div>
      <div class="ui-component-group-content">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "component-group",
  props: {
    title: {
      type: String,
      default: "",
    },
  },
};
</script>
<style >
.ui-component-group {
}

.ui-component-group-title {
  font-size: 14px;
  font-weight: 400;
  color: #aaaaaa;
}

.ui-component-group-body {
  display: flex;
}

.ui-component-group-line {
  background-color: lightgrey;
  width: 1px;
  margin-left: 5px;
  margin-top: 5px;
}

.ui-component-group-content {
  margin-left: 10px;
  width: 100%;
}
</style>
