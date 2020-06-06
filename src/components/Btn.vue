<template>
  <div class="btn" :class="btnClasses" :tabindex="focusable?0:-1" @click="onclick($event)">
    <fa-icon v-if="icon" class="k-btn__icon" :icon="icon" />
    <slot />
    <span class="btn__label" v-if="label">{{label}}</span>
    <div v-if="tooltip" class="k-tooltip__tooltiptext">{{tooltip}}</div>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import Themeable from "@/components/mixins/themeable";

@Component
export default class Btn extends Mixins(Themeable) {
  @Prop({ type: String, required: false, default: "" })
  label!: string;

  @Prop({ type: Boolean, default: false })
  dark!: boolean;

  @Prop({ type: Boolean, default: false })
  outline!: boolean;

  @Prop({ type: Boolean, default: true })
  focusable!: boolean;

  @Prop({ type: Boolean, default: false })
  round!: boolean;

  @Prop({ required: false })
  icon?: string | string[];

  @Prop({ type: String, required: false, default: "" })
  tooltip!: string;

  get btnClasses() {
    return {
      "btn--dark": this.dark,
      "btn--outline": this.outline,
      "btn--round": this.round,
      "btn--icon": this.icon,
      "k-tooltip": !!this.tooltip,
      ...this.themeClasses
    };
  }

  onclick(e: any) {
    this.$emit("click", e);
  }
}
</script>
<style lang="scss">
@import "@/styles/theme.scss";
@import "@/styles/base.scss";

.btn {
  // reset button styles
  border: 1px solid transparent;
  background-color: transparent;
  outline: none;
  display: inline-flex;
  user-select: none;

  font-size: 17px;
  padding: 0px 8px;
  line-height: 32px;
  border-radius: 4px;
  transition: 0.3s background-color;
  align-items: center;
  @include sp {
    font-size: 22px;
  }

  &:hover {
    cursor: pointer;
  }

  &--round {
    border-radius: 9999px;
  }

  &--icon {
    @include sp {
      padding: 0px;
      width: 42px;
      height: 42px;
      justify-content: center;
      font-size: 32px;

      .btn__label {
        display: none;
      }
    }
  }

  & > *:not(:first-child) {
    margin-left: 4px;
  }
}

@each $name, $theme in $themes {
  .btn.k-theme--#{$name}:hover {
    background-color: lighten(map-get($theme, "bgColor"), 10%);
    border-color: lighten(map-get($theme, "bgColor"), 10%);
  }

  .btn.k-theme--#{$name}:active {
    background-color: darken(map-get($theme, "bgColor"), 5%);
  }

  .btn--outline.k-theme--#{$name} {
    background-color: transparent;
    border: 1px solid map-get($theme, "bgColor");
    color: map-get($theme, "bgColor");

    &:hover {
      color: map-get($theme, "color");
    }

    &:active {
      color: map-get($theme, "color");
    }
  }
}
</style>