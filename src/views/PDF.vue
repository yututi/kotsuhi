<template>
  <!-- Each sheet element should have the class "sheet" -->
  <!-- "padding-**mm" is optional: you can set 10, 15, 20 or 25 -->
  <section class="sheet">
    <!-- Write HTML just like a web page -->
    <article>This is an A5 document.</article>super duper pdf.
  </section>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppLayout from "@/components/Layout.vue";
import AppBtn from "@/components/Btn.vue";
import AppModal from "@/components/Modal.vue";
import KForm from "@/components/KotsuhiForm.vue";
// import { Input } from "@/types/index";
// import { firstDayOfMonth, lastDayOfMonth } from "@/utils";
// import { saveAs } from "file-saver";
// import jspdf from "jspdf";


@Component({
  components: {
    AppLayout,
    AppBtn,
    AppModal,
    KForm
  }
})
export default class Main extends Vue {
  mounted() {
    if(document.body.classList.contains("A5")){
        document.body.classList.add("A5")
    }
    window.print();
  }
}
</script>
<style lang="scss">
@media print {
  .k-layout__header {
    display: none;
  }
  @page {
    margin: 0;
  }
}

@page {
  size: A5;
}
</style>
