<script setup>
  import { ref } from 'vue';

  import TransactionService from '@/services/TransactionService';

  const moreList = []; // Define your 'moreList' data if required

  const transactions = ref([]);

  async function fetchTransactions() {
    try {
      const response = await TransactionService.index();
      transactions.value = response.data;
    } catch (error) {
      console.error(error);
    }
  }

  fetchTransactions();
</script>
<template>
  <v-card >
    <v-card-title>
      <div class="d-flex align-center justify-space-between">
        <div>Transactions</div>
        <v-btn @click="clearTransactions" color="error">Vider</v-btn>
      </div>
    </v-card-title>
    
    <v-card-text style="max-height: 488px; overflow-y: auto;">
      <v-list class="card-list">
        <v-list-item v-for="transaction in transactions" :key="transaction.id">

          <v-list-item-title>
            {{ transaction.stock }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-disabled mb-1">
            {{ transaction.quantity }}
          </v-list-item-subtitle>
          

          <template #append>
  <v-list-item-action>
    <span :class="transaction.pl < 0 ? 'text-red' : 'text-green'" class="me-1">{{ transaction.pl }}</span>
    <span class="text-disabled">DH</span>
  </v-list-item-action>
  <!-- <v-list-item-action>
            <v-btn @click="deleteTransaction(transaction.id)" icon small color="error">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-list-item-action> -->
</template>

        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  
  data() {
    return {
      
    }},

    computed: {


    },

    methods: {
      async clearTransactions() {
    try {  
        await TransactionService.delete();
        this.$emit('TransactionAdded');
      } 
    catch (error) {
        console.error(error);
      }
  },

    },


    
  
}

</script>
<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 1.6rem;
}
</style>
<style>
.text-red {
  color: rgb(var(--v-theme-error));
}

.text-green {
  color: rgb(var(--v-theme-success));
}
</style>
