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
            <v-radio :style="{ color: 'rgb(73, 249, 3) !important' }" value="Achat" label="Achat"></v-radio>
            <v-radio value="Vente" :style="{ color: 'rgb(73, 249, 3) !important' }" label="Vente"></v-radio>
            <v-radio value="Dividendes" :style="{ color: 'rgb(73, 249, 3) !important' }" label="Dividendes"></v-radio>
          </div>
        </v-radio-group>
      </v-col>

    </v-row>
    <v-data-table width="400" :key="tableKey" ref="myTable" height="500" fixed-header :headers="dynamicTableHeaders"
      :items="dynamicFilter" class="text-no-wrap rounded-0 text-sm" return-object v-model="selected"
      :item-value="(filteredTransactions) => `${filteredTransactions.id}`" hover>

      <template v-slot:item.type="{ item }">
        <div class="d-flex type-columns"
          :style="item.value.type === 'Achat' ? ' background-color: #C4FF9B; height:70%; justify-content: center; align-items:center; color:black !important;' : 'height:70%; justify-content: center; align-items:center; color:black; height:70%;  background-color: #FF9B9B;  '">
          <v-text-field v-model="item.value.type" style="margin: 0;"></v-text-field>
        </div>
      </template>


      <template v-slot:item.save="{ item }">
        <v-btn :loading="item.loading" elevation="0" icon color="green" v-on:click="this.saveItem(item)">
          <v-icon dark>ri:save-2-line</v-icon>
        </v-btn>
      </template>


      <template v-slot:item.delete="{ item }">
        <v-btn :loading="item.loading" elevation="0" icon color="red !important" v-on:click="this.deleteItem(item)">
          <v-icon dark>mdi-delete</v-icon>
        </v-btn></template>
     
      <template v-slot:item.bank="{ item }">
        <v-text-field class="no-border" v-model="item.value.bank"></v-text-field>
      </template>

      <template v-slot:item.quantity="{ item }">
        <v-text-field v-model="item.value.quantity" type="number" class="no-border"></v-text-field>
      </template>
      <template v-slot:item.price="{ item }">
        <v-text-field v-model="item.value.price" type="number" class="no-border"></v-text-field>
      </template>
      <template v-slot:item.bankDiff="{ item }">
        <p class="no-border text-white">{{ (parseFloat(item.value.totalcom) - parseFloat(item.value.bank)).toFixed(2) }}
        </p>
      </template>

    </v-data-table>

    <v-card class="mt-2 pa-2">
      <pre>{{ selected }}</pre>
    </v-card>
  </div>

  <div class="d-flex justify-content-between">
    <div class="text-left total-net">
      <div>CUMP Achat: <v-text-field readonly :value="weightedAchat"> </v-text-field></div>
    </div>
    <div class="text-left total-net">
      <div>CUMP Vente: <v-text-field readonly :value="weightedVente"></v-text-field></div>
    </div>
    <div class="text-left total-net">
      <div>Total Actions Achat: <v-text-field readonly :value="formattedAchat"> </v-text-field></div>
    </div>
    <div class="text-left total-net">
      <div>Total Actions Vente: <v-text-field readonly :value="formattedVente"></v-text-field></div>
    </div>
    <div class="text-left total-net">
      <div>Total Net Achat: <v-text-field readonly :value="formattedTotalNetAchat"></v-text-field></div>
    </div>
    <div class="text-left total-net">
      <div>Total Net Vente: <v-text-field readonly :value="formattedTotalNetVente"></v-text-field></div>
    </div>
  </div>

  <div class="d-flex justify-content-between">
    <div class="text-left total-net ">
      <!-- Calculate and display the sum of totalNetTVA and totalNetDividendes -->
      <span>Total Commission: <v-text-field readonly :value="formattedTotalCommission"></v-text-field></span>
    </div>

    <!-- Assuming you have access to totalNetTVA and totalNetDividendes variables -->
    <div class="text-left total-net total-net-tva" :class="{ 'negative-value': totalNetTVA < 0 }">
      <span>Total Net: <v-text-field readonly :value="formattedTotalNet"></v-text-field></span>
    </div>
    <div class="text-left total-net total-net-tva" :class="{ 'negative-value': totalNetDividendes < 0 }">
      <span>Total Dividendes: <v-text-field readonly :value="formattedTotalDivi"></v-text-field></span>
    </div>
    <div class="text-left total-net total-net-tva" :class="{ 'negative-value': computedTotalDiviNet < 0 }">
      <!-- Calculate and display the sum of totalNetTVA and totalNetDividendes -->
      <span>Total: <v-text-field readonly :value="formattedComputedTotal"></v-text-field></span>
    </div>
    <div class="text-left total-net total-net-tva" :class="{ 'negative-value': computedTotalBank < 0 }">
      <!-- Calculate and display the sum of totalNetTVA and totalNetDividendes -->
      <span>Total banque: <v-text-field readonly :value="formattedTotalBank"></v-text-field></span>
    </div>
    <div class="text-left total-net total-net-tva" :class="{ 'negative-value': computedDiffBank < 0 }">
      <!-- Calculate and display the sum of totalNetTVA and totalNetDividendes -->
      <span>Diff. Banque: <v-text-field readonly :value="formatCurrency(computedDiffBank)"></v-text-field></span>
    </div>

  </div>
