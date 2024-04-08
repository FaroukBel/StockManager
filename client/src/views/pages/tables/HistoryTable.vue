<template>
  <div style="padding: 20px;">
    <VRow>
      <VCol>
        <VTextField v-model="startDate" type="datetime-local" />
      </VCol>
      <VCol>
        <VTextField v-model="endDate" type="datetime-local" />
      </VCol>
    </VRow>
    <VRow class="d-flex">
      <VCol cols="3">
        <VSelect v-model="selectedStock" clearable :items="stockOptions" label="Sélectionner une valeur"
          :style="{ color: 'rgb(73, 249, 3) !important' }" @change="onShareSelected" outlined />
      </VCol>

      <VCol cols="3">
        <VTextField v-model="search" label="Rechercher" :style="{ color: 'rgb(73, 249, 3) !important' }" outlined />
      </VCol>
      <VCol cols="1">
        <VBtn text="X" :style="{ color: 'rgb(73, 249, 3) !important' }" @click="clearStockSelect" />
      </VCol>

      <VCol cols="5" class="text-right">
        <VRadioGroup v-model="filterType" value="Tout">
          <div style="display: flex; flex-direction: column; justify-content: space-between;">
            <VRow>
              <VRadio :style="{ color: 'rgb(73, 249, 3) !important' }" value="Tout" label="Tout" />
              <VRadio :style="{ color: 'rgb(73, 249, 3) !important' }" value="Achat" label="Achat" />
              <VRadio value="Vente" :style="{ color: 'rgb(73, 249, 3) !important' }" label="Vente" />
            </VRow>
            <VRow>
              <VRadio value="Dividendes" :style="{ color: 'rgb(73, 249, 3) !important' }" label="Dividendes" />
              <VRadio value="Taxe immobilière" :style="{ color: 'rgb(73, 249, 3) !important' }"
                label="Taxe immobilière" />
            </VRow>
          </div>
        </VRadioGroup>
      </VCol>
    </VRow>

    <VDataTable :key="tableKey" ref="myTable" width="400" v-model="selected" height="500" fixed-header
      :headers="dynamicTableHeaders" :items="dynamicFilter" class="text-no-wrap mt-5 rounded-0 text-sm" return-object
      :item-value="(filteredTransactions) => `${filteredTransactions.id}`" hover :pagination="itemsCount"
      items-per-page-text="" items-per-page="1000">
      <template #item.type="{ item }">
        <div class="d-flex type-columns"
          :style="item.value.type === 'Achat' ? ' background-color: #C4FF9B; height:70%; justify-content: center; align-items:center; color:black !important;' : 'height:70%; justify-content: center; align-items:center; color:black; height:70%;  background-color: #FF9B9B;  '">
          <VTextField v-model="item.value.type" style="margin: 0;" />
        </div>
      </template>


      <template #item.save="{ item }">
        <VBtn :loading="item.loading" elevation="0" icon color="green" @click="saveItem(item)">
          <VIcon dark>
            ri:save-2-line
          </VIcon>
        </VBtn>
      </template>


      <template #item.delete="{ item }">
        <VBtn :loading="item.loading" elevation="0" icon color="red !important" @click="deleteItem(item)">
          <VIcon dark>
            mdi-delete
          </VIcon>
        </VBtn>
      </template>

      <template #item.bank="{ item }">
        <VTextField v-model="item.value.bank" class="no-border" />
      </template>

      <template #item.quantity="{ item }">
        <VTextField v-model="item.value.quantity" type="number" class="no-border" />
      </template>

      <template #item.price="{ item }">
        <VTextField v-model="item.value.price" type="number" class="no-border" />
      </template>
      <template #item.bankDiff="{ item }">
        <p class="no-border text-white">
          {{ (parseFloat(item.value.totalcom) - parseFloat(item.value.bank)).toFixed(2) }}
        </p>
      </template>
    </VDataTable>

    <VCard class="mt-2 pa-2">
      <pre>{{ selected }}</pre>
    </VCard>
  </div>

  <div class="d-flex justify-content-between">
    <div class="text-left total-net">
      <div>
        CUMP Achat:
        <VTextField readonly :value="formatCurrency(weightedAchat)" />
      </div>
    </div>
    <div class="text-left total-net">
      <div>
        CUMP Vente:
        <VTextField readonly :value="formatCurrency(weightedVente)" />
      </div>
    </div>
    <div class="text-left total-net">
      <div>
        Total Actions Achat:
        <VTextField readonly :value="totalQuantityAchat.toLocaleString('fr-MA')" />
      </div>
    </div>
    <div class="text-left total-net">
      <div>
        Total Actions Vente:
        <VTextField readonly :value="totalQuantityVente.toLocaleString('fr-MA')" />
      </div>
    </div>
    <div class="text-left total-net">
      <div>
        Total Net Achat:
        <VTextField readonly :value="formattedTotalNetAchat" />
      </div>
    </div>
    <div class="text-left total-net">
      <div>
        Total Net Vente:
        <VTextField readonly :value="formattedTotalNetVente" />
      </div>
    </div>
  </div>
  <div class="ml-5">
    <h2>Totaux:</h2>
  </div>
  <VDivider class="mb-5 mt-2" />

  <div class="d-flex justify-content-between">
    <div class="text-left total-net ">
      <span>Commission:
        <VTextField readonly :value="formattedTotalCommission" />
      </span>
    </div>

    <div class="text-left total-net total-net-tva" :class="{ 'negative-value': totalNetTVA < 0 }">
      <span>Net:
        <VTextField readonly :value="formattedTotalNet" />
      </span>
    </div>
    <div class="text-left total-net total-net-tva" :class="{ 'negative-value': totalNetImmo < 0 }">
      <span>Taxe immobilière:
        <VTextField readonly :value="formatCurrency(totalNetImmo)" />
      </span>
    </div>
    <div class="text-left total-net total-net-tva" :class="{ 'negative-value': totalNetDividendes < 0 }">
      <span>Dividendes:
        <VTextField readonly :value="formattedTotalDivi" />
      </span>
    </div>
    <div class="text-left total-net total-net-tva" :class="{ 'negative-value': computedTotalDiviNet < 0 }">
      <span>Total:
        <VTextField readonly :value="formattedComputedTotal" />
      </span>
    </div>
    <div class="text-left total-net total-net-tva" :class="{ 'negative-value': computedTotalBank < 0 }">
      <span>Banque:
        <VTextField readonly :value="formattedTotalBank" />
      </span>
    </div>
    <div class="text-left total-net total-net-tva" :class="{ 'negative-value': computedDiffBank < 0 }">
      <span>Diff. Banque:
        <VTextField readonly :value="formatCurrency(computedDiffBank)" />
      </span>
    </div>
  </div>
