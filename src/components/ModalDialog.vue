<template>
  <app-modal v-model="show">
    <div class="k-dialog k-shadow" :class="dialogClasses" @click.stop>
      <div v-if="_header" class="k-dialog__header" :class="headerClasses">
        <span class="k-dialog__header-title">{{_title}}</span>
        <fa-icon class="k-icon" icon="times-circle" @click="onclick($event)" />
      </div>
      <div class="k-dialog__body">
        <slot :name="_slotName" v-bind:on="{ok, cancel}" v-bind:other="_other" />
      </div>
    </div>
  </app-modal>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import Themeable from "@/components/mixins/themeable";
import AppModal from "@/components/Modal.vue";
import { ModalConfig } from "@/types";
const DefaultModalConfig: ModalConfig = {
  show: true,
  slot: "default",
  header: true
};

@Component({
  components: {
    AppModal
  }
})
export default class Dialog extends Mixins(Themeable) {
  @Prop({ type: Boolean, default: false })
  value!: boolean;

  openedByFunc: boolean = false;

  option: ModalConfig = {};

  @Prop({ type: String, default: "default" })
  slotName!: string;

  @Prop({ type: String, default: "" })
  title!: string;

  @Prop({ type: Boolean, default: true })
  expandOnSp!: boolean;

  @Prop({ type: Boolean, default: true })
  header!: boolean;

  @Prop()
  other!: any

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

  get _other() {
    return this.openedByFunc ? this.option.other : this.other
  }

  set show(value) {
    if (!value) {
      if (this.openedByFunc) {
        this.cancel();
      }
      this.openedByFunc = false;
    }
    this.$emit("input", value);
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

  callback?: Function | null;
  ok() {
    if (!this.callback) return;
    this.callback(true);
    this.callback = null;
    this.show = false;
  }
  cancel() {
    if (!this.callback) return;
    this.callback(false);
    this.callback = null;
    this.show = false;
  }

  openDialog(options: ModalConfig): Promise<boolean> {
    this.openedByFunc = true;
    this.option = {
      ...DefaultModalConfig,
      ...options
    };
    this.show = true;
    return new Promise((resolve, reject) => {
      this.callback = resolve;
    });
  }

  onclick(e: any) {
    this.show = false;
  }
}
</script>
<style lang="scss">
@import "../styles/base.scss";

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