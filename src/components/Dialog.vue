<template>
  <transition :name="anim">
    <div class="k-dialog k-shadow" :class="dialogClasses">
      <div v-if="header" class="k-dialog__header" :class="headerClasses">
        <span class="k-dialog__header-title">{{title}}</span>
        <fa-icon class="k-icon" icon="times-circle" @click="onclick($event)" />
      </div>
      <div class="k-dialog__body">
        <slot :name="value" />
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import Themeable from "@/components/mixins/themeable";

@Component
export default class Dialog extends Mixins(Themeable) {
  @Prop({ type: String, required: false, default: "no title" })
  title!: string;

  @Prop({ type: String, default: "" })
  value!: string;

  @Prop({ type: Boolean, default: true })
  expandOnSp!: boolean;

  @Prop({ type: Boolean, default: true })
  header!: boolean;

  @Prop({ type: String, default: "fade" })
  anim!: string;

  get dialogClasses() {
    return {
      "k-dialog--expand-on-sp": this.expandOnSp
    };
  }

  get headerClasses() {
    return {
      ...this.themeClasses
    };
  }

  onclick(e: any) {
    this.$emit("onClose", e);
  }
}
</script>
<style lang="scss">
@import "../styles/base.scss";

.k-dialog {
  box-sizing: border-box;
  min-width: 300px;
  width: 70%;
  max-width: 400px;
  opacity: initial;

  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 5px;
  overflow: hidden;

  &__header {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #3367d6;
    color: white;
  }
  &__header-title {
    flex: 1;
  }

  &__body {
    flex: 1;
    padding: 10px;
  }
}
.k-icon {
  &:hover {
    cursor: pointer;
  }
}
</style>