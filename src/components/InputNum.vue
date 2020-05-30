<template>
  <div class="k-input-num">
    <input v-if="isMobile" class="k-input-num__txt" type="number" :max="max" v-model="num" />
    <input
      v-else
      class="k-input-num__txt"
      type="text"
      @keydown="validateNum"
      v-model="num"
    />
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import MobileCompatible from "@/components/mixins/mobileCompatible";

@Component
export default class InputNum extends Mixins(MobileCompatible) {
  @Prop()
  value!: number;

  @Prop({ type: Number, default: 999999 })
  max!: number;

  get num() {
    return this.value ? this.value.toLocaleString() : "";
  }
  set num(value) {
    let val = Number(value.replace(",", ""));
    if (value.startsWith("0")) {
      value = val.toString();
    }
    if (val > this.max) {
      val = this.max;
    }
    this.$emit("input", val);
  }
  validateNum(e: KeyboardEvent) {
    if (e.key.length != 1) return; // do not prevent if keydowned modifier keys.
    if (this.value === this.max) {
      e.preventDefault();
      return;
    }
    const newchar = String.fromCharCode(e.keyCode);
    if (isNaN(Number(newchar))) {
      e.preventDefault();
    }
  }
}
</script>
<style lang="scss">
.k-input-num {
  width: 100%;
  &__txt {
    text-align: right;
  }
}
</style>