<template>
  <div class="k-layout">
    <header class="k-layout__header">
      <span class="k-layout__title">交通費精算</span>
      <div class="k-layout__btns">
        <slot name="header-btns" />
      </div>
    </header>
    <article class="k-layout__body">
      <slot name="body" />
    </article>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Btn from "@/components/Btn.vue";

@Component({
  components: {
    Btn
  }
})
export default class Layout extends Vue {
  @Prop({ type: String, required: false, default: "" })
  label!: string;

  onclick(e: any) {
    this.$emit("click", e);
  }
}
</script>
<style lang="scss">
.k-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  &__header {
    padding: 10px;
    align-items: center;
    display: flex;
    color: white;
    border-bottom: 1px solid gainsboro;
    background-color: #3367d6;
    border: 1px solid transparent;
    box-shadow: 0 3px 4px 0 rgba(0,0,0,.2), 0 3px 3px -2px rgba(0,0,0,.14), 0 1px 8px 0 rgba(0,0,0,.12);
  }

  &__title {
    flex: 1;
    font-size: 26px;
  }

  &__body {
    flex: 1;
  }
}
</style>