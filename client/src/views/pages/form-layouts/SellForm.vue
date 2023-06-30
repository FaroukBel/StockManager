
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

      <!-- 👉 Quantity -->
      <VCol
        cols="12"
        md="6"
      >
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
      <VCol
        cols="12"
        md="6"
      >
    
        <VTextField
          v-model="transaction.sellprice"
          label="Prix de vente"
          placeholder="12.34"
          type="number"
          min="0"
          required
        />
      </VCol>
<!-- 👉 Commision -->
<VCol
        cols="12"
        md="6"
      >
        <VTextField
          v-model="transaction.tax"
          label="Commision"
          placeholder="3452.45"
          readonly
          type="number"
        />
      </VCol>

      <!-- 👉 Total -->
      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          v-model="transaction.total"
          label="Total"
          placeholder="3452.45"
          readonly
          type="number"
        />
      </VCol>


  <!-- 👉 Total -->
  <VCol
        cols="12"
        md="12"
      >
        <VTextField
          v-model="transaction.totalcom"
          label="Total - Commission"
          placeholder="3452.45"
          readonly
          type="number"
        />
      </VCol>

      <VCol
        cols="12"
        class="d-flex gap-4"
      >
        

        <VBtn
        
          color="secondary"
          variant="tonal"
          @click="clearForm"
        >
          Effacer
        </VBtn>
        <VBtn 
        @click="submitForm"
        color="error">
          Vendre
          
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
        type: 'Vente',
        quantity: '',
        sellprice: '',
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
    'transaction.sellprice': {
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
      const sellprice = parseFloat(this.transaction.sellprice);
      if (!isNaN(quantity) && !isNaN(sellprice)) {
        this.transaction.total = (quantity * sellprice).toFixed(2);
      } else {
        this.transaction.total = '';
      }
    },
    calculatePL() {
  const quantity = parseFloat(this.transaction.quantity);
  const sellprice = parseFloat(this.transaction.sellprice);
  if (!isNaN(quantity) && !isNaN(sellprice)) {
    const sellExitTax = quantity * sellprice * 0.007665;
    this.transaction.tax = sellExitTax.toFixed(2);
    this.transaction.totalcom = this.transaction.total - this.transaction.tax;
    
  } else {
    this.transaction.exitSellPrice = '';
  }

    },
  

    async submitForm() {

      if (
    !this.transaction.stock ||
    !this.transaction.quantity ||
    !this.transaction.sellprice ||
    !this.transaction.total ||
    !this.transaction.totalcom
  ) {
    alert('Veuillez remplir les champs obligatoires.');
    return;
  }

  HistoryTransactionsService.postSell(this.transaction)
        .then(() => {
          // Reset form fields after successful submission
          this.transaction = {
            stock: '',
            quantity: '',
            sellprice: '',
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
            sellprice: '',
            total: '',
            totalcom: ''
      }
         
    },
  },
};
</script>

