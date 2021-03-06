<template>
  <app-layout>
    <template #header-left-items>
      <app-ym-select theme="primary" :value="baseDate" @input="updateYm"></app-ym-select>
    </template>
    <template #header-sub-items>
      <app-user-select></app-user-select>
    </template>
    <template #header-right-items>
      <app-btn
        v-if="isLoggedIn"
        icon="file-pdf"
        round
        label="PDF"
        :is-loading="isFileDownloading"
        @click="downloadPdf"
      />
      <form class="file-form" style="display:none;" :action="fileDownloadURL" method="POST">
        <input type="text" name="json" :value="fileDataJson" />
      </form>
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
          <app-btn-group class="k-bulk-update-btns">
            <app-btn label="登録" @click="addInput" outline />
            <app-btn label="一括登録" @click="showBulkInsertForm" outline />
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
        <template #commonComfirm="{on:{ok}, other}">
          <div class="k-confirm">
            <div class="k-confirm__txt">{{other}}</div>
            <app-btn-group class="k-confirm__btns">
              <app-btn label="OK" @click="ok" />
            </app-btn-group>
          </div>
        </template>
        <template #bulkUpdateForm>
          <k-bulk-update-form
            :baseDate="baseDate"
            :selectedDates="selectedDates"
            @update="onBulkUpdate"
          />
        </template>
        <template #bulkInsertForm>
          <k-bulk-insert-form :baseDate="baseDate" @insert="onBulkInsert" />
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
import AppModal from "@/components/ModalDialog.vue";
import KCard from "@/components/KotsuhiCard.vue";
import AppUserSelect from "@/components/UserInfo.vue";
import AppYmSelect from "@/components/YearMonthSelect.vue";
import {
  Input,
  InputEntity,
  defaultInput,
  ModalConfig,
  createModalConfig,
  UpdateInfo
} from "@/types/index";
import db from "@/store";
import {
  firstDayOfMonth,
  lastDayOfMonth,
  isMobile,
  downloadBlob
} from "@/utils";
import { globalState } from "@/globalState";

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
    AppUserSelect,
    KCard,
    AppYmSelect,
    "k-form": () => import("@/components/KotsuhiForm.vue"),
    "k-bulk-update-form": () =>
      import("@/components/KotsuhiBulkUpdateForm.vue"),
    "k-bulk-insert-form": () => import("@/components/KotsuhiBulkInsertForm.vue")
  }
})
export default class Main extends Vue {
  baseDate = new Date();
  inputList: Input[] = [];
  selected: Input = defaultInput();
  modal: boolean = false;
  allMonth: { label: string; value: Date }[] = [];
  get month() {
    return this.baseDate.getMonth() + 1;
  }
  get allChecked() {
    return (
      this.inputList.length > 0 &&
      this.inputList.every(input => input.isChecked)
    );
  }
  get selectedDates() {
    return this.inputList
      .filter(input => input.isChecked)
      .map(input => input.date);
  }
  get isLoggedIn() {
    return globalState.isLoggedIn;
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
      return modal.openDialog(config);
    }
    console.error("Unexpected component", modal);
    throw new Error("unexpected component.");
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
    if (!this.selectedDates.length) return;

    this.openDialog({
      title: "交通費入力",
      slot: "bulkUpdateForm",
      expandOnSp: true
    });
  }
  showBulkInsertForm() {
    this.openDialog({
      title: "交通費入力",
      slot: "bulkInsertForm",
      expandOnSp: true
    });
  }
  async showDeleteConfirm() {
    if (!this.selectedDates.length) return;

    const ok = await this.openDialog({
      slot: "commonComfirm",
      header: false,
      other: "チェックしたデータを削除します。"
    });
    if (ok) {
      var ids = this.inputList.reduce<number[]>((ids, input) => {
        if (input.isChecked && input.id != null) ids.push(input.id);
        return ids;
      }, []);
      await db.inputs.bulkDelete(ids);
      this.updateList();
    }
  }
  async onBulkUpdate(update: { input: Input; info: UpdateInfo }) {
    const updateEntities = this.inputList
      .filter(input => input.isChecked)
      .map(input => {
        if (update.info.isContactUpdated) input.contact = update.input.contact;
        if (update.info.isFromUpdated) input.from = update.input.from;
        if (update.info.isToUpdated) input.to = update.input.to;
        if (update.info.isTransportationUpdated)
          input.transportation = update.input.transportation;
        if (update.info.isCostUpdated) input.cost = update.input.cost;
        if (update.info.isMemoUpdated) input.memo = update.input.memo;
        if (update.info.isRoundTripUpdated)
          input.isRoundTrip = update.input.isRoundTrip;
        return toEntity(input, this.baseDate);
      });
    await db.inputs.bulkPut(updateEntities);
    this.updateList();
    this.modal = false;
  }
  async onBulkInsert(insertData: { input: Input; dates: number[] }) {
    const newEntities = insertData.dates.map(date => {
      insertData.input.date = date;
      return toEntity(insertData.input, this.baseDate);
    });

    await db.inputs.bulkAdd(newEntities);
    this.updateList();
    this.modal = false;
  }
  async updateYm(ym: Date) {
    this.baseDate = ym;
    this.updateList();
  }

  // PDF出力
  isFileDownloading = false;
  async downloadPdf() {
    const ok = await this.openDialog({
      slot: "commonComfirm",
      header: false,
      other: "PDFファイルをダウンロードします。"
    });
    if (!ok) return;

    this.isFileDownloading = true;
    try {
      // 認証ユーザのみPDFダウンロード
      // 未認証、オフラインユーザはprintで頑張ってもらう
      if (globalState.isLoggedIn) {
        const response = await fetch(
          process.env.VUE_APP_CLOUD_FUNCTION_BASE_URL + "api/genPdf",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            mode: "cors",
            cache: "no-cache",
            body: JSON.stringify({
              year: this.baseDate.getFullYear(),
              month: this.baseDate.getMonth() + 1,
              userName: globalState.userName,
              inputList: this.inputList
            })
          }
        );
        var blob = await response.blob().catch(e => {
          this.openDialog({
            slot: "commonComfirm",
            header: false,
            other: "PDFファイルのダウンロードに失敗しました。"
          });
        });
        if (blob) downloadBlob(blob, "交通費精算.pdf");
      } else {
        if (isMobile) {
          this.openDialog({
            slot: "commonComfirm",
            header: false,
            other:
              "お使いの端末での未認証/オフライン印刷はサポートしていません。"
          });
          return;
        }
        var date = this.baseDate;
        this.$router.push(`/pdf/${date.getFullYear()}/${date.getMonth() + 1}`);
      }
    } finally {
      this.isFileDownloading = false;
    }
  }

  async mounted() {
    this.baseDate = firstDayOfMonth(new Date());
    this.updateList();
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
    z-index: 10;

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

  @include pc {
    display: none;
  }

  &__icon {
    color: #2196f3;
    font-size: 44px;
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
  transition: opacity 0.5s, transform 0.5s, background-color 0.3s,
    box-shadow 0.3s;
  width: 100%;
}
.list-item-enter,
.list-item-leave-to {
  opacity: 0;
}
.list-item-leave-active {
  position: absolute;
}
@include sp {
  .k-bulk-update-btns {
    display: none;
  }
  .k-bulk-insert-btn {
    display: none;
  }
}
</style>
