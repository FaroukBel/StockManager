<script setup>

const desserts = [
  {
    dessert: 'Frozen Yogurt',
    calories: 159,
    fat: 6,
    carbs: 24,
    protein: 4,
  },
  {
    dessert: 'Ice cream sandwich',
    calories: 237,
    fat: 6,
    carbs: 24,
    protein: 4,
  },
  {
    dessert: 'Eclair',
    calories: 262,
    fat: 6,
    carbs: 24,
    protein: 4,
  },
  {
    dessert: 'Cupcake',
    calories: 305,
    fat: 6,
    carbs: 24,
    protein: 4,
  },
  {
    dessert: 'Gingerbread',
    calories: 356,
    fat: 6,
    carbs: 24,
    protein: 4,
  },
]
</script>

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
import TransactionsService from '@/services/TransactionsService';

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
    fetchTransactions() {
      TransactionsService.index()
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
