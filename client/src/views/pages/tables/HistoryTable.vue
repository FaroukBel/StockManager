<template>
  <div style="padding: 20px;">
  
    <v-row class="d-flex">
      <v-col cols="3">

          <v-select
          v-model="selectedStock"
          :items="stockOptions"
          label="Sélectionner une valeur"
          :style="{ color: 'rgb(73, 249, 3) !important' }"
          outlined
        ></v-select>

        
      </v-col>
      
      <v-col cols="3">

      <v-text-field
      v-model="search"
      label="Rechercher"
          :style="{ color: 'rgb(73, 249, 3) !important' }"
      outlined
    ></v-text-field>
  </v-col>
  <v-col cols="1">
        <v-btn
        text="X"
        :style="{ color: 'rgb(73, 249, 3) !important' }"
    
          @click="clearStockSelect">
          
        </v-btn>
      </v-col>

  <v-col cols="4" class="text-right ">
        <v-radio-group v-model="filterType" :value="'Tout'">
          <div style="display: flex; justify-content: space-between; flex-direction: row;">
            <v-radio 
          :style="{ color: 'rgb(73, 249, 3) !important' }"
            value="Tout" label="Tout"></v-radio>
            <v-radio 
          :style="{ color: 'rgb(73, 249, 3) !important' }"
            value="Achat" label="Achat"></v-radio>
          <v-radio value="Vente" 
          :style="{ color: 'rgb(73, 249, 3) !important' }"
          label="Vente"></v-radio>
          </div>
            
   
        
        </v-radio-group>
      </v-col>
    </v-row>
    <v-data-table
    :key="tableKey"

    ref="myTable" 
  height="500"
  fixed-header
  :headers="HistoryTableHeaders"
  :items="filteredTransactions"
  class="text-no-wrap rounded-0 text-sm"
  return-object
  v-model="selected"
  :item-value="filteredTransactions => `${filteredTransactions.id}`"
    show-select

>

<template v-slot:item.save="{ item }">
<v-btn :loading="item.loading" elevation="0" icon color="green" v-on:click="this.editItem(item)">
<v-icon dark>ri:save-2-line</v-icon>
</v-btn>
</template>
<template v-slot:item.edit="{ item }">
<v-btn :loading="item.loading" elevation="0" icon color="green" v-on:click="this.editItem(item)">
<v-icon dark>mdi-pencil</v-icon>
</v-btn>
</template>
<template v-slot:item.delete="{ item }">
<v-btn :loading="item.loading" elevation="0" icon color="red !important" v-on:click="this.deleteItem(item)">
<v-icon dark>mdi-delete</v-icon>
</v-btn></template>

<template v-slot:item.bank="{ item }" >
<v-text-field  
class="no-border"
></v-text-field>
</template>
</v-data-table>

<v-card class="mt-2 pa-2">
    <pre>{{ selected }}</pre>
  </v-card>


  </div>
  <div class="d-flex justify-content-between">
  <div class="text-right total-net" >
    <strong>Total Net Achat: {{ this.formatCurrency(totalNetAchat) }}</strong>
  </div>
  <div class="text-right total-net" >
    <strong>Total Net Vente: {{this.formatCurrency(totalNetVente) }}</strong>
  </div>
  <div class="text-right total-net total-net-tva" :class="{ 'negative-value': totalNetTVA < 0 }">
    <span>Total Net: {{ this.formatCurrency(totalNetTVA) }}</span>
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
      filterType: "Tout",
      totalNet: 0,
      selected: [],
      tableKey:0,
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
  {
    title: 'Banque',
    key: 'bank',
  },
  {
    title: '',
    key: 'save',
  },
  {
    title: '',
    key: 'edit',
  },
  {
    title: '',
    key: 'delete',
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
  
  if (totalVente - totalAchat < 0) {
    const revenue = (totalVente - totalAchat).toFixed(2);
    return revenue; // Apply currency formatting
  } else {
    const revenuetva = (totalVente - totalAchat) * 0.15;
    const revenue = (totalVente - totalAchat) - revenuetva;
    return revenue; // Apply currency formatting
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


    editItem(item) {
    // Logic for editing the item
    // You can access the item's properties using item.propertyName
    // For example: item.id, item.name, item.quantity, etc.
    // Implement your custom logic to handle the edit action
    console.log("Edit item:", item);
  },
  async deleteItem(item) {
    const transactionId = item.value.id; // Assuming the ID of the item is stored in the 'id' property
    try {
        await HistoryTransactionsService.deleteTransaction(transactionId);
        this.tableKey += 1;
        location.reload();
      } catch (error) {
        console.error(error);
      }
  },

    formatCurrency(value) {
    return value.toLocaleString('fr-MA', { style: 'currency', currency: 'MAD' });
  },
    async clearStockSelect(){
      this.selectedStock = '';
      this.search = '';
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

.negative-value {
  color: red !important;
}

.total-net-tva {
  color: rgb(19, 255, 19);
}

.no-border {
  color: rgb(43, 44, 64);
}

</style>
