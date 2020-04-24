<template>
  <div class="k-check" :class="classes" @click="value = !value">
    <div class="k-check__inner"></div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Btn extends Vue {
  @Prop({ type: String, required: false, default: "" })
  label!: string;

  @Prop({ type: Boolean, default: false })
  checked!: boolean;

  get classes() {
    return {
      "k-check--checked": this.checked
    };
  }
  get value() {
    return this.checked;
  }
  set value(value) {
    this.checked = value
    this.$emit("input", value);
  }
}
</script>
<style lang="scss">
.k-check {
  border: 2px solid gainsboro;
  height: 18px;
  width: 18px;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &__inner {
    background-color: #5089ff;
    border-radius: 1px;
    width: 0px;
    height: 0px;
    transition: width 0.1s, height 0.1s;
  }

  &--checked {
    .k-check__inner {
      width: 100%;
      height: 100%;
    }
  }
}
</style>