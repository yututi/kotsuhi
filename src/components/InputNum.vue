<template>
  <div class="k-input-num">
    <input v-if="isMobile" class="k-input-num__txt" type="number" :max="max" v-model="numForMobile" />
    <input v-else class="k-input-num__txt" type="text" @keydown="validateNum" v-model="num" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { isMobile } from "@/utils";

@Component
export default class InputNum extends Vue {
  @Prop()
  value!: number;

  @Prop({ type: Number, default: 999999 })
  max!: number;

  get numForMobile() {
    return this.value;
  }
  set numForMobile(val) {
    this.$emit("input", val);
  }

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