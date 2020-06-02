<template>
  <div class="k-select" :class="selectCls">
    <div
      type="text"
      class="k-select__selected k-input"
      :class="inputCls"
      tabindex="0"
      @blur="focused = false"
      @focus="focused = true"
    >{{label}}</div>
    <div class="k-select__options k-options k-shadow">
      <div
        class="k-options__item"
        v-for="option in options"
        :key="option.label"
        @mousedown="selected(option)"
      >{{option.label}}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Btn from "@/components/Btn.vue";

interface Option {
  label: string;
  value: Object;
}

@Component
export default class Select extends Vue {
  @Prop({ type: Array, required: true })
  options!: Option[];

  @Prop({ required: false, default: "" })
  value!: Object;

  @Prop({ required: false })
  theme?: string;

  get label() {
    if (!this.value || !this.options.length) {
      return "";
    }
    const option = this.options.find(option => option.value == this.value);
    if (!option) {
      console.warn("No option found.", this.options, this.value)
      return ""
    }
    return option.label;
  }

  focused = false;

  selected(option: Option) {
    this.focused = false;
    this.$emit("input", option.value);
  }

  delayedOutFocus() {
    this.$nextTick(() => {
      this.focused = false;
    });
  }

  get selectCls() {
    return {
      "k-select--focused": this.focused
    };
  }

  get inputCls() {
    return {
      [`k-theme--${this.theme}`]: !!this.theme
    };
  }

  onInput(value: any) {}
}
</script>
<style lang="scss">
.k-select {
  position: relative;
  display: inline-block;

  &__options {
    position: absolute;
    visibility: hidden;
    opacity: 0;
    transition: 0.2s opacity;
    top: calc(100% + 1px);
    min-width: 100%;
  }

  &__selected {
    cursor: pointer;
    border: 1px solid transparent;
    outline: none;
    width: auto;
  }

  &--focused {
    .k-select__options {
      z-index: 1;
      visibility: visible;
      opacity: 1;
    }
  }
}
.k-options {
  background-color: white;
  color: dimgray;
  border: 1px solid gainsboro;
  overflow: hidden;
  border-radius: 3px;
  box-sizing: border-box;

  &__item {
    padding: 5px;
    cursor: default;
    &:hover {
      background-color: #cde0ff;
    }
  }
}
</style>