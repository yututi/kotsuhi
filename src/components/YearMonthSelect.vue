<template>
  <app-popover class="k-ym-select">
    <template #default="{showPopover}">
      <app-btn
        class="k-ym-select__selected k-input"
        :class="inputCls"
        focusable
        @click="showPopover"
        :label="label"
      />
    </template>
    <template #popover>
      <div class="k-ym-options k-shadow">
        <div class="k-ym-options__header" @click.stop>
          <a class="k-month-arrow" @click="currentYear--">
            <fa-icon icon="caret-left" />
          </a>
          <span>{{currentYear}}</span>
          <a class="k-month-arrow" @click="currentYear++">
            <fa-icon icon="caret-right" />
          </a>
        </div>
        <table>
          <tr v-for="(monthRow, index) in months" :key="index">
            <td v-for="month in monthRow" :key="`${index}_${month}`">
              <app-btn
                class="k-ym-btn"
                :label="String(month)"
                :outline="!isSelectedYm(month)"
                @click="onMonthSelected(month)"
              />
            </td>
          </tr>
        </table>
      </div>
    </template>
  </app-popover>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import AppBtn from "@/components/Btn.vue";
import AppPopover from "@/components/Popover.vue";

@Component({
  components: {
    AppBtn,
    AppPopover
  }
})
export default class Select extends Vue {

  @Prop({ required: true })
  value!: Date;

  @Prop({ required: false })
  theme?: string;

  selectedYear = 2020;
  currentYear = this.selectedYear;
  selectedMonth = 0;

  listener: EventListener | null = null;

  months = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, 11, 12]
  ];

  get label() {
    return `${this.selectedYear}年 ${this.selectedMonth}月度`;
  }

  focused = false;

  delayedOutFocus() {
    this.$nextTick(() => {
      this.focused = false;
    });
  }

  get selectCls() {
    return {
      "k-ym-select--focused": this.focused
    };
  }

  get inputCls() {
    return {
      [`k-theme--${this.theme}`]: !!this.theme
    };
  }

  itemCls(month: number) {
    return {
      "k-ym-item--selected": this.selectedMonth === month
    };
  }

  onMonthSelected(month: number) {
    this.focused = false;
    this.selectedYear = this.currentYear;
    this.selectedMonth = month;
    this.$emit("input", new Date(this.currentYear, month - 1, 1));
  }

  isSelectedYm(month: number) {
    return (
      this.currentYear === this.selectedYear && this.selectedMonth === month
    );
  }

  mounted() {
    this.selectedYear = this.value.getFullYear();
    this.selectedMonth = this.value.getMonth() + 1;
    this.listener = () => {
      this.focused = false;
    };
    window.addEventListener("click", this.listener);
  }
  beforeDestroy() {
    if (this.listener) window.removeEventListener("click", this.listener);
  }
}
</script>
<style lang="scss">
.k-ym-select {
  position: relative;
  display: inline-block;

  &__options {
    position: absolute;
    visibility: hidden;
    opacity: 0;
    transition: 0.2s opacity;
    top: calc(100% + 1px);
    min-width: 100%;
    left: 50%;
  }

  &__selected {
    cursor: pointer;
    border: 1px solid transparent;
    outline: none;
    width: auto;
  }

  &--focused {
    .k-ym-select__options {
      z-index: 1;
      visibility: visible;
      opacity: 1;
    }
  }
}
.k-ym-options {
  background-color: white;
  color: dimgray;
  border: 1px solid gainsboro;
  border-radius: 3px;
  overflow: hidden;
  padding: 5px;

  &__header {
    width: 100%;
    padding: 0.5em;
    display: flex;
    justify-content: space-around;
    align-items: center;
    user-select: none;
  }
}

.k-ym-btn {
  width: 50px;
  display: flex;
  justify-content: center;
}

.k-month-arrow {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  width: 30px;
  border-radius: 4px;
  font-size: 28px;
  color: #2196f3;
  &:hover {
    cursor: pointer;
    background-color: gainsboro;
  }
}
</style>