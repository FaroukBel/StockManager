<template>
  <VTable
    height="250"
    fixed-header
  >
    <thead>
      <tr>
        <th class="text-uppercase">
          Date
        </th>
        <th>
          Valeur
        </th>
        <th>
          Quantité
        </th>
        <th>
          Cours
        </th>
        <th>
          Brut
        </th>
        <th>
          Commissions
        </th>
        <th>
          Net
        </th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="transaction in transactions" :key="transaction.id">
          <td>{{ transaction.date }}</td>
          <td>{{ transaction.value }}</td>
          <td>{{ transaction.designation }}</td>
          <td>{{ transaction.quantity }}</td>
          <td>{{ transaction.price }}</td>
          <td>{{ transaction.brut }}</td>
          <td>{{ transaction.tax }}</td>
          <td>{{ transaction.net }}</td>
        </tr>
    </tbody>
  </VTable>
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