</template>

<script>
import HistoryTransactionsService from '@/services/HistoryTransactionsService'

export default {
  data() {
    return {
      transactions: [],
      sharesTransactions: [],
      totalDiviNet: this.totalNetDividendes + this.totalNetTVA,
      selectedStock: null,
      search: '',
      filterType: 'Tout',
      totalNet: 0,
      selected: [],
      tableKey: 0,
      isAlternateHeader: false,
      editingColumn: null,
      HistoryTableHeaders: [
        {
          title: 'Date',
          key: 'date'
        },
        {
          title: 'Valeur',
          key: 'value'

        },
        {
          title: 'Type',
          key: 'type',
          width: '170px'
        },
        {
          title: 'Quantité',
          key: 'quantity',
          width: '170px'

        },
        {
          title: 'Cours',
          key: 'price',
          width: '130px'

        },
        {
          title: 'Brut',
          key: 'total'
        },
        {
          title: 'Commission',
          key: 'tax'
        },
        {
          title: 'Net',
          key: 'totalcom'
        },
        {
          title: 'Banque',
          key: 'bank'
        },
        {
          title: 'Diff. banque',
          key: 'bankDiff'
        },
        {
          title: '',
          key: 'save'
        },
        {
          title: '',
          key: 'delete'
        }
      ],
      DividendesHeaders: [
        {
          title: 'Engagement',
          key: 'date_engagement'
        },
        {
          title: 'Détechement',
          key: 'date_detachement'
        },
        {
          title: 'Valeur',
          key: 'value'
        },
        {
          title: 'Quantité',
          key: 'quantity'
        },
        {
          title: 'Cours',
          key: 'price'
        },
        {
          title: 'Brut',
          key: 'total'
        },
        {
          title: 'Commission',
          key: 'tax'
        },
        {
          title: 'Net',
          key: 'totalcom'
        },
        {
          title: '',
          key: 'delete'
        }

      ]
    }
  },
  created() {
    this.fetchSharesTransactions()
    this.fetchTransactions()
  },

  computed: {
    computedTotalDiviNet() {
      const totalNetTVAValue = this.totalNetTVA;
      const totalNetDividendesValue = this.totalNetDividendes;
      const total = parseFloat(totalNetTVAValue) + parseFloat(totalNetDividendesValue);
      return total;
    },
    computedDiffBank(){
      return -(this.computedTotalDiviNet - this.computedTotalBank);
       
    },
    computedTotalBank() {
      const totalColumnIndex = this.HistoryTableHeaders.findIndex(
        (header) => header.key === 'bank'
      )
      if (totalColumnIndex === -1) return 0

      return this.filteredTransactions.reduce((total, transaction) => {

        if (transaction.bank > 0) {

          const amount = parseFloat(transaction[this.HistoryTableHeaders[totalColumnIndex].key])
          return total + amount
        }
        return total;
      }, 0)
      return total.toFixed(2)
    },
    dynamicTableHeaders() {
      if (this.isAlternateHeader) {
        return this.DividendesHeaders;
      } else {
        return this.HistoryTableHeaders;
      }
    },
    formattedTotalDivi() {
      return this.formatCurrency(this.totalNetDividendes);
    },
    formattedTotalBank() {
      return this.formatCurrency(this.computedTotalBank);
    },
    formattedComputedTotal() {
      return this.formatCurrency(this.computedTotalDiviNet);
    },
    formattedVente() {
      return this.formatCurrency(this.totalQuantityVente);
    },
    formattedAchat() {
      return this.formatCurrency(this.totalQuantityAchat);
    },
    formattedTotalNetAchat() {
      return this.formatCurrency(this.totalNetAchat);
    },
    formattedTotalNet() {
      return this.formatCurrency(this.totalNetTVA);
    },
    formattedTotalNetVente() {
      return this.formatCurrency(this.totalNetVente);
    },
    formattedTotalCommission() {
      return this.formatCurrency(this.totalCommision);
    },
    dynamicFilter() {
      if (this.isAlternateHeader) {
        return this.filteredSharesTransactions
      }
      else {
        return this.filteredTransactions
      }
    },

    filteredSharesTransactions() {
      if (!this.selectedStock && !this.search && this.filterType == 'Dividendes') {

        return this.sharesTransactions;

      }

      return this.sharesTransactions.filter((transaction) => {

        if (
          this.selectedStock &&
          !transaction.value.toLowerCase().includes(this.selectedStock.toLowerCase())
        ) {
          return false
        }

        if (this.search && !transaction.value.toLowerCase().includes(this.search.toLowerCase())) {
          return false
        }

        return true
      })


    },

    filteredTransactions() {
      if (!this.selectedStock && !this.search && !this.filterType) {
        return this.transactions
      }


      return this.transactions.filter((transaction) => {
        if (
          this.filterType &&
          this.filterType !== 'Tout' &&
          this.filterType !== 'Dividendes' &&
          !transaction.type.toLowerCase().includes(this.filterType.toLowerCase())
        ) {
          this.isAlternateHeader = false;

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



    weightedVente() {
      const quantityVenteColumnIndex = this.HistoryTableHeaders.findIndex(
        (header) => header.key === 'quantity'
      )
      if (quantityVenteColumnIndex === -1) return 0

      const priceVenteColumnIndex = this.HistoryTableHeaders.findIndex(
        (header) => header.key === 'price'
      )
      if (priceVenteColumnIndex === -1) return 0

      let totalWeightedPrice = 0;

      let totalQuantity = 0;

      this.filteredTransactions.reduce((total, transaction) => {
        if (transaction.type.toLowerCase() === 'vente') {
          const quantityVente = parseFloat(transaction[this.HistoryTableHeaders[quantityVenteColumnIndex].key])
          const priceVente = parseFloat(transaction[this.HistoryTableHeaders[priceVenteColumnIndex].key])

          totalWeightedPrice += priceVente * quantityVente;
          totalQuantity += quantityVente;

        }
        return (totalWeightedPrice / totalQuantity).toFixed(2);


      }, 0)
      return (totalWeightedPrice / totalQuantity).toFixed(2);

    },


    weightedAchat() {
      const quantityVenteColumnIndex = this.HistoryTableHeaders.findIndex(
        (header) => header.key === 'quantity'
      )
      if (quantityVenteColumnIndex === -1) return 0

      const priceVenteColumnIndex = this.HistoryTableHeaders.findIndex(
        (header) => header.key === 'price'
      )
      if (priceVenteColumnIndex === -1) return 0

      let totalWeightedPrice = 0;

      let totalQuantity = 0;

      this.filteredTransactions.reduce((total, transaction) => {
        if (transaction.type.toLowerCase() === 'achat') {
          const quantityVente = parseFloat(transaction[this.HistoryTableHeaders[quantityVenteColumnIndex].key])
          const priceVente = parseFloat(transaction[this.HistoryTableHeaders[priceVenteColumnIndex].key])

          totalWeightedPrice += priceVente * quantityVente;
          totalQuantity += quantityVente;

        }
        return (totalWeightedPrice / totalQuantity).toFixed(2);


      }, 0)
      return (totalWeightedPrice / totalQuantity).toFixed(2);

    },
    totalNetAchat() {
      const totalColumnIndex = this.HistoryTableHeaders.findIndex(
        (header) => header.key === 'totalcom'
      )
      if (totalColumnIndex === -1) return 0

      return this.filteredTransactions.reduce((total, transaction) => {
        if (transaction.type.toLowerCase() === 'achat') {
          const amount = parseFloat(transaction[this.HistoryTableHeaders[totalColumnIndex].key])
          return total + amount
        }
        return total
      }, 0)
      return total.toFixed(2)
    },

    totalQuantityAchat() {
      const totalColumnIndex = this.HistoryTableHeaders.findIndex(
        (header) => header.key === 'quantity'
      )
      if (totalColumnIndex === -1) return 0

      return this.filteredTransactions.reduce((total, transaction) => {
        if (transaction.type.toLowerCase() === 'achat') {
          const amount = parseFloat(transaction[this.HistoryTableHeaders[totalColumnIndex].key])
          return total + amount
        }

        return total
      }, 0)
      return total
    },
    totalQuantityVente() {
      const totalColumnIndex = this.HistoryTableHeaders.findIndex(
        (header) => header.key === 'quantity'
      )
      if (totalColumnIndex === -1) return 0

      return this.filteredTransactions.reduce((total, transaction) => {
        if (transaction.type.toLowerCase() === 'vente') {
          const amount = parseFloat(transaction[this.HistoryTableHeaders[totalColumnIndex].key])
          return total + amount
        }

        return total
      }, 0)
      return total
    },
    totalNetVente() {
      const totalColumnIndex = this.HistoryTableHeaders.findIndex(
        (header) => header.key === 'totalcom'
      )
      if (totalColumnIndex === -1) return 0

      return this.filteredTransactions.reduce((total, transaction) => {
        if (transaction.type.toLowerCase() === 'vente') {
          const amount = parseFloat(transaction[this.HistoryTableHeaders[totalColumnIndex].key])
          return total + amount
        }
        return total
      }, 0)
      return total.toFixed(2)
    },

    totalNetDividendes() {
      const totalColumnIndex = this.DividendesHeaders.findIndex(
        (header) => header.key === 'totalcom'
      )
      if (totalColumnIndex === -1) return 0

      return this.filteredSharesTransactions.reduce((total, transaction) => {
        const amount = parseFloat(transaction[this.DividendesHeaders[totalColumnIndex].key])
        return total + amount
      }, 0)
      return total.toFixed(2)
    },
    totalCommision() {
      const totalColumnIndex = this.HistoryTableHeaders.findIndex(
        (header) => header.key === 'tax'
      )
      if (totalColumnIndex === -1) return 0

      return this.filteredTransactions.reduce((total, transaction) => {
        const amount = parseFloat(transaction[this.HistoryTableHeaders[totalColumnIndex].key])
        return total + amount
      }, 0)
      return total.toFixed(2)
    },

    totalNetTVA() {
      const totalAchat = this.totalNetAchat
      const totalVente = this.totalNetVente

      if (totalVente - totalAchat < 0) {
        const revenue = (totalVente - totalAchat).toFixed(2)
        return revenue // Apply currency formatting
      } else {
        const revenuetva = (totalVente - totalAchat) * 0.15

        const revenue = totalVente - totalAchat - revenuetva
        return revenue.toFixed(2) // Apply currency formatting
      }

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

    onHeaderClick(header, event) {
      // header contains the column information, including the key (value)
      const columnKey = header.value;
      console.log('Clicked on column with key:', columnKey);
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

    async RoundNum(num, length) {
      var number = Math.round(num * Math.pow(10, length)) / Math.pow(10, length);
      return number;
    },
    async saveItem(item) {
      this.transaction = item.value;

      const tax = this.transaction.quantity * this.transaction.price * 0.007665;
      this.transaction.tax = tax.toFixed(2);
      this.transaction.total = (this.transaction.quantity * this.transaction.price).toFixed(2);
      if (this.transaction.type === "Achat") {
        this.transaction.totalcom = (parseFloat(this.transaction.total) + parseFloat(this.transaction.tax)).toFixed(2);
      }
      else {
        this.transaction.totalcom = (this.transaction.total - this.transaction.tax).toFixed(2);
      }

      HistoryTransactionsService.updateTransaction(this.transaction.id, this.transaction)
        .then(() => {

          swal('Succès !', 'Transaction enregistrée avec succès!', 'success');
        })
        .catch((error) => {
          console.error(error)
          swal('Erreur', 'Failed to save transaction.', 'error');

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

    async fetchTransactions() {
      try {
        const response = await HistoryTransactionsService.index()
        this.transactions = response.data
      } catch (error) {
        console.error(error)
      }
    },
    async fetchSharesTransactions() {
      try {
        const response = await HistoryTransactionsService.reqShares()
        this.sharesTransactions = response.data

      } catch (error) {
        console.error(error)
      }
    },



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
