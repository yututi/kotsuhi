<template>
  <button
    class="btn"
    :class="btnClasses"
    :tabindex="focusable?0:-1"
    @mousedown="onclick($event)"
  >{{label}}</button>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Btn extends Vue {
  @Prop({ type: String, required: false, default: "" })
  label!: string;

  @Prop({ type: Boolean, default: false })
  dark!: boolean;

  @Prop({ type: Boolean, default: false })
  outline!: boolean;

  @Prop({ type: Boolean, default: true })
  focusable!: boolean;

  get btnClasses() {
    return {
      "btn--dark": this.dark,
      "btn--outline": this.outline
    };
  }

  onclick(e: any) {
    this.$emit("click", e);
  }
}
</script>
<style lang="scss">
.btn {
  // reset button styles
  border: 1px solid transparent;
  background-color: white;
  outline: none;

  font-size: 17px;
  padding: 5px 7px;
  border-radius: 4px;
  color: #3367d6;
  transition: 0.3s background-color;
  &:hover {
    background-color: #cde0ff;
    cursor: pointer;
  }
  &:active,
  &:focus {
    border: 1px solid #3367d6;
  }

  &--dark {
    color: white;
    background-color: #3367d6;
    &:hover {
      background-color: #4089ff;
      cursor: pointer;
    }
    &:active,
    &:focus {
      border: 1px solid white;
    }

    &.btn--outline {
      border: 1px solid white;
    }
  }

  &--outline {
    border: 1px solid #3367d6;
  }
}
</style>