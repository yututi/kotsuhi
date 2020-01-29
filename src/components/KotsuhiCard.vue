<template>
  <div class="k-card">
    <div class="k-card__date">
      <input type="checkbox" v-model="isChecked"/>
    </div>
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
      <app-btn label="編集" @click="$emit('modClick', input)" />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import AppBtn from "@/components/Btn.vue";
import { Input } from "@/types/index";

@Component({
  components: {
    AppBtn
  }
})
export default class KotsuhiCard extends Vue {
  @Prop({ type: Object, required: false })
  input!: Input;

  @Prop({type:Number})
  month! : number;

  @Prop({ type: Boolean, required: false, default: true })
  isChecked!: boolean;
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
</style>