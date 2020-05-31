<template>
  <app-form class="k-multiple-form">
    <app-field label-top label="日付">
      <app-datepicker multiple readonly v-model="selectedDates" :baseDate="baseDate" />
    </app-field>
    <app-field shield label="用務先" @unshield="updateInfo.isContactUpdated = true">
      <input type="text" autocomplete maxlength="30" v-model="modifiedData.contact" />
    </app-field>
    <app-field shield label="出発" @unshield="updateInfo.isFromUpdated = true">
      <input type="text" autocomplete maxlength="30" v-model="modifiedData.from" />
    </app-field>
    <app-field shield label="到着" @unshield="updateInfo.isToUpdated = true">
      <input type="text" autocomplete maxlength="30" v-model="modifiedData.to" />
    </app-field>
    <app-field shield label="交通手段" @unshield="updateInfo.isTransportationUpdated = true">
      <app-select :options="options" v-model="modifiedData.transportation"></app-select>
    </app-field>
    <app-field shield label="往復" vertical-center @unshield="updateInfo.isRoundTripUpdated = true">
      <app-check v-model="modifiedData.isRoundTrip"></app-check>
    </app-field>
    <app-field shield label="費用" unit="円" @unshield="updateInfo.isCostUpdated = true">
      <app-input-num v-model="modifiedData.cost" />
    </app-field>
    <app-field shield label-top label="備考" @unshield="updateInfo.isMemoUpdated = true">
      <textarea class="k-textarea" rows="5" v-model="modifiedData.memo"></textarea>
    </app-field>
    <div class="k-form__btns">
      <app-btn-group>
        <app-btn label="更新" outline @click="onUpdate" />
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
import { Input, defaultInput, TransportationTypes, UpdateInfo } from "@/types/index";

const options = TransportationTypes;

var updatedList: string[] = [];

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
export default class KotsuhiBulkUpdateForm extends Vue {
  @Prop({ required: true })
  baseDate!: Date;

  @Prop({ required: true, default: () => [] })
  selectedDates!: number[];

  modifiedData: Input = defaultInput();

  updateInfo: UpdateInfo = new UpdateInfo();

  get options() {
    return options;
  }

  get cost() {
    return this.modifiedData.cost;
  }

  get roundTrip() {
    return this.modifiedData.isRoundTrip;
  }

  onUpdate() {
    this.$emit("update", {
      input: this.modifiedData,
      info: this.updateInfo
    });
  }

}
</script>
<style lang="scss">
.k-multiple-form {
  min-width: 400px;
}
</style>