<template>
  <div class="k-select" :class="selectCls">
    <input
      type="text"
      class="k-select__selected"
      :value="label"
      readonly
      @focus="focused = true"
      @blur="focused = false"
    />
    <div class="k-select__options k-options k-shadow">
      <div
        class="k-options__item"
        v-for="option in options"
        :key="option.value"
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
  value: string;
}

@Component
export default class Select extends Vue {
  @Prop({ type: Array, required: true })
  options!: Option[];

  @Prop({ type: String, required: false, default: "" })
  value!: string;

  get label() {
    if (!this.value) {
      return "";
    }
    return this.options.find(option => option.value == this.value)!.label;
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

  onInput(value: any) {}
}
</script>
<style lang="scss">
.k-select {
  position: relative;
  width: 100%;
  &__options {
    position: absolute;
    visibility: hidden;
    width: 100%;
    opacity: 0;
    transition: 0.2s opacity;
    top: calc(100% + 1px);
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