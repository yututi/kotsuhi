<template>
  <div class="k-layout">
    <header class="k-layout__header" :class="headerClasses">
      <span class="k-layout__title">交通費精算</span>
      <div class="k-layout__btns">
        <slot name="header-btns" />
      </div>
    </header>
    <div class="k-layout__body">
      <slot name="body" />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import Btn from "@/components/Btn.vue";
import Themeable from "@/components/mixins/themeable";

@Component({
  components: {
    Btn
  }
})
export default class Layout extends Mixins(Themeable) {
  @Prop({ type: String, required: false, default: "" })
  label!: string;

  hasMenu!: boolean;

  get headerClasses() {
    return {
      ...this.themeClasses
    };
  }

  onclick(e: any) {
    this.$emit("click", e);
  }

  mounted() {
    this.hasMenu = !!this.$slots.menu;
  }
}
</script>
<style lang="scss">
.k-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  &__header {
    padding: 10px;
    align-items: center;
    display: flex;
    border-bottom: 1px solid gainsboro;
    border: 1px solid transparent;
    box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.2),
      0 3px 3px -2px rgba(0, 0, 0, 0.14), 0 1px 8px 0 rgba(0, 0, 0, 0.12);
    z-index: 1;
  }

  &__title {
    flex: 1;
    font-size: 26px;
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    position: relative;
  }

  &__menu {
    position: sticky;
    top: 0px;
  }
}
</style>