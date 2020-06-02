<template>
  <div class="k-field" :class="fieldClasses">
    <div v-if="label" class="k-field__label">{{label}}</div>
    <div class="k-field__body" :class="bodyClasses">
      <slot v-if="editable" />
      <div v-else class="k-field__guard k-guard">
        <span class="k-guard__label">編集しない</span>
        <div class="k-guard__icon">
          <fa-icon icon="edit" @click.stop="onUnshield" />
        </div>
      </div>
    </div>
    <div class="k-field__unit" v-if="unit">{{unit}}</div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Field extends Vue {
  @Prop({ type: String, default: "" })
  label!: string;

  @Prop({ type: String, default: "" })
  unit!: string;

  @Prop({ type: Boolean, default: false })
  checkBeforeModify!: boolean;

  @Prop({type:Boolean, default:false})
  shield!: boolean;

  @Prop({type: Boolean, default:false})
  labelTop!: boolean;

  unShielded: boolean = false;

  get editable():boolean {
    return !this.shield || this.unShielded
  }

  value: string = "";

  get fieldClasses() {
    return {
      "k-field--label-top" : this.labelTop
    }
  }

  get bodyClasses() {
    return {
      "k-field__body--has-unit": !!this.unit,
      "k-field__body--is-shielded": this.shield && !this.unShielded
    };
  }

  onUnshield() {
    this.unShielded = true;
    this.$emit("unshield")
  }

  onInput(value: any) {}
}
</script>
<style lang="scss">
.k-field {
  display: flex;
  align-items: center;

  &--label-top {
    align-items: baseline;
  }

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

  &__guard {
    width: 100%;
  }
}

.k-guard {
display: flex;
  padding: 0.3em;
  border-radius: 3px;
  border: 1px solid transparent;
  outline: none;
  background-color: #eeeeee;
  color: dimgray;

    &__label {
      flex:1;
    }

    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: lightslategray;
    }
}

.k-field input,
.k-field .k-input{
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
.k-field .k-select {
  width: 100%;
}
</style>