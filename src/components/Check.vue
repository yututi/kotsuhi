<template>
  <div class="k-check" :class="classes" @click.stop="checked = !value">
</div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Check extends Vue {
  @Prop({ type: String, required: false, default: "" })
  label!: string;

  @Prop({ type: Boolean, default: false })
  value!: boolean;

  get classes() {
    return {
      "k-check--checked": this.checked
    };
  }
  get checked() {
    return this.value;
  }
  set checked(value) {
    console.log(value);
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
  display: inline-flex;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  background-color: lighten(gainsboro, 10%);
  transition: background-color 0.3s;

  // &__inner {
  //   background-color: #2196f3;
  //   border-radius: 999px;
  //   width: 0px;
  //   height: 0px;
  //   transition: width 0.1s, height 0.1s;
  // }

  &:hover {
    border: 2px solid lighten(#2196f3, 20%);
  }

  &--checked {
  border: 2px solid gainsboro;
    background-color: #2196f3;
  }
}
</style>