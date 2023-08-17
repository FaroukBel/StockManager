<template>
  <div style="padding: 20px;">
    <v-row class="d-flex">
      <v-col cols="3">
        <v-select clearable v-model="selectedStock" v-on:change="this.onShareSelected" :items="stockOptions"
          label="Sélectionner une valeur" :style="{ color: 'rgb(73, 249, 3) !important' }" outlined></v-select>
      </v-col>

      <v-col cols="3">
        <v-text-field v-model="search" label="Rechercher" :style="{ color: 'rgb(73, 249, 3) !important' }"
          outlined></v-text-field>
      </v-col>
      <v-col cols="1">
        <v-btn text="X" :style="{ color: 'rgb(73, 249, 3) !important' }" @click="clearStockSelect">
        </v-btn>
      </v-col>

      <v-col cols="5" class="text-right">
        <v-radio-group v-model="filterType" :value="'Tout'">
          <div style="display: flex; flex-direction: row; justify-content: space-between;">
            <v-radio :style="{ color: 'rgb(73, 249, 3) !important' }" value="Tout" label="Tout"></v-radio>
            <v-radio disabled :style="{ color: 'rgb(73, 249, 3) !important' }" value="Achat" label="+Value"></v-radio>
            <v-radio disabled value="Vente" :style="{ color: 'rgb(73, 249, 3) !important' }" label="-Value"></v-radio>
          </div>
        </v-radio-group>
      </v-col>

    </v-row>
    <v-data-table :key="tableKey" hover ref="myTable" height="500" fixed-header :headers="HistoryTableHeaders"
      :items="filteredTransactions" class="text-no-wrap rounded-0 text-sm" return-object v-model="selected"
      :item-value="(filteredTransactions) => `${filteredTransactions.id}`" show-select>

      <template v-slot:item.totalcom="{ item }">
        <div class="d-flex " v-bind:style="item.value.totalcom > 0 ? 'background-color: #C4FF9B; height:70%;  color:black;' : 'height:70%; color:black; height:70%;  background-color: #FF9B9B;  '
          ">
          <p style="margin: 10px ;">{{ item.value.totalcom.toLocaleString('fr-MA', {
            style: 'currency', currency: 'MAD'
          }) }}</p>
        </div>
      </template>
      <template v-slot:item.diffStocks="{ item }">

      </template>
      <template v-slot:item.diviTrans="{ item }">
        <p>{{ item.value.diviTrans.toLocaleString('fr-MA', {
          style: 'currency', currency: 'MAD'
        }) }}</p>
      </template>


      <template v-slot:item.save="{ item }">
        <v-btn :loading="item.loading" elevation="0" icon color="green" v-on:click="this.saveItem(item)">
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

      <template v-slot:item.bank="{ item }">
        <v-text-field class="no-border"></v-text-field>
      </template>
    </v-data-table>
    <div class="mt-5 ml-5">

      <h2>Totaux:</h2>
    </div>
    <v-divider class="mb-5 mt-2"></v-divider>
    <div class="d-flex justify-content-between">

      <div class="text-left total-net total-net-tva negative-value">
        <span>-Value: <v-text-field readonly :value="calculateTotalNegValue('min')"></v-text-field></span>
      </div>
      <div class="text-left total-net total-net-tva">
        <!-- Calculate and display the sum of totalNetTVA and totalNetDividendes -->
        <span>+Value: <v-text-field readonly :value="calculateTotalNegValue('plus')"></v-text-field></span>
      </div>
      <div class="text-left total-net total-net-tva">
        <!-- Calculate and display the sum of totalNetTVA and totalNetDividendes -->
        <span>Dividendes: <v-text-field readonly :value="calculateTotalDivi()"></v-text-field></span>
      </div>
      <div class="text-left total-net total-net-tva">
        <!-- Calculate and display the sum of totalNetTVA and totalNetDividendes -->
        <span>Taxe immobilière: <v-text-field readonly :value="calculateTotalImmo()"></v-text-field></span>
      </div>

    </div>
    <v-card class="mt-2 pa-2">
      <pre>{{ selected }}</pre>
    </v-card>
  </div>
</template>

<script>
import HistoryTransactionsService from '@/services/HistoryTransactionsService'

