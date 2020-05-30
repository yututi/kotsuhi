<template>
  <transition name="fade">
    <div :class="modalCls" v-if="show" class="k-modal" @click="onclick($event)">
      <div class="k-modal__dialog k-dialog k-shadow" :class="dialogClasses" @click.stop>
        <div v-if="_header" class="k-dialog__header" :class="headerClasses">
          <span class="k-dialog__header-title">{{_title}}</span>
          <fa-icon class="k-icon" icon="times-circle" @click="onclick($event)" />
        </div>
        <div class="k-dialog__body">
          <slot :name="_slotName" />
        </div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import Themeable from "@/components/mixins/themeable";
import { ModalConfig } from "@/types";
const DefaultModalConfig: ModalConfig = {
  show: true,
  slot: "default",
  header: true
};
@Component
export default class Modal extends Mixins(Themeable) {
  @Prop({ type: Boolean, default: false })
  value!: boolean;

  openedByFunc: boolean = false;

  option: ModalConfig = { };

  @Prop({ type: String, default: "default" })
  slotName!: string;

  @Prop({ type: String, default: "" })
  title!: string;

  @Prop({ type: Boolean, default: true })
  expandOnSp!: boolean;

  @Prop({ type: Boolean, default: true })
  header!: boolean;

  get _slotName() {
    return this.openedByFunc ? this.option.slot : this.slotName;
  }

  get _expandOnSp() {
    return this.openedByFunc ? this.option.expandOnSp : this.expandOnSp;
  }

  get _title() {
    return this.openedByFunc ? this.option.title : this.title;
  }

  get _header() {
    return this.openedByFunc ? this.option.header : this.header;
  }

  get show() {
    return this.value;
  }

  set show(value) {
    if (!value) {
      this.openedByFunc = false;
    }
    this.$emit("input", value);
  }

  get modalCls() {
    return {
      "k-modal--show": !!this.value
    };
  }

  get dialogClasses() {
    return {
      "k-dialog--expand-on-sp": this._expandOnSp
    };
  }

  get headerClasses() {
    return {
      ...this.themeClasses
    };
  }

  openDialog(options: ModalConfig) {
    this.openedByFunc = true;
    this.option = {
      ...DefaultModalConfig,
      ...options
    };
    this.show = true;
  }

  onclick(e: any) {
    this.show = false;
  }
}
</script>
<style lang="scss">
@import "../styles/base.scss";
.k-modal {
  position: fixed;
  display: flex;
  top: 0px;
  left: 0px;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.2);
  opacity: 1;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.k-dialog {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 5px;
  overflow: hidden;

  &__header {
    display: flex;
    align-items: center;
    padding: 10px;
    color: white;
  }
  &__header-title {
    flex: 1;
  }

  &__body {
    flex: 1;
    padding: 10px;
  }

  &--expand-on-sp {
    @include sp {
      width: calc(100% - 10px);
    }
  }
}
.k-icon {
  &:hover {
    cursor: pointer;
  }
}
</style>