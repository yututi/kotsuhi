<template>
  <app-layout>
    <template #header-btns>
      <app-select class="k-theme--primary" style="width:70px;" :options="allMonth"></app-select>
      <app-btn label="PDF" />
    </template>
    <template #body>
      <div class="k-main">
        <div class="k-main__header">
          <app-btn-group class="k-bulk-update-btns">
            <app-btn class="allcheck-btn" label="全選択/解除" @click="allCheckOrUncheck" outline>
              <app-check :value="allChecked"></app-check>
            </app-btn>
            <app-btn label="一括編集" outline @click="showBulkUpdateForm" />
            <app-btn label="一括削除" theme="error" @click="showDeleteConfirm" outline />
          </app-btn-group>
          <app-btn-group>
            <app-btn label="登録" @click="addInput" outline />
            <app-btn label="一括登録" @click="addInput" outline />
          </app-btn-group>
        </div>
        <div class="k-main__list k-card-list">
          <transition-group name="list-item">
            <k-card
              class="k-card-list__item"
              v-for="(input) in inputList"
              :key="input.id"
              :input="input"
              :month="month"
              @modClick="onModBtnClicked"
            />
          </transition-group>
        </div>
        <div class="k-adder">
          <fa-icon @click="addInput" class="k-adder__icon" icon="plus-circle" />
        </div>
      </div>
      <app-modal ref="modal" v-model="modal">
        <template #form>
          <k-form
            :data="selected"
            @update="onCreateOrUpdate"
            @delete="onDelete"
            :baseDate="baseDate"
          />
        </template>
        <template #deleteComfirm>
          <div class="k-confirm">
            <div class="k-confirm__txt">チェックしたデータを削除します。</div>
            <app-btn-group class="k-confirm__btns">
              <app-btn label="OK" @click="onDeleteOk" />
            </app-btn-group>
          </div>
        </template>
        <template #bulkForm>
          <k-bulk-update-form :baseDate="baseDate" :selectedDates="[]" />
        </template>
      </app-modal>
    </template>
  </app-layout>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppLayout from "@/components/Layout.vue";
import AppBtn from "@/components/Btn.vue";
import AppCheck from "@/components/Check.vue";
import AppBtnGroup from "@/components/BtnGroup.vue";
import AppModal from "@/components/Modal.vue";
import KCard from "@/components/KotsuhiCard.vue";
import AppSelect from "@/components/Select.vue";
import {
  Input,
  InputEntity,
  defaultInput,
  ModalConfig,
  createModalConfig
} from "@/types/index";
import db from "@/store";
import { firstDayOfMonth, lastDayOfMonth } from "@/utils";

function fromEntity(entity: InputEntity): Input {
  const date = entity.ymd.getDate();
  return { ...entity, date, isChecked: false };
}
function toEntity(input: Input, baseDate: Date): InputEntity {
  return {
    ...input,
    ymd: new Date(baseDate.getFullYear(), baseDate.getMonth(), input.date)
  };
}

@Component({
  components: {
    AppLayout,
    AppBtn,
    AppBtnGroup,
    AppCheck,
    AppModal,
    AppSelect,
    KCard,
    "k-form": () => import("@/components/KotsuhiForm.vue"),
    "k-bulk-update-form": () => import("@/components/KotsuhiBulkUpdateForm.vue")
  }
})
export default class Main extends Vue {
  baseDate = new Date();
  inputList: Input[] = [];
  selected: Input = defaultInput();
  modal: boolean = false;
  allMonth = [
    {
      label: "2020/9",
      value: 2
    }
  ];
  get month() {
    return this.baseDate.getMonth() + 1;
  }
  get allChecked() {
    return (
      this.inputList.length > 0 &&
      this.inputList.every(input => input.isChecked)
    );
  }
  onModBtnClicked(input: Input) {
    this.selected = input;
    this.openDialog({
      title: "交通費入力",
      slot: "form",
      expandOnSp: true
    });
  }
  openDialog(config: ModalConfig) {
    const { modal } = this.$refs;
    if (modal instanceof AppModal) {
      modal.openDialog(config);
    }
  }
  async updateList() {
    const inputs = await db.inputs
      .where("ymd")
      .between(
        firstDayOfMonth(this.baseDate),
        lastDayOfMonth(this.baseDate),
        true,
        true
      )
      .sortBy("date");
    this.inputList = inputs.map(fromEntity);
  }
  allCheckOrUncheck() {
    var check = !this.allChecked;
    this.inputList.forEach(input => (input.isChecked = check));
  }

  mounted() {
    this.updateList();
  }
  async onCreateOrUpdate(newData: Input) {
    if (newData.id === undefined) {
      await db.inputs.add(toEntity(newData, this.baseDate));
    } else {
      await db.inputs.update(newData.id!, toEntity(newData, this.baseDate));
    }
    this.updateList();
    this.modal = false;
  }
  async onDelete(id: number) {
    await db.inputs.delete(id);
    this.updateList();
    this.modal = false;
  }
  async onDeleteOk() {
    var ids = this.inputList.reduce<number[]>((ids, input) => {
      if (input.isChecked && input.id != null) ids.push(input.id);
      return ids;
    }, []);
    await db.inputs.bulkDelete(ids);
    this.updateList();
    this.modal = false;
  }
  async addInput() {
    const maxDate = Math.max(0, ...this.inputList.map(input => input.date)) + 1;
    const lastDate = lastDayOfMonth(this.baseDate).getDate();
    const newDate = maxDate > lastDate ? lastDate : maxDate;
    this.selected = defaultInput();
    this.selected.date = newDate;
    this.openDialog({
      title: "交通費入力",
      slot: "form",
      expandOnSp: true
    });
  }
  showBulkUpdateForm() {
    this.openDialog({
      title: "交通費入力",
      slot: "bulkForm",
      expandOnSp: true
    });
  }
  showDeleteConfirm() {
    this.openDialog({
      slot: "deleteComfirm",
      header: false
    });
  }
}
</script>
<style lang="scss">
@import "../styles/base.scss";
.k-main {
  padding: 5px 10px 10px 10px;
  max-width: 980px;
  margin: auto;

  &__header {
    position: sticky;
    top: 0px;
    padding: 5px 0px;
    background-color: white;
    display: flex;

    & > *:not(:first-child) {
      margin-left: 5px;
    }
  }
}
.k-card-list {
  position: relative;
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
  position: sticky;
  bottom: 0px;
  padding: 10px 20px;
  pointer-events: none;

  &__icon {
    color: #2196f3;
    font-size: 30px;
    cursor: pointer;
    pointer-events: initial;

    &:hover {
      color: #4089ff;
    }
  }
}

.k-confirm {
  text-align: center;
  &__btns {
    margin-top: 10px;
    justify-content: flex-end;
  }
}

.k-card-list__item {
  transition: opacity 0.5s, transform 0.5s;
  width: 100%;
}
.list-item-enter,
.list-item-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
.list-item-leave-active {
  position: absolute;
}
.k-bulk-update-btns {
  @include sp {
    display: none;
  }
}
</style>
