
<template>


  <VForm ref="myForm" @submit.prevent>
    <VRow>
      <!-- 👉 Valeur dropdown -->
      <VCol cols="12" md="6">
          <VSelect
            v-model="stock"
            :items="valeurOptions"
            label="Valeur"
            placeholder="Select a valeur"
            required
          />
        </VCol>

      <!-- 👉 Quantity -->
      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          v-model="quantity"
          label="Quantité"
          placeholder="2341"
          type="number"
        />
      </VCol>

      <!-- 👉 Buy Price -->
      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          v-model="buyprice"
          label="Prix d'achat"
          placeholder="12.34"
          type="number"
        />
      </VCol>

      <!-- 👉 Sell Price -->
      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          v-model="sellprice"
          label="Prix de vente"
          placeholder="23.53"
          type="number"
        />
      </VCol>

      <!-- 👉 Total -->
      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          v-model="total"
          label="Total"
          placeholder="3452.45"
          readonly
          type="number"
        />
      </VCol>

      <!-- 👉 +/- Value -->
      <VCol
        cols="12"
        md="6"
      >
        <VTextField

          v-model="pl"
          label="+/- Value"
          placeholder="3200.42"
          readonly
          type="number"
        />
      </VCol>
      <!-- 👉 TotalGain -->
      <VCol
        cols="12">
        <VTextField

          v-model="totalgain"
          label="Total + Gain"
          placeholder="3200.42"
          readonly
          type="number"
        />
      </VCol>

      <VCol
        cols="12"
        class="d-flex gap-4"
      >
        <VBtn 
        @click="submitForm">
          Submit
        </VBtn>

        <VBtn
          type="reset"
          color="secondary"
          variant="tonal"
          
        >
          Reset
        </VBtn>
      </VCol>
    </VRow>
  </VForm>

</template>

<script>
import TransactionService from '@/services/TransactionService';

export default {
  data() {
    return {
      transaction: {
        stock: '',
        quantity: '',
        buyprice: '',
        sellprice: '',
        total: '',
        pl: '',
        totalgain: ''
      },
      valeurOptions: ['Option 1', 'Option 2', 'Option 3'], // Static list of dropdown options
    };
  },
  methods: {
    submitForm() {
      TransactionService.post(this.transaction)
        .then(() => {
          // Reset form fields after successful submission
          this.transaction = {
            stock: '',
            quantity: '',
            buyprice: '',
            sellprice: '',
            total: '',
            pl: '',
            totalgain: ''
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