export default {
  data() {
    return {
      transactions: [],
      selectedStock: null,
      search: '',
      filterType: 'Tout',
      totalNet: 0,
      selected: [],
      tableKey: 0,
      isAlternateHeader: false,
      sharesTransactions: [],
      HistoryTableHeaders: [
        {
          title: 'Valeur',
          key: 'value'
        },
        {
          title: 'Net',
          key: 'totalcom'
        },
        {
          title: 'Difference Actions',
          key: 'quantityDiff'
        },
        {
          title: 'Dividendes',
          key: 'diviTrans'
        }
      ],
    }
  },

  created() {
    this.fetchSharesTransactions();
    this.fetchTransactions()
  },

  computed: {



    formattedValue(value) {
      return this.formatCurrency(value);
    },


    filteredTransactions() {
      if (!this.selectedStock && !this.search && !this.filterType) {
        return this.transactions
      }


      return this.transactions.filter((transaction) => {
        if (
          this.filterType &&
          this.filterType !== 'Tout' &&
          !transaction.type.toLowerCase().includes(this.filterType.toLowerCase())
        ) {

          return false
        }
        if (
          this.selectedStock &&
          !transaction.value.toLowerCase().includes(this.selectedStock.toLowerCase())
        ) {
          return false
        }

        if (this.search && !transaction.value.toLowerCase().includes(this.search.toLowerCase())) {
          return false
        }
        if (this.filterType == 'Dividendes') {
          this.isAlternateHeader = true;

        }
        if (
          this.filterType &&
          this.filterType == 'Tout') {
          this.isAlternateHeader = false;

          return true
        }
        return true
      })
    },



    stockOptions() {
      return [
        'AFMA SA',
        'Afric Industries Sa',
        'Afriquia Gaz',
        'Agma Lahlou-Tazi',
        'Akdital',
        'Alliances',
        'Aluminum du Maroc',
        'Aradei Capital',
        'Atlanta',
        'Attijariwafa Bank',
        'Auto Hall',
        'Auto Nejma',
        'Balima',
        'BCP',
        'Bmce Bank',
        'Cartier Saada',
        'CDM',
        'CIH',
        'Ciments Du Maroc',
        'Colorado',
        'Compagnie Sucrerie Marocaine',
        'CTM',
        'Dari Couspate',
        'Delattre Levivier Maroc',
        'Delta Holding S.A',
        'Disty Tech',
        'Disway',
        'Douja Prom Addoha',
        'Ennakl Automobiles SA',
        'Fenie Brossette',
        'Hps',
        'IB Maroc Com',
        'Immorente Invest',
        'Involys',
        'Itissalat Al-Maghrib',
        'Jet Contractors',
        'Label Vie',
        'LafargeHolcim Maroc',
        'Les Eaux Minerales Oulmes',
        'Lesieur Cristal',
        'M2M Group',
        'Maghreb Oxygene',
        'Maghrebail',
        'Managem',
        'Maroc Leasing',
        'Marocaine pour le Commerce et l’Industrie Banque',
        'Marocaine Ste de Therapeutique',
        'Med Paper',
        'Micro Data SA',
        'Miniere Touissit',
        'Mutandis',
        'Nationale d’Electrolyse et de Petrochimie Ste',
        'Realis. Mecaniques',
        'Rebab Company',
        'Residences Dar Saada',
        'Risma',
        'S2M',
        'Salafin',
        'Sanlam Maroc',
        'SMI',
        'Societe des Boissons du Maroc',
        'Societe d’Exploitation des Ports',
        'Societe Equipement',
        'Ste de Travaux de Realisation d’Ouvrages et de Con',
        'Ste Nationale de Siderurgie',
        'Ste Promotion Pharmaceutique du Maghreb',
        'Stokvis Nord Afrique',
        'Taqa Morocco SA',
        'Timar',
        'Total Maroc SA',
        'Travaux Generaux De Construction',
        'Unimer',
        'Wafa Assurance',
        'Zellidja S.A'
      ]
    }
  },

  methods: {

    formatCurrency(value) {
      return value.toLocaleString('fr-MA', { style: 'currency', currency: 'MAD' })
    },

    calculateDiffStocks() {
      let diffStocks = 0;

      this.transactions.forEach(transaction => {
        const { value, quantityBuy, quantitySell } = transaction;
        diffStocks = quantitySell - quantityBuy;
      })

      return diffStocks;


    },
    calculateTotalNegValue(option) {
      let plusValue = 0;
      let minusValue = 0;

      this.transactions.forEach(transaction => {
        const { value, type, totalcom } = transaction;
        const totalcomValue = parseFloat(totalcom);

        if (totalcomValue > 0) {
          plusValue += totalcomValue;
        }
        else if (totalcomValue < 0) {
          minusValue += totalcomValue;
        }


      })
      if (option === "min") {
        return this.formatCurrency(minusValue);
      }
      else {
        return this.formatCurrency(plusValue);

      }
    },

    calculateTotalDivi() {
      let totalDivi = 0;
      this.transactions.forEach(transaction => {
        const { diviTrans, type, value } = transaction;
        if (value !== "Taxe immobilière") {
          totalDivi += diviTrans;
        }

      })
      return this.formatCurrency(totalDivi);
    },

    calculateTotalImmo() {
      let total = 0;
      this.sharesTransactions.forEach(transaction => {
        const { value, totalcom } = transaction;
        if (value === "Taxe immobilière") {
          const amount = parseFloat(transaction.totalcom)
          total += amount;
        }
      })
      return this.formatCurrency(total);
    },

    onShareSelected() {
      // Call the function when the selected share value changes
      if (this.selectedStock) {
        this.fetchFiltredSharesTransactions(this.selectedStock);

      }

    },

    dynamicStyles(transaction) {
      if (transaction.type.toLowerCase() === 'achat') {

        return {
          backgroundColor: 'red !important',
          color: 'white'
        }
      } else {

        return {
          backgroundColor: 'blue',
          color: 'black'
        }
      }
    },

    editItem(item) {
      // Logic for editing the item
      // You can access the item's properties using item.propertyName
      // For example: item.id, item.value, item.quantity, etc.
      // Implement your custom logic to handle the edit action
      console.log('Edit item:', item)
    },

    async saveItem(item) {
      this.transaction = item;
      HistoryTransactionsService.updateTransaction(this.transaction)
        .then(() => {

          alert('Transaction enregistrée avec succés!')
        })
        .catch((error) => {
          console.error(error)
          alert('Failed to save transaction.')
        })
    },
    async deleteItem(item) {
      const transactionId = item.value.id // Assuming the ID of the item is stored in the 'id' property
      try {
        if (item.value.type == "div") {
          await HistoryTransactionsService.deleteShareTransaction(transactionId)

        }
        else {
          await HistoryTransactionsService.deleteTransaction(transactionId)

        }
        this.$emit('tableDeleteRow')
      } catch (error) {
        console.error(error)
      }
    },

    formatCurrency(value) {
      return value.toLocaleString('fr-MA', { style: 'currency', currency: 'MAD' })
    },
    async clearStockSelect() {
      this.selectedStock = ''
      this.search = ''
    },
    async fetchSharesTransactions() {
      try {
        const response = await HistoryTransactionsService.reqShares()
        this.sharesTransactions = response.data

      } catch (error) {
        console.error(error)
      }
    },


    async fetchTransactions() {
      try {
        const response = await HistoryTransactionsService.index();
        const responseDivi = await HistoryTransactionsService.reqShares();
        this.transactions = response.data;
        this.diviTansactions = responseDivi.data;

        // Calculate the buy and sell totals for each value
        const nameTotals = {};

        // Combine transactions and diviTansactions into one array
        const allTransactions = [...this.transactions, ...this.diviTansactions];
        allTransactions.forEach(transaction => {
          const { value, type, quantity, totalcom } = transaction;


          const totalcomValue = parseFloat(totalcom);

          if (!nameTotals[value]) {
            nameTotals[value] = { value, quantityBuy: 0, quantitySell: 0, quantityDiff: 0, diviTrans: 0, buyTotal: 0, sellTotal: 0, totalcomTotal: 0 };
          }

          if (type === "Achat") {
            nameTotals[value].buyTotal += totalcomValue;
            nameTotals[value].quantityBuy += parseFloat(quantity);
          } else if (type === "Vente") {
            nameTotals[value].quantitySell += parseFloat(quantity);
            nameTotals[value].sellTotal += totalcomValue;
          } else {
            nameTotals[value].diviTrans += parseFloat(totalcom);

          }

          nameTotals[value].quantityDiff = Math.abs(nameTotals[value].quantitySell - nameTotals[value].quantityBuy);

          const total = (nameTotals[value].sellTotal - nameTotals[value].buyTotal);
          if (total > 0) {
            const totalCom = (nameTotals[value].sellTotal - nameTotals[value].buyTotal) * 0.15;
            nameTotals[value].totalcom = (nameTotals[value].sellTotal - nameTotals[value].buyTotal) - totalCom;
          } else {
            nameTotals[value].totalcom = total;
          }
        });

        // Now, nameTotals array contains the desired totals for each unique value
        const nameTotalsArray = Object.values(nameTotals);

        // Assign the nameTotalsArray to the v-model or any data property you prefer to use in v-data-table
        this.transactions = nameTotalsArray;


      } catch (error) {
        console.error(error);
      }
    }






  }
}
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

.total-net-tva input#input-125,
.total-net-tva input#input-121,
.total-net-tva input#input-123 {
  color: rgb(19, 255, 19) !important;
}

.total-net-tva {
  color: rgb(19, 255, 19) !important;
}

.negative-value input#input-125,
.negative-value input#input-121,
.negative-value input#input-123 {
  color: rgb(255, 79, 79) !important;
}

.negative-value {
  color: red !important;
}

.no-border {
  color: rgb(43, 44, 64);
}

.row-green {
  background-color: green;
  color: white;
}

.row-red {
  background-color: red;
  color: white;
}
</style>
