<template>
  <div class="k-card" @click="$emit('modClick', input)">
    <div class="k-card__check" @click.stop>
      <app-check v-model="input.isChecked"></app-check>
    </div>
    <div class="k-card__block k-card__head-block k-card-block">
      <div class="k-card-block__head">{{month}}月{{input.date}}日</div>
      <div class="k-contact k-card-block__body">{{input.contact || "---"}}</div>
    </div>
    <div class="k-card__divider"></div>
    <div class="k-card__detail">
      <div class="k-card-block">
        <div class="k-card-block__head">{{getTransportation(input)}}</div>
        <div class="k-card-block__body">
          <div class="k-card__from">{{input.from||"---"}}</div>
          <div class="k-card__arrow">
            <fa-icon :icon="getIcon(input)" />
          </div>
          <div class="k-card__to">{{input.to||"---"}}</div>
        </div>
      </div>
      <div class="k-card__cost">{{toLocaleString(input.cost)}} 円</div>
    </div>
    <div class="k-card__divider k-hide-on-sp"></div>
    <div class="k-card__memo">{{input.memo}}</div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import AppBtn from "@/components/Btn.vue";
import AppCheck from "@/components/Check.vue";
import { Input, TransportationTypes } from "@/types/index";

const transportationMap = new Map<string, string>();
TransportationTypes.forEach(type => {
  transportationMap.set(type.value, type.label);
});

@Component({
  components: {
    AppBtn,
    AppCheck
  }
})
export default class KotsuhiCard extends Vue {
  @Prop({ type: Object, required: false })
  input!: Input;

  @Prop({ type: Number })
  month!: number;

  toLocaleString(num: number) {
    if (num == null) {
      return "0";
    }
    return num.toLocaleString();
  }

  getIcon(input: Input) {
    return input.isRoundTrip ? "exchange-alt" : "long-arrow-alt-right";
  }

  getTransportation(input: Input) {
    return transportationMap.get(input.transportation);
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
  padding: 6px;
  color: dimgray;

  &:hover {
    border-color: orange;
    box-shadow: 0 0 4px 1px gainsboro;
  }

  @include sp {
    padding: 10px;
    flex-direction: column;
  }

  &__detail {
    font-size: 12px;
  }

  &__check {
    width: 40px;
    height: 40px;
    margin-right: 6px;
    display: flex;
    align-items: center;
    justify-content: center;

    @include sp {
      display: none;
    }
  }

  &__head-block {
    width: 160px;
    @include sp {
      text-align: initial;
      width: 100px;
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
    width: 400px;
    @include sp {
      padding-left: 10px;
      flex: 1;
    }
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__transportation {
    width: 60px;
  }

  &__cost {
    flex: 1;
    text-align: right;
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
  }

  &__from,
  &__to {
    min-width: 2em;
    text-align: center;
  }
}

.k-card-block {
  display:flex;
  flex-direction: column;

  &__head {
    font-size: 14px;
    line-height: 14px;
  }

  &__body {
    margin-top: 4px;
    display: flex;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    & > *:not(:first-child) {
      margin-left: 5px;
    }
  }
}

.k-hide-on-sp {
  @include sp {
    display: none;
  }
}
</style>