</template>

<script>
import HistoryTransactionsService from '@/services/HistoryTransactionsService';

export default {
  data() {
    const currentDate = new Date()

    return {
      transactions: [],
      sharesTransactions: [],
      totalDiviNet: this.totalNetDividendes + this.totalNetTVA,
      selectedStock: null,
      search: '',
      filterType: 'Tout',
      totalNet: 0,
      selected: [],
      startDate: "", // Set startDate to today's date
      endDate: currentDate.toISOString().slice(0, 16),   // Svert to ISO string 
      tableKey: 0,
      isAlternateHeader: "tout",
      editingColumn: null,
      HistoryTableHeaders: [
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
          width: '110px',
        },
        {
          title: 'Quantité',
          key: 'quantity',
          width: '150px',

        },
        {
          title: 'Cours',
          key: 'price',
          width: '130px',

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
          width: '155px',

        },
        {
          title: 'Diff. banque',
          key: 'bankDiff',
        },
        {
          title: '',
          key: 'save',
        },
        {
          title: '',
          key: 'delete',
        },
      ],
      DividendesHeaders: [
        {
          title: 'Engagement',
          key: 'date_engagement',
        },
        {
          title: 'Détechement',
          key: 'date_detachement',
        },
        {
          title: 'Valeur',
          key: 'value',
        },
        {
          title: 'Quantité',
          key: 'quantity',
          width: '170px',
        },
        {
          title: 'Cours',
          key: 'price',
          width: '170px',
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
          title: '',
          key: 'delete',
        },
      ],
      ImmoHeaders: [
        {
          title: 'Engagement',
          key: 'date_engagement',
        },
        {
          title: 'Valeur',
          key: 'value',
        },
        {
          title: 'Motant',
          key: 'price',
          width: '300px',
        },
        {
          title: 'Brut',
          key: 'total',
        },
        {
          title: 'Net',
          key: 'totalcom',
        },
        {
          title: '',
          key: 'delete',
        },
      ],

    }
  },

  computed: {
    computedTotalDiviNet() {
      const totalNetTVAValue = this.totalNetTVA
      const totalNetDividendesValue = this.totalNetDividendes

      return parseFloat(totalNetTVAValue) + parseFloat(totalNetDividendesValue)
    },
    computedDiffBank() {
      return -(this.computedTotalDiviNet - this.computedTotalBank)

    },
    computedTotalBank() {
      const totalColumnIndex = this.HistoryTableHeaders.findIndex(
        header => header.key === 'bank',
      )

      if (totalColumnIndex === -1) return 0
      let totalAchatBank = 0
      let totalVenteBank = 0

      return this.filteredTransactions.reduce((total, transaction) => {

        if (transaction.bank > 0) {
          if (transaction.type === "Achat") {
            totalAchatBank += parseFloat(transaction[this.HistoryTableHeaders[totalColumnIndex].key])
          } else {
            totalVenteBank += parseFloat(transaction[this.HistoryTableHeaders[totalColumnIndex].key])
          }

          return totalVenteBank - totalAchatBank

        }

        return totalVenteBank - totalAchatBank
      }, 0)

      return (totalVenteBank - totalAchatBank).toFixed(2)
    },
    dynamicTableHeaders() {
      if (this.isAlternateHeader === "div") {
        return this.DividendesHeaders
      } else if (this.isAlternateHeader === "tout") {
        return this.HistoryTableHeaders
      } else {
        return this.ImmoHeaders
      }
    },
    formattedTotalDivi() {
      return this.formatCurrency(this.totalNetDividendes)
    },
    formattedTotalBank() {
      return this.formatCurrency(this.computedTotalBank)
    },
    formattedComputedTotal() {
      return this.formatCurrency(this.computedTotalDiviNet)
    },
    formattedVente() {
      return this.formatCurrency(this.totalQuantityVente)
    },
    formattedAchat() {
      return this.formatCurrency(this.totalQuantityAchat)
    },
    formattedTotalNetAchat() {
      return this.formatCurrency(this.totalNetAchat)
    },
    formattedTotalNet() {
      return this.formatCurrency(this.totalNetTVA)
    },
    formattedTotalNetVente() {
      return this.formatCurrency(this.totalNetVente)
    },
    formattedTotalCommission() {
      return this.formatCurrency(this.totalCommision)
    },
    dynamicFilter() {
      if (this.isAlternateHeader === "div" || this.isAlternateHeader === "immo") {
        return this.filteredSharesTransactions
      }
      else {
        return this.filteredTransactions
      }
    },

    filteredSharesTransactions() {
      if (!this.selectedStock && !this.search && this.filterType == 'Dividendes') {
        return this.sharesTransactions.filter(transaction => !transaction.value.includes('Taxe immobilière'))
      } else if (!this.selectedStock && !this.search && this.filterType == 'Taxe immobilière') {
        return this.sharesTransactions.filter(transaction => transaction.value.includes('Taxe immobilière'))

      }
      this.itemsCount()

      return this.sharesTransactions.filter(transaction => {

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

      return this.transactions.filter(transaction => {



        function formatDate(inputDate) {
          const date = new Date(inputDate)

          const day = String(date.getDate()).padStart(2, '0')
          const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based
          const year = date.getFullYear()

          return `${day}/${month}/${year}`
        }


        const startDateFormated = formatDate(this.startDate)
        const endDateFormated = formatDate(this.endDate)


        function compareDates(dateStr1) {
          const date1Parts = dateStr1.split('/').map(Number)

          return new Date(date1Parts[2], date1Parts[1] - 1, date1Parts[0])
        }

        if (
          compareDates(startDateFormated) > compareDates(transaction.date) || compareDates(endDateFormated) < compareDates(transaction.date)
        ) {
          return false
        }

        if (
          this.filterType &&
          this.filterType !== 'Tout' &&
          this.filterType !== 'Dividendes' &&
          this.filterType !== 'Taxe immobilière' &&
          !transaction.type.toLowerCase().includes(this.filterType.toLowerCase())
        ) {
          this.isAlternateHeader = "tout"

          return false
        }

        if (this.selectedStock && !transaction.value.toLowerCase().includes(this.selectedStock.toLowerCase())) {
          return false
        }

        if (this.search && !transaction.value.toLowerCase().includes(this.search.toLowerCase())) {
          return false
        }

        if (this.filterType == 'Dividendes') {
          this.isAlternateHeader = "div"
        }

        if (this.filterType == 'Taxe immobilière') {
          this.isAlternateHeader = "immo"
        }

        if (this.filterType && this.filterType == 'Tout') {
          this.isAlternateHeader = 'tout'

          return true
        }

        return true
      })
    },



    weightedVente() {
      const quantityVenteColumnIndex = this.HistoryTableHeaders.findIndex(
        header => header.key === 'quantity',
      )

      if (quantityVenteColumnIndex === -1) return 0

      const priceVenteColumnIndex = this.HistoryTableHeaders.findIndex(
        header => header.key === 'price',
      )

      if (priceVenteColumnIndex === -1) return 0

      let totalWeightedPrice = 0

      let totalQuantity = 0

      this.filteredTransactions.reduce((total, transaction) => {
        if (transaction.type.toLowerCase() === 'vente') {
          const quantityVente = parseFloat(transaction[this.HistoryTableHeaders[quantityVenteColumnIndex].key])
          const priceVente = parseFloat(transaction[this.HistoryTableHeaders[priceVenteColumnIndex].key])

          totalWeightedPrice += priceVente * quantityVente
          totalQuantity += quantityVente

        }

        return (totalWeightedPrice / totalQuantity).toFixed(2)


      }, 0)

      return totalWeightedPrice / totalQuantity

    },


    weightedAchat() {
      const quantityVenteColumnIndex = this.HistoryTableHeaders.findIndex(
        header => header.key === 'quantity',
      )

      if (quantityVenteColumnIndex === -1) return 0

      const priceVenteColumnIndex = this.HistoryTableHeaders.findIndex(
        header => header.key === 'price',
      )

      if (priceVenteColumnIndex === -1) return 0

      let totalWeightedPrice = 0

      let totalQuantity = 0

      this.filteredTransactions.reduce((total, transaction) => {
        if (transaction.type.toLowerCase() === 'achat') {
          const quantityVente = parseFloat(transaction[this.HistoryTableHeaders[quantityVenteColumnIndex].key])
          const priceVente = parseFloat(transaction[this.HistoryTableHeaders[priceVenteColumnIndex].key])

          totalWeightedPrice += priceVente * quantityVente
          totalQuantity += quantityVente

        }

        return (totalWeightedPrice / totalQuantity).toFixed(2)


      }, 0)

      return totalWeightedPrice / totalQuantity

    },
    totalNetAchat() {
      const totalColumnIndex = this.HistoryTableHeaders.findIndex(
        header => header.key === 'totalcom',
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
        header => header.key === 'quantity',
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
        header => header.key === 'quantity',
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
        header => header.key === 'totalcom',
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
        header => header.key === 'totalcom',
      )

      if (totalColumnIndex === -1) return 0

      return this.filteredSharesTransactions.reduce((total, transaction) => {
        if (transaction.value !== "Taxe immobilière") {

          const amount = parseFloat(transaction[this.DividendesHeaders[totalColumnIndex].key])

          return total + amount
        }

        return total
      }, 0)

      return total.toFixed(2)
    },

    totalNetImmo() {
      const totalColumnIndex = this.DividendesHeaders.findIndex(
        header => header.key === 'totalcom',
      )

      if (totalColumnIndex === -1) return 0

      return this.filteredSharesTransactions.reduce((total, transaction) => {
        if (transaction.value === "Taxe immobilière") {
          const amount = parseFloat(transaction[this.DividendesHeaders[totalColumnIndex].key])

          return total + amount

        }

        return total

      }, 0)

      return total.toFixed(2)
    },


    totalCommision() {
      const totalColumnIndex = this.HistoryTableHeaders.findIndex(
        header => header.key === 'tax',
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
        return (totalVente - totalAchat).toFixed(2) // Apply currency formatting
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
        'CFG',
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
        'Zellidja S.A',
      ]
    },
  },
  created() {
    this.fetchSharesTransactions()
    this.fetchTransactions()
  },

  methods: {
    itemsCount(pagination) {
      console.log(pagination) // length of filtered/searched items in Vuetify data-table
    },
    onHeaderClick(header, event) {
      // header contains the column information, including the key (value)
      const columnKey = header.value

      console.log('Clicked on column with key:', columnKey)
    },

    onShareSelected() {
      // Call the function when the selected share value changes
      if (this.selectedStock) {
        this.fetchFiltredSharesTransactions(this.selectedStock)

      }

    },

    dynamicStyles(transaction) {
      if (transaction.type.toLowerCase() === 'achat') {

        return {
          backgroundColor: 'red !important',
          color: 'white',
        }
      } else {

        return {
          backgroundColor: 'blue',
          color: 'black',
        }
      }
    },

    async RoundNum(num, length) {
      return Math.round(num * Math.pow(10, length)) / Math.pow(10, length)
    },
    async saveItem(item) {
      this.transaction = item.value

      const tax = this.transaction.quantity * this.transaction.price * 0.0044

      this.transaction.tax = tax.toFixed(2)
      this.transaction.total = (this.transaction.quantity * this.transaction.price).toFixed(2)
      if (this.transaction.type === "Achat") {
        this.transaction.totalcom = (parseFloat(this.transaction.total) + parseFloat(this.transaction.tax)).toFixed(2)
      }
      else {
        this.transaction.totalcom = (this.transaction.total - this.transaction.tax).toFixed(2)
      }

      HistoryTransactionsService.updateTransaction(this.transaction.id, this.transaction)
        .then(() => {

          swal('Succès !', 'Transaction enregistrée avec succès!', 'success')
        })
        .catch(error => {
          console.error(error)
          swal('Erreur', 'Failed to save transaction.', 'error')

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



  },
}
</script>

<script setup>
import { VDataTable } from 'vuetify/labs/VDataTable';
</script>

<style>
.d-flex {
  display: flex;
}

.justify-content-between {
  justify-content: space-between;
  margin-block-end: 20px;
}

.total-net {
  font-size: 18px;
  margin-inline: 20px;
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
