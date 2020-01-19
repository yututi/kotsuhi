<template>
  <app-layout>
    <template v-slot:header-btns>
      <app-btn label="PDF" dark />
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
      <app-modal v-model="showInputForm" title="交通費入力">
        <template v-slot:body>
          <k-form :data="selected"/>
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
import KForm from "@/components/KotsuhiForm.vue"
import { Input } from "@/types/index";

@Component({
  components: {
    AppLayout,
    AppBtn,
    AppModal,
    KForm
  }
})
export default class Main extends Vue {
  month = 1;
  inputList: Input[] = [
    {
      date: 1,
      from: "鹿児島",
      to: "東京",
      cost: 1000,
      memo: "ほげほげ",
      dirIcon: "arrows-alt-h"
    },
    {
      date: 2,
      from: "鹿児dd島",
      to: "東京",
      cost: 10200,
      memo: "ほげほげdssssssssssssssssssss",
      dirIcon: "long-arrow-alt-right"
    }
  ];
  selected: Input | null = null;
  showInputForm: boolean = false;
  onModBtnClicked(input: Input) {
    this.selected = input;
    this.showInputForm = true;
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
</style>
