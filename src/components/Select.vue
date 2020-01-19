<template>
  <div class="k-select" :class="selectCls">
    <input
      type="text"
      class="k-select__selected"
      :value="selected"
      readonly
      @focus="focused = true"
      @blur="focused = false"
    />
    <div class="k-select__options k-options">
      <div
        class="k-options__item"
        v-for="(option, idx) in options"
        :key="option.value"
        @click="selectedIdx = idx"
      >{{option.label}}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Btn from "@/components/Btn.vue";

@Component
export default class Select extends Vue {
  @Prop({ type: Array, required: true })
  options!: { label: string; value: string }[];
  value: string = "";
  selectedIdx: number = -1;
  focused = false;

  get selected() {
    if (this.selectedIdx >= 0) {
      return this.options[this.selectedIdx].label;
    }
    return "";
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
    user-select: none;
    &:hover {
      background-color: #cde0ff;
    }
  }
}
</style>