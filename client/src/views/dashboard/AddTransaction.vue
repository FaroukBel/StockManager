<template>
  <div>
    <h1>Create Transaction</h1>
    <form @submit.prevent="submitForm">
      <label for="date">Date:</label>
      <input type="date" id="date" v-model="transaction.date" required>

      <label for="value">Value:</label>
      <input type="text" id="value" v-model="transaction.value" required>

      <label for="designation">Designation:</label>
      <input type="text" id="designation" v-model="transaction.designation" required>

      <label for="quantity">Quantity:</label>
      <input type="text" id="quantity" v-model="transaction.quantity" required>

      <label for="price">Price:</label>
      <input type="text" id="price" v-model="transaction.price" required>

      <label for="brut">Brut:</label>
      <input type="text" id="brut" v-model="transaction.brut" required>

      <label for="tax">Tax:</label>
      <input type="text" id="tax" v-model="transaction.tax" required>

      <label for="net">Net:</label>
      <input type="text" id="net" v-model="transaction.net" required>

      <button type="submit">Save</button>
    </form>
  </div>
</template>

<script>
import TransactionsService from '@/services/TransactionsService';

export default {
  data() {
    return {
      transaction: {
        date: '',
        value: '',
        designation: '',
        quantity: '',
        price: '',
        brut: '',
        tax: '',
        net: '',
      },
    };
  },
  methods: {
    submitForm() {
      TransactionsService.post(this.transaction)
        .then(() => {
          // Reset form fields after successful submission
          this.transaction = {
            date: '',
            value: '',
            designation: '',
            quantity: '',
            price: '',
            brut: '',
            tax: '',
            net: '',
          };
          alert('Transaction saved successfully!');
        })
        .catch((error) => {
          console.error(error);
          alert('Failed to save transaction.');
        });
    },
  },
};
</script>
