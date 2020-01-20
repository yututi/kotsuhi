<template>
  <app-form v-if="data">
    <app-field label="日付">
      <app-datepicker v-model="date" :baseDate="baseDate" />
    </app-field>
    <app-field label="出発">
      <input type="text" maxlength="10" v-model="modifiedData.from" />
    </app-field>
    <app-field label=" ">
      <app-select :options="options" v-model="modifiedData.dirIcon" />
    </app-field>
    <app-field label="到着">
      <input type="text" maxlength="10" v-model="modifiedData.to" />
    </app-field>
    <app-field label="費用">
      <input type="number" v-model="modifiedData.cost" />
    </app-field>
    <app-field>
      <textarea class="k-textarea" placeholder="備考" rows="5" v-model="modifiedData.memo"></textarea>
    </app-field>
    <div class="k-form__btns">
      <app-btn v-if="data.id" label="削除" @click="onDelete" />
      <app-btn :label="data.id?'更新':'登録'" @click="onUpdate" />
    </div>
  </app-form>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import AppBtn from "@/components/Btn.vue";
import AppForm from "@/components/Form.vue";
import AppField from "@/components/Field.vue";
import AppSelect from "@/components/Select.vue";
import AppDatepicker from "@/components/DatePicker.vue";
import { Input } from "@/types/index";

const options = [
  { label: "往復", value: "arrows-alt-h" },
  { label: "片道", value: "long-arrow-alt-right" }
];

@Component({
  components: {
    AppBtn,
    AppField,
    AppForm,
    AppSelect,
    AppDatepicker
  }
})
export default class KotsuhiForm extends Vue {
  @Prop({ required: false })
  data?: Input;

  @Prop({ required: true })
  baseDate!: Date;

  modifiedData: Input | { date: number } = { date: 1 };

  get date() {
    const date = this.modifiedData.date;
    return date ? [date] : [];
  }

  set date(value) {
    this.modifiedData.date = value[0];
  }

  get options() {
    return options;
  }

  onUpdate() {
    this.$emit("update", this.modifiedData);
  }
  onDelete() {
    if (this.data) {
      this.$emit("delete", this.data.id);
    }
  }

  @Watch("data")
  onDataChanged(newVal: Input) {
    this.modifiedData = { ...newVal }; // shallow copy
  }
}
</script>