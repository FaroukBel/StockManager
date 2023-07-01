
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
          :style="{ color: 'rgb(73, 249, 3) !important' }"
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
          :style="{ color: 'rgb(73, 249, 3) !important' }"
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
          :style="{ color: 'rgb(73, 249, 3) !important' }"
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
          :style="{ color: 'rgb(73, 249, 3) !important' }"

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
          :style="{ color: 'rgb(73, 249, 3) !important' }"
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
          :style="{ color: 'rgb(73, 249, 3) !important' }"

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
const currentDate = new Date();
const formattedDate = currentDate.toLocaleString('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});
export default {
  
  data() {
    return {
      
      transaction: {
        date: formattedDate,
        stock: '',
        type: 'Vente',
        quantity: '',
        sellprice: '',
        total: '',
        tax: '',
        totalcom: ''
      },
      valeurOptions: [  "AFMA SA",
  "Afric Industries Sa",
  "Afriquia Gaz",
  "Agma Lahlou-Tazi",
  "Akdital",
  "Alliances",
  "Aluminum du Maroc",
  "Aradei Capital",
  "Atlanta",
  "Attijariwafa Bank",
  "Auto Hall",
  "Auto Nejma",
  "Balima",
  "BCP",
  "Bmce Bank",
  "Cartier Saada",
  "CDM",
  "CIH",
  "Ciments Du Maroc",
  "Colorado",
  "Compagnie Sucrerie Marocaine",
  "CTM",
  "Dari Couspate",
  "Delattre Levivier Maroc",
  "Delta Holding S.A",
  "Disty Tech",
  "Disway",
  "Douja Prom Addoha",
  "Ennakl Automobiles SA",
  "Fenie Brossette",
  "Hps",
  "IB Maroc Com",
  "Immorente Invest",
  "Involys",
  "Itissalat Al-Maghrib",
  "Jet Contractors",
  "Label Vie",
  "LafargeHolcim Maroc",
  "Les Eaux Minerales Oulmes",
  "Lesieur Cristal",
  "M2M Group",
  "Maghreb Oxygene",
  "Maghrebail",
  "Managem",
  "Maroc Leasing",
  "Marocaine pour le Commerce et l’Industrie Banque",
  "Marocaine Ste de Therapeutique",
  "Med Paper",
  "Micro Data SA",
  "Miniere Touissit",
  "Mutandis",
  "Nationale d’Electrolyse et de Petrochimie Ste",
  "Realis. Mecaniques",
  "Rebab Company",
  "Residences Dar Saada",
  "Risma",
  "S2M",
  "Salafin",
  "Sanlam Maroc",
  "SMI",
  "Societe des Boissons du Maroc",
  "Societe d’Exploitation des Ports",
  "Societe Equipement",
  "Ste de Travaux de Realisation d’Ouvrages et de Con",
  "Ste Nationale de Siderurgie",
  "Ste Promotion Pharmaceutique du Maghreb",
  "Stokvis Nord Afrique",
  "Taqa Morocco SA",
  "Timar",
  "Total Maroc SA",
  "Travaux Generaux De Construction",
  "Unimer",
  "Wafa Assurance",
  "Zellidja S.A"], // Static list of dropdown options
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

