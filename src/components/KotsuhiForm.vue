<template>
  <app-form v-if="data">
    <app-field label="日付">
      <input type="text" v-model="modifiedData.date" />
    </app-field>
    <app-field label="FROM">
      <input type="text" v-model="modifiedData.from" />
    </app-field>
    <app-field label="FROM">
      <app-select :options="options" v-model="modifiedData.dirIcon" />
    </app-field>
    <app-field label="TO">
      <input type="text" v-model="modifiedData.to" />
    </app-field>
    <app-field>
      <textarea class="k-textarea" placeholder="備考" rows="5" v-model="modifiedData.memo"></textarea>
    </app-field>
    <div class="k-form__btns">
      <app-btn label="削除" @click="onDelete" />
      <app-btn label="更新" @click="onUpdate" />
    </div>
  </app-form>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import AppBtn from "@/components/Btn.vue";
import AppForm from "@/components/Form.vue";
import AppField from "@/components/Field.vue";
import AppSelect from "@/components/Select.vue";
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
    AppSelect
  }
})
export default class KotsuhiForm extends Vue {
  @Prop({ required: false })
  data!: Input;

  modifiedData: Input | {} = {};

  get options() {
    return options;
  }

  onUpdate() {
    this.$emit("update", this.modifiedData);
  }
  onDelete() {
    this.$emit("delete");
  }

  @Watch("data")
  onDataChanged(newVal: Input) {
    this.modifiedData = { ...newVal };
  }
}
</script>