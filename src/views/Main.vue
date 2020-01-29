<template>
  <app-layout>
    <template #header-btns>
      <app-btn label="PDF" dark @click="download" />
    </template>
    <template #body>
      <div class="k-card-list">
        <k-card
          class="k-card-list__item"
          v-for="(input, idx) in inputList"
          :key="idx"
          :input="input"
          :month="month"
          @modClick="onModBtnClicked"
        />
      </div>
      <div class="k-adder" @click="addInput">
        <fa-icon class="k-adder__icon" icon="plus-circle" />
      </div>
      <app-modal v-model="showInputForm" title="交通費入力">
        <k-form
          :data="selected"
          @update="onCreateOrUpdate"
          @delete="onDelete"
          :baseDate="baseDate"
        />
      </app-modal>
    </template>
  </app-layout>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppLayout from "@/components/Layout.vue";
import AppBtn from "@/components/Btn.vue";
import AppModal from "@/components/Modal.vue";
import KForm from "@/components/KotsuhiForm.vue";
import KCard from "@/components/KotsuhiCard.vue";
import { Input } from "@/types/index";
import db, { InputEntity } from "@/store";
import { firstDayOfMonth, lastDayOfMonth } from "@/utils";
import { saveAs } from "file-saver";

function fromEntity(entity: InputEntity): Input {
  const date = entity.date.getDate();
  return { ...entity, date };
}
function toEntity(input: Input, baseDate: Date): InputEntity {
  return {
    ...input,
    date: new Date(baseDate.getFullYear(), baseDate.getMonth(), input.date)
  };
}

@Component({
  components: {
    AppLayout,
    AppBtn,
    AppModal,
    KForm,
    KCard
  }
})
export default class Main extends Vue {
  baseDate = new Date();
  inputList: Input[] = [];
  selected: Input | null = null;
  showInputForm: boolean = false;
  get month() {
    return this.baseDate.getMonth() + 1;
  }
  onModBtnClicked(input: Input) {
    this.selected = input;
    this.showInputForm = true;
  }
  async updateList() {
    const inputs = await db.inputs
      .where("date")
      .between(
        firstDayOfMonth(this.baseDate),
        lastDayOfMonth(this.baseDate),
        true,
        true
      )
      .sortBy("date");
    this.inputList = inputs.map(fromEntity);
  }

  _worker!: Worker;
  mounted() {
    this._worker = new Worker("worker.js");
    this._worker.onmessage = async evt => {
      //   var saver = await import("file-saver");
      saveAs(evt.data, `交通費請求書${this.month}月.pdf`);
    };
    this.updateList();
  }
  async onCreateOrUpdate(newData: Input) {
    if (newData.id === undefined) {
      await db.inputs.add(toEntity(newData, this.baseDate));
    } else {
      await db.inputs.update(newData.id!, toEntity(newData, this.baseDate));
    }
    this.updateList();
    this.showInputForm = false;
  }
  async onDelete(id: number) {
    await db.inputs.delete(id);
    this.updateList();
    this.showInputForm = false;
  }
  async addInput() {
    const maxDate = Math.max(0, ...this.inputList.map(input => input.date)) + 1;
    const lastDate = lastDayOfMonth(this.baseDate).getDate();
    const newDate = maxDate > lastDate ? lastDate : maxDate;
    this.selected = {
      date: newDate,
      from: "",
      to: "",
      cost: 0,
      memo: "",
      dirIcon: "arrows-alt-h"
    };
    this.showInputForm = true;
  }

  download() {
    // this._worker.postMessage("");
    this.$router.push("/pdf")
  }
}
</script>
<style lang="scss">
@import "../styles/base.scss";

.k-card-list {
  padding: 10px;
  max-width: 980px;
  margin: auto;

  &__item:not(:first-child) {
    margin-top: 5px;
  }
}

.k-textarea {
  border: none;
  width: 100%;
  box-sizing: border-box;
  resize: none;
  padding: 10px;
  outline: none;
  border-radius: 3px;
  background-color: #eeeeee;

  &:focus {
    background-color: #ffffff;
  }
}

.k-adder {
  display: flex;
  justify-content: center;

  &__icon {
    color: #3367d6;
    font-size: 30px;
    cursor: pointer;

    &:hover {
      color: #4089ff;
    }
  }
}
</style>
