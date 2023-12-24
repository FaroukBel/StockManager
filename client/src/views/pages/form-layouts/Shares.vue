
<script setup>

const currentDate = new Date();
const formattedDate = currentDate.toLocaleString('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});
</script>

<template>
  <VForm ref="myForm" @submit.prevent>

    <VCard>
      <div class="card-header">
        <h2 class="card-title">{{ divTitle }}</h2>
        <v-switch v-model="someSwitch" label="Mode libre" @change="handleSwitchChange"></v-switch>
      </div>
      <VCardText>
        <VRow>
          <!-- 👉 Valeur dropdown -->
          <VCol cols="12" md="12">
            <VSelect clearable v-model="transaction.stock" :items="stockOptions" label="Valeur"
              placeholder="Sélectionnez une valeur" required :style="{ color: 'rgb(73, 249, 3) !important' }" />
          </VCol>
          <VCol cols="12" md="6">
            <v-text-field v-model="transaction.date_engagement" label="Date de d'engagement"
              type="datetime-local"></v-text-field>
          </VCol>
          <VCol cols="12" md="6">
            <v-text-field v-model="transaction.date_detachement" label="Date de détachement"
              type="datetime-local"></v-text-field>
          </VCol>

          <!-- 👉 Quantity -->
          <VCol cols="12" md="6">
            <VTextField v-model="transaction.quantity" :disabled="someSwitch" label="Quantité" placeholder="" min="0"
              :required="!someSwitch" type="number" :style="{ color: 'rgb(73, 249, 3) !important' }" />
          </VCol>

          <!-- 👉 Buy Price -->
          <VCol cols="12" md="6">
            <VTextField v-model="transaction.buyprice" :label="priceLabel" placeholder="" type="number" min="0" required
              :style="{ color: 'rgb(73, 249, 3) !important' }" />
          </VCol>

          <!-- 👉 Commission -->
          <VCol cols="12" md="6">
            <VTextField v-model="transaction.tax" label="Commission" :disabled="someSwitch" placeholder="" readonly
              type="number" :required="!someSwitch" :style="{ color: 'rgb(73, 249, 3) !important' }" />
          </VCol>

          <!-- 👉 Total -->
          <VCol cols="12" md="6">
            <VTextField v-model="transaction.total" :label="labelTotal" placeholder="" readonly type="number" required
              :style="{ color: 'rgb(73, 249, 3) !important' }" />
          </VCol>

          <!-- 👉 Total + Commission -->
          <VCol cols="12" md="12">
            <VTextField v-model="transaction.totalcom" :label="labelTotalCom" placeholder="" readonly type="number"
              :required="!someSwitch" :style="{ color: 'rgb(73, 249, 3) !important' }" />
          </VCol>

          <VCol cols="12" class="d-flex gap-4">
            <VBtn color="secondary" variant="tonal" @click="clearForm">
              Effacer
            </VBtn>
            <VBtn @click="submitForm" color="success">
              <span style="color: black;">Ajouter</span>
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>

    </VCard>
  </VForm>
</template>


<script>
import swal from "sweetalert";
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
      divTitle: "Dividendes",
      someSwitch: false,
      priceLabel: "Prix d'achat",
      labelTotal: "Total",
      labelTotalCom: "Total + Commission",

      transaction: {
        date_engagement: this.getCurrentDateTime(0),
        date_detachement: this.getCurrentDateTime(1),
        stock: '',
        quantity: '',
        buyprice: '',
        total: '',
        tax: '',
        totalcom: '',


      },
      valeurOptions: ["AFMA SA",
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
        "CFG",
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
        "Zellidja S.A"],
        stockOptions:"", // Static list of dropdown options
    };
  },
  mounted() {
    this.stockOptions = this.valeurOptions;
    this.transaction.date_engagement = this.getCurrentDateTime(0);
    this.transaction.date_detachement = this.getCurrentDateTime(1);
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

    handleSwitchChange(newValue) {
      if (newValue) {
        // The switch has been turned on
        // Call your function or perform actions here
        this.doSomethingOnSwitchOn();
        this.calculateTotal();
        this.calculatePL();


      }
    },
    doSomethingOnSwitchOn() {

      if (this.someSwitch) {  
        this.labelTotal = "Total";
        this.priceLabel = "Montant";
        this.labelTotalCom = "Total net";
        this.divTitle = "Taxe immobilière"
        this.stockOptions = ["Taxe immobilière",]
      

      } else {
        this.labelTotal = "Total";
        this.priceLabel = "Prix d'achat";
        this.labelTotalCom = "Total + Commissiom";
        this.divTitle = "Dividendes";
        this.stockOptions = this.valeurOptions;
    };

 
  },
  getCurrentDateTime(step) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate() + step).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    // Format the date to be compatible with datetime-local input
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  },
  handleDataUpdate(data) {
    this.dataFromTransactionForm = data;
  },
  calculateTotal() {
    const quantity = parseFloat(this.transaction.quantity);
    const buyPrice = parseFloat(this.transaction.buyprice);

    if (this.someSwitch && !isNaN(buyPrice)) {
      this.transaction.total = (buyPrice).toFixed(2);

    } else if (!isNaN(quantity) && !isNaN(buyPrice)) {
      this.transaction.total = (quantity * buyPrice).toFixed(2);

    } else {
      this.transaction.total = '';
    }

  },
  calculatePL() {
    const quantity = parseFloat(this.transaction.quantity);
    const buyPrice = parseFloat(this.transaction.buyprice);
    if (this.someSwitch && !isNaN(buyPrice)) {

      this.transaction.tax = 0;

      this.transaction.totalcom = parseFloat(this.transaction.total);
    } else if (!isNaN(quantity) && !isNaN(buyPrice)) {

      this.transaction.tax = (this.transaction.total * 0.15).toFixed(2);
      this.transaction.totalcom = (parseFloat(this.transaction.total) - parseFloat(this.transaction.tax)).toFixed(2);
    }
  },
  async submitForm() {
    if (!this.someSwitch) {
      if (!this.transaction.stock ||
        !this.transaction.quantity ||
        !this.transaction.buyprice ||
        !this.transaction.total ||
        !this.transaction.totalcom) {
        swal('Important', 'Veuillez remplir les champs obligatoires.', 'info');
        return;
      }
    }
    else {
      if (
        !this.transaction.stock ||
        !this.transaction.buyprice
      ) {
        swal('Important', 'Veuillez remplir les champs obligatoires.', 'info');
        return;
      }

    }


    HistoryTransactionsService.postShare(this.transaction)
      .then(() => {
        this.transaction.quantity = '';
        this.transaction.buyprice = '';
        this.transaction.totalcom = '';
        this.transaction.total = '';
        this.transaction.tax = '';

        this.$emit('addShareTransaction');
        swal('Succès !', 'Transaction enregistrée avec succès!', 'success');

      })
      .catch((error) => {
        console.error(error);
        swal('Erreur', 'Failed to save transaction.', 'error');
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

<style>
.card-header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 16px;
  border-bottom: 1px solid rgb(158, 158, 158);

}

.card-title {
  margin: 0;
}

.title-switch {
  margin-left: 16px;
}
</style>
