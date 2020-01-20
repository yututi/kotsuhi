<template>
  <div :class="modalCls" class="k-modal" @click="onclick($event)">
    <div class="k-modal__dialog k-dialog k-shadow" @click.stop>
      <div class="k-dialog__header">
        <span class="k-dialog__header-title">{{title}}</span>
        <fa-icon class="k-icon" icon="times-circle" @click="onclick($event)" />
      </div>
      <div class="k-dialog__body">
        <slot name="body" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Modal extends Vue {
  @Prop({ type: String, required: false, default: "no title" })
  title!: string;

  @Prop({ type: Boolean, default: false })
  value!: boolean;

  get show() {
    return this.value;
  }

  set show(value) {
    this.$emit("input", value);
  }

  get modalCls() {
    return {
      "k-modal--show": this.value
    };
  }

  onclick(e: any) {
    this.show = false;
    this.$emit("click", e);
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
  visibility: hidden;
  opacity: 0;
  transition: 0.3s opacity;
  &--show {
    visibility: visible;
    opacity: 1;

    .k-dialog {
      transform: scale(1);
    }
  }
}

.k-dialog {
  box-sizing: border-box;
  min-width: 300px;
  width: 70%;
  max-width: 500px;
  
  @include sp {
    width: 100%;
  }
  transform: scale(0.2);
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 5px;
  overflow: hidden;

  transition: transform 0.1s;

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