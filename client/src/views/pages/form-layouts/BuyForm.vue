<template>
  <VForm ref="myForm" @submit.prevent>
    <VRow>
      <!-- 👉 Valeur dropdown -->
      <VCol cols="12" md="12">
          <VSelect
            v-model="transaction.stock"
            :items="valeurOptions"
            label="Valeur"
            placeholder="Select a valeur"
            required
          />
        </VCol>


        <!-- 👉 Date -->
      <!-- <VCol cols="12" md="6">
        <v-date-picker
          v-model="transaction.date"
          label="Date"
          :value="currentDate"
          required
        />
      </VCol> -->


      <!-- 👉 Quantity -->
      <VCol cols="12" md="6">
        <VTextField
          v-model="transaction.quantity"
          label="Quantité"
          placeholder="2341"
          min="0"
          required
          type="number"
        />
      </VCol>

      <!-- 👉 Buy Price -->
      <VCol cols="12" md="6">
        <VTextField
          v-model="transaction.buyprice"
          label="Prix d'achat"
          placeholder="12.34"
          type="number"
          min="0"
          required
        />
      </VCol>

      <!-- 👉 Commission -->
      <VCol cols="12" md="6">
        <VTextField
          v-model="transaction.tax"
          label="Commission"
          placeholder="3452.45"
          readonly
          type="number"
          required
        />
      </VCol>

      <!-- 👉 Total -->
      <VCol cols="12" md="6">
        <VTextField
          v-model="transaction.total"
          label="Total"
          placeholder="3452.45"
          readonly
          type="number"
          required
        />
      </VCol>

      <!-- 👉 Total + Commission -->
      <VCol cols="12" md="12">
        <VTextField
          v-model="transaction.totalcom"
          label="Total + Commission"
          placeholder="3452.45"
          readonly
          type="number"
          required
        />
      </VCol>

      <VCol cols="12" class="d-flex gap-4">
        <VBtn color="secondary" variant="tonal" @click="clearForm">
          Effacer
        </VBtn>
        <VBtn @click="submitForm"  color="success">
          Acheter
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>


<script>
import HistoryTransactionsService from '@/services/HistoryTransactionsService';
import { router } from '@/router';

export default {
  data() {
    return {
      transaction: {
        date: new Date().toISOString().substr(0, 10),
        stock: '',
        type: 'Achat',
        quantity: '',
        buyprice: '',
        total: '',
        tax: '',
        totalcom: ''

      },
      valeurOptions: ["Attijariwafa Bank (ATW)",
  "Banque Centrale Populaire (BCP)",
  "BMCE Bank (BMC)",
  "Société Générale Marocaine de Banques (SGMB)",
  "Maroc Telecom (IAM)",
  "Addoha Group (ADD)",
  "LafargeHolcim Maroc (LHM)",
  "Centrale Laitière (CENTRA)",
  "Cosumar (CSR)",
  "Managem (MNG)",
  "Ciments du Maroc (CIM)",
  "Label'Vie (LABEL)",
  "Taqa Morocco (TAQA)",
  "CIH Bank (CIH)",
  "SODEP-Marsa Maroc (MARS)",
  "Stokvis Nord Afrique (SNA)",
  "Delattre Levivier Maroc (DLM)",
  "Wafa Assurance (WAA)",
  "Douja Promotion Groupe Addoha (DPA)",
  "Atlanta (ATL)"], // Static list of dropdown options
    };
  },
  watch: {
    'transaction.quantity': {
      handler(newValue) {
        this.calculateTotal();
      },
      immediate: true
    },
    'transaction.buyprice': {
      handler(newValue) {
        this.calculateTotal();
        
      },
      immediate: true
    },
    'transaction.total': {
      handler(newValue) {
        this.calculatePL();
      },
      immediate: true
    }
 
  },
  methods: {
    calculateTotal() {
      const quantity = parseFloat(this.transaction.quantity);
      const buyPrice = parseFloat(this.transaction.buyprice);
      if (!isNaN(quantity) && !isNaN(buyPrice)) {
        this.transaction.total = (quantity * buyPrice).toFixed(2);
      } else {
        this.transaction.total = '';
      }
    },
    calculatePL() {
  const quantity = parseFloat(this.transaction.quantity);
  const buyPrice = parseFloat(this.transaction.buyprice);
  if (!isNaN(quantity) && !isNaN(buyPrice)) {
    const buyEntryTax = quantity * buyPrice * 0.007665;
    this.transaction.tax = buyEntryTax.toFixed(2);
    this.transaction.totalcom = parseFloat(this.transaction.total) + parseFloat(this.transaction.tax);
  } else {
    this.transaction.entryBuyPrice = '';
  }

    },
    async submitForm() {
      if (
    !this.transaction.stock ||
    !this.transaction.quantity ||
    !this.transaction.buyprice ||
    !this.transaction.total ||
    !this.transaction.totalcom
  ) {
    alert('Veuillez remplir les champs obligatoires.');
    return;
  }
  HistoryTransactionsService.postBuy(this.transaction)
        .then(() => {
          // Reset form fields after successful submission
          this.transaction = {
            date: '',
            stock: '',
            quantity: '',
            type: '',
            buyprice: '',
            total: '',
            totalcom: ''
          };
          location.reload();

          alert('Transaction enregistrée avec succés!');
        })
        .catch((error) => {
          console.error(error);
          alert('Failed to save transaction.');
        });
    },
    async clearForm() {
   
          this.transaction = {
            stock: '',
            quantity: '',
            buyprice: '',
            total: '',
            totalcom: ''
          };
         
    },
  },
};
</script>

