<template>
  <div
    class="k-popover-activator"
    @click.stop
    @mouseleave="closePopoverDelay"
    @mouseenter="stopClose"
  >
    <slot v-bind:showPopover="showPopover" />
    <div class="k-popover-activator__popover k-popover-wrapper" @click="show = false">
      <transition name="slide-top">
        <div v-if="show" class="k-popover-wrapper__popover k-popover">
          <slot name="popover" />
        </div>
      </transition>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Popover extends Vue {
  show: boolean = false;

  otherCompClickLstener?: EventListener | null;
  timeoutId?: number | null;

  showPopover() {
    this.show = true;
  }

  closePopoverDelay() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      this.show = false;
      this.timeoutId = null;
    }, 500);
  }

  stopClose() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  mounted() {
    this.otherCompClickLstener = () => {
      this.show = false;
    };
    window.addEventListener("click", this.otherCompClickLstener);
  }
  beforeDestroy() {
    if (this.otherCompClickLstener)
      window.removeEventListener("click", this.otherCompClickLstener);
  }
}
</script>
<style lang="scss">
.k-popover-activator {
  position: relative;
  &__popover {
    position: absolute;
    top: calc(100%);
    left: 50%;
    transform: translateX(-50%);
  }
}
.k-popover-wrapper {
    overflow: hidden;
    padding: 5px; // 子コンポーネントのbox-shadowを表示するために隙間を作っておく
    user-select: none;
}
.slide-top-enter-active,
.slide-top-leave-active {
  transition: opacity 0.3s, transform 0.2s ease-in-out;
}
.slide-top-enter,
.slide-top-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>