<script setup>
import { VDataTable } from 'vuetify/labs/VDataTable'
const HistoryTableHeaders = [
  {
    title: 'Date',
    key: 'date',
  },
  {
    title: 'Valeur',
    key: 'value',
  },
  {
    title: 'Type',
    key: 'type',
  },
  {
    title: 'Quantité',
    key: 'quantity',
  },
  {
    title: 'Cours',
    key: 'price',
  },
  {
    title: 'Brut',
    key: 'brut',
  },
  {
    title: 'Commision',
    key: 'tax',
  },
  {
    title: 'Net',
    key: 'net',
  },
]
</script>

<template>
  <VDataTable
    height="500"
    fixed-header
    :headers="HistoryTableHeaders"
    :items="transactions"
    class="text-no-wrap rounded-0 text-sm"
  >
    
    
  </VDataTable>
</template>


<script>
import HistoryTransactionsService from '@/services/HistoryTransactionsService';

export default {
  data() {
    return {
      transactions: [],
    };
  },
  created() {
    this.fetchTransactions();
  },
  methods: {
    async fetchTransactions() {
      HistoryTransactionsService.index()
        .then((response) => {
          this.transactions = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    
  },
};
</script>
