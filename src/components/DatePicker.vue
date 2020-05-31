<template>
  <div class="k-datepicker" :class="pickerCls" @click.stop>
    <input type="text" class="k-datepicker__txt" readonly :value="dispVal" @focus="focused = true" @blur="onBlur" />
    <div class="k-datepicker__calendar k-calendar">
      <div class="k-calendar__header">{{baseDate.getFullYear()}}年 {{baseDate.getMonth()+1}}月</div>

      <div class="k-calendar__row" @click.stop>
        <div class="k-calendar__cell k-cell">日</div>
        <div class="k-calendar__cell k-cell">月</div>
        <div class="k-calendar__cell k-cell">火</div>
        <div class="k-calendar__cell k-cell">水</div>
        <div class="k-calendar__cell k-cell">木</div>
        <div class="k-calendar__cell k-cell">金</div>
        <div class="k-calendar__cell k-cell">土</div>
      </div>

      <div class="k-calendar__row" v-for="(row, ridx) in rows" :key="'r'+ridx">
        <div
          class="k-calendar__cell k-cell"
          :class="cellCls(cell, cidx)"
          v-for="(cell, cidx) in row.cells"
          :key="`r${ridx}_c${cidx}`"
          @mousedown="onCellSelected(cell)"
        >{{cell.date||""}}</div>
      </div>
      <div v-if="multiple" class="k-calendar__btns">
        <app-btn-group>
          <app-btn outline :focusable="false" label="クリア" @click="onClearSelected" />
          <app-btn outline :focusable="false" label="決定" @click="onOkClicked" />
        </app-btn-group>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import AppBtn from "@/components/Btn.vue";
import AppBtnGroup from "@/components/BtnGroup.vue";

interface Cell {
  date?: number;
}

interface Row {
  cells: Cell[];
}

@Component({
  components: {
    AppBtn,
    AppBtnGroup
  }
})
export default class DatePicker extends Vue {
  @Prop({ type: Date, required: true })
  baseDate!: Date;

  @Prop({ type: Boolean, default: false })
  multiple!: boolean;

  @Prop({ default: () => [] })
  value!: number[];

  @Prop({type:Boolean, default:false})
  readonly!: boolean;

  get selected() {
    return this.value;
  }

  set selected(value) {
    this.$emit("input", value);
  }

  focused = false;

  get dispVal() {
    return this.selected.sort((a, b) => a - b).join(", ");
  }

  get month(): number {
    return this.baseDate.getMonth();
  }

  get lastDate(): number {
    return new Date(
      this.baseDate.getFullYear(),
      this.baseDate.getMonth() + 1,
      0
    ).getDate();
  }

  get firstDay(): number {
    return new Date(
      this.baseDate.getFullYear(),
      this.baseDate.getMonth(),
      1
    ).getDay();
  }

  get cells(): Cell[] {
    const cells: Cell[] = [];

    [...Array(this.firstDay)].forEach(() => cells.push({}));

    const last = this.lastDate;

    for (let i = 1; i <= last; i++) {
      cells.push({ date: i });
    }

    while (cells.length % 7) {
      cells.push({});
    }

    return cells;
  }

  get rows(): Row[] {
    const rows: Row[] = [];

    const cells = this.cells;

    for (let i = 0; i < cells.length; i += 7) {
      rows.push({ cells: cells.slice(i, i + 7) });
    }

    return rows;
  }

  get pickerCls() {
    return {
      "k-datepicker--focused": this.focused,
      "k-datepicker--multiple": this.multiple
    };
  }

  cellCls(cell: Cell, idx: number) {
    return {
      "k-cell--selectable": !!cell.date,
      "k-cell--sat": idx === 6,
      "k-cell--sun": idx === 0,
      "k-cell--selected": this.selected.includes(cell.date!)
    };
  }

  onCellSelected(cell: Cell) {
    if (!cell.date || this.readonly) {
      return;
    }

    if (this.multiple) {
      const selected = this.selected;
      const idx = selected.indexOf(cell.date);

      if (idx >= 0) {
        selected.splice(idx, 1);
      } else {
        selected.push(cell.date);
      }
    } else {
      this.selected = [cell.date];
    }
  }

  onClearSelected() {
    this.selected = [];
    this.focused = false;
  }

  onOkClicked() {
    this.$emit("input", this.selected);
    this.focused = false;
  }

  onBlur() {
    if (!this.multiple) {
      this.focused = false;
    }
  }

  _listener!: any;

  mounted() {
    this._listener = () => {
      this.focused = false;
    };
    window.addEventListener("click", this._listener);
  }

  beforeDestroy() {
    window.removeEventListener("click", this._listener);
  }
}
</script>
<style lang="scss">
@import "../styles/base.scss";

.k-datepicker {
  display: inline-block;
  position: relative;
  width: 100%;

  &__calendar {
    position: absolute;
    top: 100%;
    z-index: 1;
    margin-top: 1px;
    visibility: hidden;
    opacity: 0;
    transition: 0.3s opacity;
    background-color: white;
    min-width: 200px;
    max-width: 250px;
    width: 100%;

    @include sp {
      top: 0;
      left: 0;
      position: fixed;
      max-width: 100%;
    }
  }

  &--focused {
    .k-calendar {
      visibility: visible;
      opacity: 1;
    }
  }

  &--multiple {
    .k-datepicker {
      &__txt {
        display: none;
      }
    }
    .k-calendar {
      visibility: visible;
      opacity: 1;
      position: static;

      box-shadow: none;

      &__btns {
        display: none;
      }
    }
  }
}
.k-calendar {
  border: 1px solid gainsboro;
  border-radius: 3px;
  box-sizing: border-box;
  overflow: hidden;

  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 3px -2px rgba(0, 0, 0, 0.14),
  0 1px 8px 0 rgba(0, 0, 0, 0.12);

  &__header {
    padding: 4px;
    text-align: center;
  }
  &__row {
    box-sizing: border-box;
    display: flex;
    border-bottom: 1px solid gainsboro;

    &:last-child {
      border-bottom: 0px;
    }
  }

  &__cell {
    box-sizing: border-box;
    border-right: 1px solid gainsboro;

    &:last-child {
      border-right: 1px solid transparent;
    }
  }

  &__btns {
    margin: 5px;
    display: flex;
    justify-content: flex-end;
  }
}
.k-cell {
  padding: 0.3em;
  text-align: right;
  flex-basis: 0;
  flex-grow: 1;
  flex-shrink: 0;

  @include sp {
    padding: 1em;
    text-align: center;
  }

  &--selectable {
    cursor: pointer;
    &:hover {
      color: white;
      background-color: #3367d6;
    }
  }

  &--sat {
    color: #4089ff;
  }

  &--sun {
    color: #ff4040;
  }

  &--selected {
    color: white;
    background-color: #4089ff;
  }
}
</style>