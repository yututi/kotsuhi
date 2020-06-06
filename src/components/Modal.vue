<template>
  <transition name="fade">
    <div v-if="show" class="k-modal" @click="onclick($event)">
      <slot />
    </div>
  </transition>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component
export default class Modal extends Vue {
  @Prop({ type: Boolean, default: false })
  value!: boolean;

  get show() {
    return this.value;
  }

  set show(value) {
    this.$emit("input", value);
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
</style>