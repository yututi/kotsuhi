<template>
  <app-layout>
    <template v-slot:header-btns>
      <app-btn label="PDF" dark @click="download" />
    </template>
    <template v-slot:body>
      <div class="k-card-list">
        <div class="k-card k-card-list__item" v-for="(input, idx) in inputList" :key="idx">
          <div class="k-card__date">{{month}}月{{input.date}}日</div>
          <div class="k-card__divider"></div>
          <div class="k-card__detail">
            <div class="k-card__from">{{input.from}}</div>
            <div class="k-card__arrow">
              <fa-icon :icon="input.dirIcon" />
            </div>
            <div class="k-card__to">{{input.to}}</div>
            <div class="k-card__cost">{{input.cost}}円</div>
          </div>
          <div class="k-card__divider"></div>
          <div class="k-card__memo">{{input.memo}}</div>
          <div class="k-card__divider"></div>
          <div class="k-card__btns">
            <app-btn label="編集" @click="onModBtnClicked(input)" />
          </div>
        </div>
      </div>
      <div class="k-adder" @click="addInput">
        <fa-icon class="k-adder__icon" icon="plus-circle" />
      </div>
      <app-modal v-model="showInputForm" title="交通費入力">
        <template v-slot:body>
          <k-form
            :data="selected"
            @update="onCreateOrUpdate"
            @delete="onDelete"
            :baseDate="baseDate"
          />
        </template>
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
import { Input } from "@/types/index";
import db, { InputEntity } from "@/store";
import { firstDayOfMonth, lastDayOfMonth } from "@/utils";
import { saveAs } from "file-saver";

function fromEntity(entity: InputEntity): Input {
  const date = entity.date.getDate();
  return { ...entity, date: date };
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
    KForm
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

.k-card {
  display: flex;
  align-items: center;
  border: 1px solid gainsboro;
  border-radius: 6px;
  padding: 10px;
  color: dimgray;

  @include sp {
    flex-direction: column;
    align-items: flex-start;

    &__detail {
      font-size: 12px;
    }
  }

  &__date {
    font-size: 22px;
    text-align: center;
    width: 100px;
    @include sp {
      text-align: initial;
      width: initial;
      margin-bottom: 5px;
    }
  }

  &__detail {
    font-size: 16px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    box-sizing: border-box;
    & > *:not(:first-child) {
      margin-left: 5px;
    }
    width: 300px;
    @include sp {
      padding-left: 10px;
      width: 100%;
    }
  }

  &__cost {
    flex: 1;
    text-align: right;
    min-width: 90px;
  }

  &__memo {
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    @include pc {
      flex: 1;
    }
    @include sp {
      display: none;
    }
  }

  &__btns {
    @include sp {
      display: none;
    }
  }

  &__divider {
    margin: 0px 10px;
    height: 30px;
    border-left: 1px solid gainsboro;
    @include sp {
      display: none;
    }
  }
}

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
