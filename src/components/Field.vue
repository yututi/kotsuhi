<template>
  <div class="k-field">
    <div v-if="label" class="k-field__label">{{label}}</div>
    <div class="k-field__body" :class="bodyClasses">
      <slot />
    </div>
    <div class="k-field__unit" v-if="unit">{{unit}}</div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Btn from "@/components/Btn.vue";

@Component
export default class Field extends Vue {
  @Prop({ type: String, default: "" })
  label!: string;

  @Prop({ type: String, default: "" })
  unit!: string;

  @Prop({ type: Boolean, default: false })
  checkBeforeModify!: boolean;

  value: string = "";

  get bodyClasses() {
    return {
      "k-field__body--has-unit": !!this.unit
    };
  }

  onInput(value: any) {}
}
</script>
<style lang="scss">
.k-field {
  display: flex;
  align-items: center;

  &__label {
    flex-basis: 0;
    flex-grow: 3;
    flex-shrink: 0;
    margin-right: 0.5rem;
    text-align: right;
  }

  &__body {
    position: relative;
    display: flex;
    flex-basis: 0;
    flex-grow: 11;
    flex-shrink: 1;

    &:after {
      position: absolute;
      content: "";
      left: 0px;
      bottom: -1px;
      // transform: translateX(-50%);
      background-color: transparent;
      height: 2px;
      width: 0px;
      transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
    }
    &:focus-within:after {
      background-color: #3367d6;
      width: 100%;
    }

    &--has-unit {
      flex-grow: 10;
    }
  }

  &__unit {
    flex-basis: 0;
    flex-grow: 1;
    flex-shrink: 0;
    text-align: center;
  }
}

input {
  padding: 0.3em;
  border-radius: 3px;
  border: 1px solid transparent;
  outline: none;
  background-color: #eeeeee;
  width: 100%;

  &:focus {
    background-color: #ffffff;

    &:after {
      width: 100%;
    }
  }
}
</style>