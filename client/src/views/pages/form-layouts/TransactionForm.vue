
<template>
  <VForm ref="myForm" @submit.prevent>
    <VRow>
      <!-- 👉 Valeur dropdown -->
      <VCol cols="12" md="6">
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
          placeholder=""
          :style="{ color: 'rgb(73, 249, 3) !important' }"
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
          v-model="transaction.buyprice"
          label="Prix d'achat"
          placeholder=""
          :style="{ color: 'rgb(73, 249, 3) !important' }"
          type="number"
          min="0"
          required
        />
      </VCol>

      <!-- 👉 Sell Price -->
      <VCol
        cols="12"
        md="6"
      >
      
        <VTextField
          v-model="transaction.sellprice"
          label="Prix de vente"
          placeholder=""
          :style="{ color: 'rgb(73, 249, 3) !important' }"
          type="number"
          min="0"
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
          placeholder=""
          :style="{ color: 'rgb(73, 249, 3) !important' }"
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

          v-model="transaction.pl"
          label="+/- Value"
          placeholder=""
          :style="{ color: 'rgb(73, 249, 3) !important' }"
          readonly
          type="number"
          
        />
      </VCol>
      <!-- 👉 TotalGain -->
      <VCol
        cols="12"
        md="12">
        <VTextField

          v-model="transaction.totalgain"
          label="Total + Gain"
          placeholder=""
          readonly
          :style="{ color: 'rgb(73, 249, 3) !important' }"
          type="number"
        />
      </VCol>
<!-- 👉 TotalGain -->
<VCol
        cols="12"
        md="6">
        <VTextField

          v-model="transaction.tax"
          label="Commision"
          placeholder=""
          readonly
          :style="{ color: 'rgb(73, 249, 3) !important' }"
          type="number"
        />
      </VCol>

      <!-- 👉 TotalGain -->
<VCol
        cols="12"
        md="6">
        <VTextField

          v-model="transaction.taxtva"
          label="TVA"
          placeholder=""
          readonly
          :style="{ color: 'rgb(73, 249, 3) !important' }"
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
        @click="submitForm">
          Ajouter
        </VBtn>
      </VCol>
    </VRow>
  </VForm>

</template>

<script>
import TransactionService from '@/services/TransactionService';
import { router } from '@/router';

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
        tax: '',
        taxtva: '',
        totalgain: ''
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
    'transaction.buyprice': {
      handler(newValue) {
        this.calculateTotal();
      },
      immediate: true
    },
    'transaction.sellprice': {
      handler(newValue) {
        this.calculatePL();
      },
      immediate: true
    },
    'transaction.total': {
      handler(newValue) {
        this.calculateTotalGain();
        this.calculatePL();

      },
      immediate: true
    },
    'transaction.pl': {
      handler(newValue) {
        this.calculateTotalGain();
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
      const sellPrice = parseFloat(this.transaction.sellprice);
      if (!isNaN(quantity) && !isNaN(buyPrice) && !isNaN(sellPrice)) {
        const buyEntryTax = quantity * buyPrice * 0.007665;
        const sellExitTax = quantity * sellPrice * 0.007665;
        const entryBuyPrice = (quantity * buyPrice) + buyEntryTax;
        const exitSellPrice = (quantity * sellPrice) - sellExitTax;
        const tva = (exitSellPrice - entryBuyPrice) * 0.15;
        this.transaction.tax =parseFloat( parseFloat(buyEntryTax.toFixed(2)) + parseFloat(sellExitTax.toFixed(2)));
        if(exitSellPrice < entryBuyPrice){
          this.transaction.pl = (exitSellPrice - entryBuyPrice).toFixed(2);
          this.transaction.taxtva = 0;
        }
        else if(exitSellPrice > entryBuyPrice){
          this.transaction.taxtva = tva.toFixed(2);
          this.transaction.pl = ((exitSellPrice - entryBuyPrice) - tva).toFixed(2);

        }
      } else {
        this.transaction.tax = '';
        this.transaction.taxtva = '';

        this.transaction.pl = '';
      }
    },
    calculateTotalGain() {
      const total = parseFloat(this.transaction.total);
      const pl = parseFloat(this.transaction.pl);
      if (!isNaN(total) && !isNaN(pl)) {
        this.transaction.totalgain = (total + pl).toFixed(2);
      } else {
        this.transaction.totalgain = '';
      }
    },

    async submitForm() {
      if (
    !this.transaction.stock ||
    !this.transaction.quantity ||
    !this.transaction.buyprice ||
    !this.transaction.sellprice
  ) {
    alert('Veuillez remplir les champs obligatoires.');
    return;
  }
      TransactionService.post(this.transaction)
        .then(() => {
          // Reset form fields after successful submission
          this.transaction.quantity='';
          this.transaction.buyprice='';
          this.transaction.sellprice='';
          this.transaction.totalgain='';
          this.transaction.pl='';
          this.transaction.totaltva='';
          
          this.$emit('TransactionAdded');

          alert('Transaction saved successfully!');
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
            sellprice: '',
            total: '',
            pl: '',
            tax: '',
        taxtva: '',
            totalgain: ''
          };
         
    },
  },
};
</script>

