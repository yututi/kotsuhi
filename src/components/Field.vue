<template>
  <div class="k-field">
    <div v-if="label" class="k-field__label">{{label}}</div>
    <div class="k-field__body">
      <slot />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Btn from "@/components/Btn.vue";

@Component
export default class Field extends Vue {
  @Prop({ type: String, required: false, default:"" })
  label!: string;

  value: string = "";

  onInput(value: any) {}
}
</script>
<style lang="scss">
.k-field {
  display: flex;
  align-items: baseline;

  &__label {
    flex-basis: 0;
    flex-grow: 1;
    flex-shrink: 0;
    margin-right: 0.5rem;
    text-align: right;
  }

  &__body {
    position: relative;
    display: flex;
    flex-basis: 0;
    flex-grow: 5;
    flex-shrink: 1;

    &:after {
      position: absolute;
      content: "";
      left: 0px;
      bottom: -1px;
      // transform: translateX(-50%);
      background-color: #3367d6;
      height: 2px;
      width: 0px;
      transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
    }
    &:focus-within:after {
      width: 100%;
    }
  }
}

input {
  padding: 0.3em;
  border-radius: 3px;
  border: 1px solid transparent;
  outline: none;
  background-color: #eeeeee;

  &:focus {
    background-color: #ffffff;

    &:after {
      width: 100%;
    }
  }
}
</style>