<template>
  <div id="app">
    <router-view />
    <app-modal v-model="isLoading">
      <app-circular style="width:50px;height:50px;"></app-circular>
    </app-modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppModal from "@/components/Modal.vue";
import AppCircular from "@/components/Circular.vue";
import global from "@/globalStateModule";

@Component({
  components: {
    AppModal,
    AppCircular
  }
})
export default class App extends Vue {
  get isLoading() {
    return global.isLoading;
  }
}
</script>

<style lang="scss">
</style>