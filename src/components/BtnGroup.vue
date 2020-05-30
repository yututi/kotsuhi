<template>
  <div class="btn-group">
    <slot />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class BtnGroup extends Vue {}
</script>
<style lang="scss">
@import "@/styles/theme.scss";
.btn-group {
  display: flex;
  .btn {
    border-left: 0px;

    &:first-child:not(:last-child) {
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
      border-left: 1px;
    }
    &:not(:first-child) {
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
    }
    &:not(:last-child) {
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
    }
    &:last-child:not(:first-child) {
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
    }
  }
}
@each $name, $theme in $themes {
  .btn-group {
    .btn.k-theme--#{$name}:first-child {
      border-left: 1px solid map-get($theme, "bgColor");
    }
  }
}
</style>