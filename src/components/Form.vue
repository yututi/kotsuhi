<template>
  <div class="k-form">
    <slot />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Form extends Vue {

}
</script>
<style lang="scss">
.k-form {

  .k-field:not(:first-child) {
    margin-top: 5px;
  }

  &__btns {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>