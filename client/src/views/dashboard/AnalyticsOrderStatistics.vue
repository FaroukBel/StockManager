<script setup>
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import { hexToRgb } from '@layouts/utils'
import HistoryTransactionsService from '@/services/HistoryTransactionsService';
const vuetifyTheme = useTheme();

const transactions = ref([]);

async function fetchTransactions() {
  try {
    const response = await HistoryTransactionsService.index();
    transactions.value = response.data;

    // Calculate the buy and sell totals for each value
    const nameTotals = {};

    transactions.value.forEach(transaction => {
      const { value, type, quantity } = transaction;
      const totalcomValue = parseFloat(quantity);

      if (!nameTotals[value]) {
        nameTotals[value] = { value, quantityTotal: 0 };
      }
      if (type === "Achat")
        nameTotals[value].quantityTotal += totalcomValue;

    });

    // Now, nameTotals array contains the desired totals for each unique value
    const nameTotalsArray = Object.values(nameTotals).map((quantity) => quantity);
    console.log(nameTotalsArray)

    // Assign the nameTotalsArray to the v-model or any data property you prefer to use in v-data-table
    transactions.value = nameTotalsArray;

    console.log()
  } catch (error) {
    console.error(error);
  }
}

onMounted(() => {
  fetchTransactions();
})


const series = [
  10,
  60,
  10,
  20,
  50,
  40,
]

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
  const disabledTextColor = `rgba(${hexToRgb(String(currentTheme['on-surface']))},${variableTheme['disabled-opacity']})`
  const primaryTextColor = `rgba(${hexToRgb(String(currentTheme['on-surface']))},${variableTheme['high-emphasis-opacity']})`

  return {
    chart: {
      sparkline: { enabled: true },
      animations: { enabled: false },
    },
    stroke: {
      width: 6,
      colors: [currentTheme.surface],
    },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    labels: [
      transactions.value
    ],
    colors: [
      currentTheme.success,
      currentTheme.primary,
      currentTheme.secondary,
      currentTheme.info,
    ],
    grid: {
      padding: {
        top: -7,
        bottom: 5,
      },
    },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } },
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: {
              offsetY: 17,
              fontSize: '14px',
              color: disabledTextColor,
              fontFamily: 'Public Sans',
            },
            value: {
              offsetY: -17,
              fontSize: '24px',
              color: primaryTextColor,
              fontFamily: 'Public Sans',
            },
            total: {
              show: true,
              label: 'Weekly',
              fontSize: '14px',
              formatter: () => '38%',
              color: disabledTextColor,
              fontFamily: 'Public Sans',
            },
          },
        },
      },
    },
  }
})

const orders = [
  {
    amount: '82.5k',
    title: 'Electronic',
    avatarColor: 'primary',
    subtitle: 'Mobile, Earbuds, TV',
    avatarIcon: 'bx-mobile-alt',
  },
  {
    amount: '23.8k',
    title: 'Fashion',
    avatarColor: 'success',
    subtitle: 'Tshirt, Jeans, Shoes',
    avatarIcon: 'bx-closet',
  },
  {
    amount: 849,
    title: 'Decor',
    avatarColor: 'info',
    subtitle: 'Fine Art, Dining',
    avatarIcon: 'bx-home',
  },
  {
    amount: 99,
    title: 'Sports',
    avatarColor: 'secondary',
    subtitle: 'Football, Cricket Kit',
    avatarIcon: 'bx-football',
  },
]

const moreList = [
  {
    title: 'Share',
    value: 'Share',
  },
  {
    title: 'Refresh',
    value: 'Refresh',
  },
  {
    title: 'Update',
    value: 'Update',
  },
]
</script>

<template>
  <VCard>
    <VCardItem class="pb-3">
      <VCardTitle class="mb-1">
        Order Statistics
      </VCardTitle>
      <VCardSubtitle>42.82k Total Sales</VCardSubtitle>

      <template #append>
        <div class="me-n3 mt-n8">
          <MoreBtn :menu-list="moreList" />
        </div>
      </template>
    </VCardItem>

    <VCardText>
      <div class="d-flex align-center justify-space-between mb-3">
        <div class="flex-grow-1">
          <h4 class="text-h4 mb-1">
            8,258
          </h4>
          <span>Total Orders</span>
        </div>

        <div>
          <VueApexCharts type="donut" :height="125" width="105" :options="chartOptions" :series="series" />
        </div>
      </div>

      <VList class="card-list mt-7">
        <VListItem v-for="order in orders" :key="order.title">
          <template #prepend>
            <VAvatar rounded variant="tonal" :color="order.avatarColor">
              <VIcon :icon="order.avatarIcon" />
            </VAvatar>
          </template>

          <VListItemTitle class="mb-1">
            {{ order.title }}
          </VListItemTitle>
          <VListItemSubtitle class="text-disabled">
            {{ order.subtitle }}
          </VListItemSubtitle>

          <template #append>
            <span>{{ order.amount }}</span>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 21px;
}
</style>
