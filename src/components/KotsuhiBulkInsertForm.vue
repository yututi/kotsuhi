<template>
  <app-form class="k-multiple-form">
    <app-field label-top label="日付">
      <app-datepicker multiple v-model="dates" :baseDate="baseDate" />
    </app-field>
    <app-field label="用務先">
      <input type="text" autocomplete maxlength="30" v-model="modifiedData.contact" />
    </app-field>
    <app-field label="出発">
      <input type="text" autocomplete maxlength="30" v-model="modifiedData.from" />
    </app-field>
    <app-field label="到着">
      <input type="text" autocomplete maxlength="30" v-model="modifiedData.to" />
    </app-field>
    <app-field label="交通手段">
      <app-select :options="options" v-model="modifiedData.transportation"></app-select>
    </app-field>
    <app-field label="往復" vertical-center>
      <app-check v-model="modifiedData.isRoundTrip"></app-check>
    </app-field>
    <app-field label="費用" unit="円">
      <app-input-num v-model="modifiedData.cost" />
    </app-field>
    <app-field label-top label="備考">
      <textarea class="k-textarea" rows="5" v-model="modifiedData.memo"></textarea>
    </app-field>
    <div class="k-form__btns">
      <app-btn-group>
        <app-btn label="登録" outline @click="onInsert" />
      </app-btn-group>
    </div>
  </app-form>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import AppBtn from "@/components/Btn.vue";
import AppBtnGroup from "@/components/BtnGroup.vue";
import AppCheck from "@/components/Check.vue";
import AppForm from "@/components/Form.vue";
import AppField from "@/components/Field.vue";
import AppSelect from "@/components/Select.vue";
import AppDatepicker from "@/components/DatePicker.vue";
import AppInputNum from "@/components/InputNum.vue";
import { Input, defaultInput, TransportationTypes } from "@/types/index";

const options = TransportationTypes;

@Component({
  components: {
    AppBtn,
    AppBtnGroup,
    AppCheck,
    AppField,
    AppForm,
    AppSelect,
    AppDatepicker,
    AppInputNum
  }
})
export default class KotsuhiBulkInsertForm extends Vue {
  @Prop({ required: true })
  baseDate!: Date;

  dates: number[] = [];

  modifiedData: Input = defaultInput();

  get options() {
    return options;
  }

  get cost() {
    return this.modifiedData.cost;
  }

  get roundTrip() {
    return this.modifiedData.isRoundTrip;
  }

  onInsert() {
    this.$emit("insert", {
      dates: this.dates,
      input: this.modifiedData
    });
  }
}
</script>
<style lang="scss">
.k-multiple-form {
  min-width: 400px;
}
</style>