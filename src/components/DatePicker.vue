<template>
  <div class="k-datepicker">
    <div class="k-datepicker__calendar k-calendar">
      <div class="k-calendar__row" v-for="(row, ridx) in rows" :key="'r'+ridx">
        <div
          class="k-calendar__cell k-cell"
          :class="cellCls(cell, cidx)"
          v-for="(cell, cidx) in row.cells"
          :key="`r${ridx}_c${cidx}`"
          @click="onCellSelected(cell)"
        >
          <template v-if="cell.date">{{cell.date}}</template>
        </div>
      </div>
    </div>
    <div class="k-datepicker__btns">
      <app-btn label="クリア" />
      <app-btn label="決定" />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import AppBtn from "@/components/Btn.vue";

interface Cell {
  date?: number;
}

interface Row {
  cells: Cell[];
}

@Component({
  components: {
    AppBtn
  }
})
export default class DatePicker extends Vue {
  @Prop({ type: Date, required: true })
  value!: Date;

  selected: number[] = [];

  get month(): number {
    return this.value.getMonth();
  }

  get lastDate(): number {
    return new Date(
      this.value.getFullYear(),
      this.value.getMonth() + 1,
      0
    ).getDate();
  }

  get firstDay(): number {
    return new Date(
      this.value.getFullYear(),
      this.value.getMonth(),
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
      rows.push({ cells: this.cells.slice(i, i + 7) });
    }

    return rows;
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
    console.log(cell);
    if (!cell.date) {
      return;
    }
    const selected = this.selected;
    const idx = selected.indexOf(cell.date);
    console.log(idx);

    if (idx >= 0) {
      selected.splice(idx, 1);
    } else {
      selected.push(cell.date);
    }
  }

  onInput(value: Date) {
    this.$emit("input", value);
  }
}
</script>
<style lang="scss">
.k-datepicker {
  display: inline-block;
  border: 1px solid gainsboro;
  padding: 5px;

  &__btns {
    margin-top: 5px;
    display: flex;
    justify-content: flex-end;
  }
}
.k-calendar {
  border: 1px solid gainsboro;
  border-radius: 5px;
  box-sizing: border-box;
  &__row {
    display: flex;
    border-bottom: 1px solid gainsboro;

    &:last-child {
      border-bottom: 0px;
    }
  }

  &__cell {
    border-right: 1px solid gainsboro;

    &:last-child {
      border-right: 0px;
    }
  }
}
.k-cell {
  padding: 0.3em;
  text-align: right;
  width: 1.5em;

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