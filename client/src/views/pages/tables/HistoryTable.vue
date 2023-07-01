<template>
  <div style="padding: 20px;">
  
    <v-row>
      <v-col cols="3">

          <v-select
          v-model="selectedStock"
          :items="stockOptions"
          label="Sélectionner une valeur"
          :style="{ color: 'rgb(73, 249, 3) !important' }"
          outlined
        ></v-select>

        
      </v-col>
      <v-col cols="1">
        <v-btn
        text="X"
        :style="{ color: 'rgb(73, 249, 3) !important' }"
    
          @click="clearStockSelect">
          
        </v-btn>
      </v-col>
      <v-col cols="3">

      <v-text-field
      v-model="search"
      label="Rechercher"
          :style="{ color: 'rgb(73, 249, 3) !important' }"
      outlined
    ></v-text-field>
  </v-col>

  <v-col cols="2" class="text-right">
        <v-radio-group v-model="filterType">

            <v-radio 
          :style="{ color: 'rgb(73, 249, 3) !important' }"
            value="Tout" label="Tout"></v-radio>
            <v-radio 
          :style="{ color: 'rgb(73, 249, 3) !important' }"
            value="Achat" label="Achat"></v-radio>
          <v-radio value="Vente" 
          :style="{ color: 'rgb(73, 249, 3) !important' }"
          label="Vente"></v-radio>
   
        
        </v-radio-group>
      </v-col>
    </v-row>
    <v-data-table
      height="500"
          
      fixed-header
      :headers="HistoryTableHeaders"
      :items="filteredTransactions"
      class="text-no-wrap rounded-0 text-sm"
    >
 
  </v-data-table>
  </div>
  <div class="d-flex justify-content-between">
  <div class="text-right total-net" >
    <strong>Total Net Achat: {{ totalNetAchat }} DH</strong>
  </div>
  <div class="text-right total-net" >
    <strong>Total Net Vente: {{ totalNetVente }} DH</strong>
  </div>
  <div class="text-right total-net total-net-tva" :class="{ 'negative-value': totalNetTVA < 0 }">
    <strong>Total Net: {{ totalNetTVA }} DH</strong>
  </div>
</div>

</template>

<script>
import HistoryTransactionsService from '@/services/HistoryTransactionsService';

export default {
  data() {
    return {
      transactions: [],
      selectedStock: null,
      search: '',
      filterType: null,
      totalNet: 0,
      HistoryTableHeaders : [
  {
    title: 'Date',
    key: 'date',
  },
  {
    title: 'Valeur',
    key: 'value',
  },
  {
    title: 'Type',
    key: 'type',
  },
  {
    title: 'Quantité',
    key: 'quantity',
  },
  {
    title: 'Cours',
    key: 'price',
  },
  {
    title: 'Brut',
    key: 'total',
  },
  {
    title: 'Commission',
    key: 'tax',
  },
  {
    title: 'Net',
    key: 'totalcom',
  },
],
    };
  },
  created() {
    this.fetchTransactions();
  },
  computed: {
    filteredTransactions() {
  if (!this.selectedStock && !this.search && !this.filterType) {
    return this.transactions;
  }

  return this.transactions.filter((transaction) => {
    if (this.filterType && this.filterType !== "Tout" && !transaction.type.toLowerCase().includes(this.filterType.toLowerCase())) {
      return false;
    }

    if (this.selectedStock && !transaction.value.toLowerCase().includes(this.selectedStock.toLowerCase())) {
      return false;
    }

    if (this.search && !transaction.value.toLowerCase().includes(this.search.toLowerCase())) {
      return false;
    }

    return true;
  });

  
},

totalNetAchat() {
    const totalColumnIndex = this.HistoryTableHeaders.findIndex(
      (header) => header.key === 'totalcom'
    );
    if (totalColumnIndex === -1) return 0;

    return this.filteredTransactions.reduce((total, transaction) => {
      if (transaction.type.toLowerCase() === 'achat') {
        const amount = parseFloat(transaction[this.HistoryTableHeaders[totalColumnIndex].key]);
        return total + amount;
      }
      return total;
    }, 0);
    return total.toFixed(2);
  },

  totalNetVente() {
    const totalColumnIndex = this.HistoryTableHeaders.findIndex(
      (header) => header.key === 'totalcom'
    );
    if (totalColumnIndex === -1) return 0;

    return this.filteredTransactions.reduce((total, transaction) => {
      if (transaction.type.toLowerCase() === 'vente') {
        const amount = parseFloat(transaction[this.HistoryTableHeaders[totalColumnIndex].key]);
        return total + amount;
      }
      return total;
    }, 0);
    return total.toFixed(2);
  },
  totalNetTVA() {
    const totalAchat = this.totalNetAchat;
      const totalVente = this.totalNetVente;
      if ((totalVente - totalAchat)<0) {
        return (totalVente - totalAchat).toFixed(2);
      }
      else{
        const revenuetva = (totalVente - totalAchat) * 0.15;
      const revenue = (totalVente - totalAchat) - revenuetva;
      return revenue.toFixed(2);
      }
      
  
  },

    
    stockOptions() {
      return [
      "AFMA SA",
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
  "Zellidja S.A"
      ];
    }
  },

  methods: {
    async clearStockSelect(){
      this.selectedStock = '';
    },

    async fetchTransactions() {
      try {
        const response = await HistoryTransactionsService.index();
        this.transactions = response.data;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<script setup>
import { VDataTable } from 'vuetify/labs/VDataTable'

</script>

<style>
.d-flex {
  display: flex;
}

.justify-content-between {
  justify-content: space-between;
  margin-bottom: 20px;
}

.total-net {
  font-size: 18px;
  margin-right: 20px;
  margin-left: 20px;
}
.negative-value{
 color:red !important;
}
.total-net-tva{
  color: rgb(19, 255, 19);
}
</style>
