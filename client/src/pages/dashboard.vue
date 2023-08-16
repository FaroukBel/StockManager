<script setup>
import AnalyticsCongratulations from '@/views/dashboard/AnalyticsCongratulations.vue'
import AnalyticsFinanceTabs from '@/views/dashboard/AnalyticsFinanceTab.vue'
import AnalyticsOrderStatistics from '@/views/dashboard/AnalyticsOrderStatistics.vue'
import AnalyticsProfitReport from '@/views/dashboard/AnalyticsProfitReport.vue'
import AnalyticsTotalRevenue from '@/views/dashboard/AnalyticsTotalRevenue.vue'
import AnalyticsTransactions from '@/views/dashboard/AnalyticsTransactions.vue'
import TransactionForm from '@/views/pages/form-layouts/TransactionForm.vue'
import ValuesHistoryTable from '@/views/pages/tables/ValuesHistoryTable.vue'
import MedianPrice from '@/views/dashboard/MedianPrice.vue'
import BuyForm from '@/views/pages/form-layouts/BuyForm.vue'
import SellForm from '@/views/pages/form-layouts/SellForm.vue'
import Shares from '@/views/pages/form-layouts/Shares.vue'
// 👉 Images
import chart from '@images/cards/chart-success.png'
import card from '@images/cards/credit-card-primary.png'
import paypal from '@images/cards/paypal-error.png'
import wallet from '@images/cards/wallet-info.png'

</script>

<template>
  <VRow>
    <VCol cols="12" md="8">
      <VCard title="Ajouter une transaction">
        <VCardText>

          <TransactionForm @TransactionAdded="updateTransTable" />

        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 Transactions -->
    <VCol cols="12" md="4">
      <AnalyticsTransactions @TransactionAdded="updateTransTable" :key="transTable" />
    </VCol>
    <VCol cols="12" md="6">
      <MedianPrice />
    </VCol>
    <VCol cols="12" md="6" class="d-flex flex-row">

          <Shares @addShareTransaction="updateTable" />
    
    </VCol>


    <VCol cols="12" md="6" class="d-flex flex-row">
      <VCard title="Achat">
        <VCardText>
          <BuyForm @buyTransactionAdded="updateTable" />

        </VCardText>

      </VCard>
    </VCol>

    <VCol cols="12" md="6" class="d-flex flex-row">

      <VCard title="Vente">
        <VCardText>

          <SellForm @sellTransactionAdded="updateTable" />
        </VCardText>

      </VCard>
    </VCol>
    <!-- 👉 Congratulations -->
    <VCol cols="12" md="12">
      <AnalyticsCongratulations :key="tableKey" />
    </VCol>

    <VCard class="text-center text-sm-start w-100">
      <VRow no-gutters>
        <VCol cols="12" sm="12" order="2" order-sm="1">

          <VCard title="Historique">

            <VCol cols="12" md="12">
              <ValuesHistoryTable :key="tableKey" />
            </VCol>
          </VCard>
        </VCol>

      </VRow>
    </VCard>


    <!-- 👉 Total Revenue -->
    <VCol cols="12" md="8" order="2" order-md="1">
      <AnalyticsTotalRevenue />
    </VCol>



    <VCol cols="12" sm="8" md="4" order="1" order-md="2">
      <VRow>
        <!-- 👉 Payments -->
        <VCol cols="12" sm="6">
          <CardStatisticsVertical v-bind="{
            title: 'Payments',
            image: paypal,
            stats: '$2,468',
            change: -14.82,
          }" />
        </VCol>

        <!-- 👉 Revenue -->
        <VCol cols="12" sm="6">
          <CardStatisticsVertical v-bind="{
            title: 'Transactions',
            image: card,
            stats: '$14,857',
            change: 28.14,
          }" />
        </VCol>
      </VRow>

      <VRow>
        <!-- 👉 Profit Report -->
        <VCol cols="12" sm="12">
          <AnalyticsProfitReport />
        </VCol>
      </VRow>
    </VCol>

    <!-- 👉 Order Statistics -->
    <VCol cols="12" md="4" sm="6" order="3">
      <AnalyticsOrderStatistics />
    </VCol>

    <!-- 👉 Tabs chart -->
    <VCol cols="12" md="4" sm="6" order="3">
      <AnalyticsFinanceTabs />
    </VCol>


  </VRow>
</template>
<script>
export default {

  data() {
    return {
      tableKey: 0,
      transTable: 0,
      tableDelete: 0
    }
  },

  methods: {
    updateTable() {
      this.tableKey++;
    },
    updateTransTable() {
      this.transTable++;
    }

  }
}
</script>
