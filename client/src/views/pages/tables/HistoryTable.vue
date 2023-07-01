<template>
  <div>
  
    <v-row>
      <v-col cols="3">
        <v-row>
          <v-select
          v-model="selectedStock"
          :items="stockOptions"
          label="Sélectionner une valeur"
          outlined
        ></v-select>
        <v-btn
        text="X"
        color="error"
        height="30px"
        width="10px"
          @click="clearStockSelect">
          
        </v-btn>
        </v-row>
        
      </v-col>
      <v-col cols="3">

      <v-text-field
      v-model="search"
      label="Rechercher"
      outlined
    ></v-text-field>
  </v-col>

  <v-col cols="6" class="text-right">
        <v-radio-group v-model="filterType">

            <v-radio value="Tout" label="Tout"></v-radio>
            <v-radio value="Achat" label="Achat"></v-radio>
          <v-radio value="Vente" label="Vente"></v-radio>
   
        
        </v-radio-group>
      </v-col>
    </v-row>
    <v-data-table
      height="500"
      fixed-header
      :headers="HistoryTableHeaders"
      :items="filteredTransactions"
      class="text-no-wrap rounded-0 text-sm"
    ></v-data-table>
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
const HistoryTableHeaders = [
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
];
</script>
