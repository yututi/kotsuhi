<template>
  <div class="k-layout" :style="layoutStyles">
    <header class="k-layout__header" :class="headerClasses">
      <app-btn class="k-header__menu-icon" icon="bars" round @click="showMenu = true"></app-btn>
      <span class="k-layout__title">交通費精算</span>
      <div class="k-layout__left-items">
        <slot name="header-left-items" />
      </div>
      <div class="k-layout__sub-items-wrapper" :class="wrapperClasses" @click="showMenu = false"></div>
      <div class="k-layout__sub-items k-sub-items" :class="subMenuClasses">
        <app-btn
          class="k-sub-items__close-icon"
          icon="times-circle"
          round
          @click="showMenu = false"
        ></app-btn>
        <slot name="header-sub-items" />
      </div>

      <div class="k-spacer"></div>
      <div class="k-layout__right-items">
        <slot name="header-right-items" />
      </div>
    </header>
    <div class="k-layout__body">
      <slot name="body" />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import AppBtn from "@/components/Btn.vue";
import Themeable from "@/components/mixins/themeable";
import { isMobile } from "@/utils";

@Component({
  components: {
    AppBtn
  }
})
export default class Layout extends Mixins(Themeable) {
  @Prop({ type: String, required: false, default: "" })
  label!: string;

  height = 0;

  showMenu = false;

  get layoutStyles() {
    if (isMobile) {
      return {
        height: this.height + "px"
      };
    }
    return {};
  }

  get headerClasses() {
    return {
      ...this.themeClasses
    };
  }

  get subMenuClasses() {
    return {
      "k-sub-items--show": this.showMenu,
      ...this.themeClasses
    };
  }

  get wrapperClasses() {
    return {
      "k-layout__sub-items-wrapper--show": this.showMenu
    };
  }

  onclick(e: any) {
    this.$emit("click", e);
  }

  _listener?: EventListener | null;
  mounted() {
    if (isMobile) {
      this.height = window.innerHeight;
    }
    this._listener = () => {
      this.height = window.innerHeight;
    };
    window.addEventListener("resize", this._listener);
  }
  beforeDestroy() {
    if (this._listener) window.removeEventListener("resize", this._listener);
  }
}
</script>
<style lang="scss">
@import "../styles/base.scss";

.k-layout {
  @include pc {
    height: 100vh;
  }
  display: flex;
  flex-direction: column;
  &__header {
    padding: 5px;
    align-items: center;
    display: flex;
    border-bottom: 1px solid gainsboro;
    border: 1px solid transparent;
    box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.2),
      0 3px 3px -2px rgba(0, 0, 0, 0.14), 0 1px 8px 0 rgba(0, 0, 0, 0.12);
    z-index: 20;
  }

  &__title {
    font-size: 26px;
    padding: 0px 5px;
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

  @include sp {
    &__title {
      padding: 0px 10px;
    }
    &__header {
      position: relative;
    }
    &__sub-items {
      position: absolute;
    }
  }
}
.k-layout__sub-items-wrapper {
  margin-left: 5px;
  @include sp {
    visibility: hidden;
    margin-left: 0px;
    opacity: 0;
    transition: opacity 0.3s;
    position: fixed;
    top: 0px;
    left: 0px; // 親のボーター分左にずらす
    height: 100vh;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.2);

    &--show {
      visibility: visible;
      opacity: 1;
    }
  }
}
.k-sub-items {
  @include sp {
    top: 0px;
    left: -100%;
    height: calc(100vh);
    max-width: 300px;
    min-width: 200px;
    width: 70%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: white;
    padding: 10px;
    border-right: 1px solid gainsboro;
    box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.2),
      0 3px 3px -2px rgba(0, 0, 0, 0.14), 0 1px 8px 0 rgba(0, 0, 0, 0.12);
    transition: left 0.3s;
    & > *:not(:first-child) {
      margin-top: 10px;
    }

    &--show {
      left: -1px;
    }
  }

  @include pc {
    &__close-icon {
      display: none;
    }
  }
}
.k-spacer {
  flex: 1;
}
.k-header__menu-icon {
  @include pc {
    display: none;
  }
}
</style>