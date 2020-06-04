<template>
  <div>
    <section
      class="sheet padding-10mm"
      v-for="(sectiondata, index) in inputPerSectionList"
      :key="index"
    >
      <div class="sheet__header">
        <div style="text-align:center;">
          <h2>交通費請求書</h2>
        </div>
        <div>
          {{year}}年 {{month}}月度 
        </div>
        <div style="text-align:right;">
          {{name}}
        </div>
      </div>
      <div class="sheet__body">
        <table>
          <thead>
            <tr>
              <th class="date">日</th>
              <th class="contact">用務先</th>
              <th class="from">出発</th>
              <th class="to">到着</th>
              <th class="tran">
                交通
                <br />手段
              </th>
              <th class="cost">交通費</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in sectiondata" :key="data.id">
              <td>{{`${month}/${data.ymd.getDate()}`}}</td>
              <td>{{data.contact}}</td>
              <td>{{data.from}}</td>
              <td>{{data.to}}</td>
              <td>{{transportationLabel(data.transportation)}}</td>
              <td>{{data.cost?data.cost.toLocaleString():0}}円</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="sheet__footer">
        <div class="sum-area">
          <table>
            <thead>
              <tr>
                <th v-for="tran in Object.values(transportations)" :key="tran">{{tran}}</th>
                <th>合計</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td v-for="tran in Object.keys(transportations)" :key="tran">{{calcSumByTran(tran)}} 円</td>
                <td>{{sum}} 円</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="stamp-area">
          <div class="stamp-area__stamp"></div>
          <div class="stamp-area__stamp"></div>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="js">
import db from "@/store";
import { firstDayOfMonth, lastDayOfMonth } from "@/utils";
import { TransportationTypes } from "@/types"

const tranMap = TransportationTypes.reduce((map, type) => {
  map[type.value] = type.label;
  return map;
}, {});

const ITEM_PER_PAGE = 30;
const PAGE_SIZE = "A4"

export default {
  data() {
    return {
      year: 2020,
      month:0,
      allInputList: [],
      inputPerSectionList: [],
      transportations: tranMap,
      name: "hoge太郎"
    }
  },
  computed: {
    sum: function() {
      return this.allInputList.reduce((sum, input) => {return sum + input.cost}, 0).toLocaleString()
    }
  },
  methods: {
    init: async function() {
      this.year = this.$route.params.year
      this.month = this.$route.params.month
      const ym = new Date(Number(this.year), Number(this.month) - 1, 1);

      const inputs = await db.inputs
        .where("ymd")
        .between(
          firstDayOfMonth(ym),
          lastDayOfMonth(ym),
          true,
          true
        )
        .sortBy("date");
      this.allInputList = inputs.slice();
      var page = 0;
      while(inputs.length) {
        this.inputPerSectionList.push(inputs.splice(page * ITEM_PER_PAGE, page * ITEM_PER_PAGE + ITEM_PER_PAGE));
      }
    },
    transportationLabel(value) {
      return tranMap[value]
    },
    calcSumByTran(value) {
      return this.allInputList.filter(input => input.transportation === value).reduce((sum, input) => {return sum + input.cost}, 0).toLocaleString();
    }
  },
  mounted: function() {
    if(!document.body.classList.contains(PAGE_SIZE)){
        document.body.classList.add(PAGE_SIZE)
    }
    this.init();
  },
  beforeRouteLeave: function(f,t,n) {
    if(document.body.classList.contains(PAGE_SIZE)){
        document.body.classList.remove(PAGE_SIZE)
    }
    n()
  }
}
</script>
<style lang="scss">
@import "../styles/paper.css";

.sheet {
  font-size: 14px;

  table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #333;
    table-layout: fixed;
  }
  th,
  td {
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-collapse: collapse;
    border: 1px solid #333;
  }
  th.date {
    width: 10mm;
  }
  th.contact {
    width: 20mm;
  }
  th.from {
    width: 20mm;
  }
  th.to {
    width: 20mm;
  }
  th.tran {
    width: 15mm;
  }
  th.cost {
    width: 15mm;
  }

  display: flex;
  flex-direction: column;

  &__header {
    margin-bottom: 5mm;
  }
  &__body {
    flex: 1;
    overflow: hidden;
  }
  &__footer {
  }
}

.stamp-area {
  margin-top: 5mm;
  display: flex;
  justify-content: flex-end;

  &__stamp {
    margin-left: 3mm;
    border: 1px solid black;
    width: 30mm;
    height: 30mm;
    border-collapse: collapse;
  }
}

@page {
  size: A4;
  margin: 0;
}
</style>
