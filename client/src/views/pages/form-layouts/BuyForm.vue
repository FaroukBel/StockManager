<template>
  <VForm ref="myForm" @submit.prevent>
    <VRow>
      <!-- 👉 Valeur dropdown -->
      <VCol cols="12" md="6">
        <VSelect v-model="transaction.stock" clearable :items="valeurOptions" label="Valeur"
          placeholder="Sélectionnez une valeur" required :style="{ color: 'rgb(73, 249, 3) !important' }" />
      </VCol>
      <VCol cols="12" md="6">
        <VTextField v-model="transaction.date" :value="transaction.date" :max="getCurrentDateTime()"
          type="datetime-local" />
      </VCol>


      <!-- 👉 Date -->
      <!--
        <VCol cols="12" md="6">
        <v-date-picker
        v-model="transaction.date"
        label="Date"
        :value="currentDate"
        required
        />
        </VCol> 
      -->


      <!-- 👉 Quantity -->
      <VCol cols="12" md="6">
        <VTextField v-model="transaction.quantity" label="Quantité" placeholder="" min="0" required type="number"
          :style="{ color: 'rgb(73, 249, 3) !important' }" />
      </VCol>

      <!-- 👉 Buy Price -->
      <VCol cols="12" md="6">
        <VTextField v-model="transaction.buyprice" label="Prix d'achat" placeholder="" type="number" min="0" required
          :style="{ color: 'rgb(73, 249, 3) !important' }" />
      </VCol>

      <!-- 👉 Commission -->
      <VCol cols="12" md="6">
        <VTextField v-model="transaction.tax" label="Commission" placeholder="" readonly type="number" required
          :style="{ color: 'rgb(73, 249, 3) !important' }" />
      </VCol>

      <!-- 👉 Total -->
      <VCol cols="12" md="6">
        <VTextField v-model="transaction.total" label="Total" placeholder="" readonly type="number" required
          :style="{ color: 'rgb(73, 249, 3) !important' }" />
      </VCol>

      <!-- 👉 Total + Commission -->
      <VCol cols="12" md="12">
        <VTextField v-model="transaction.totalcom" label="Total + Commission" placeholder="" readonly type="number"
          required :style="{ color: 'rgb(73, 249, 3) !important' }" />
      </VCol>

      <VCol cols="12" class="d-flex gap-4">
        <VBtn color="secondary" variant="tonal" @click="clearForm">
          Effacer
        </VBtn>
        <VBtn color="success" @click="submitForm">
          <span style="color: black;">Acheter</span>
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>


<script>
import HistoryTransactionsService from '@/services/HistoryTransactionsService'
import swal from 'sweetalert'

const currentDate = new Date()

const formattedDate = currentDate.toLocaleString('fr-Fr', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

export default {
  data() {
    return {
      transaction: {
        date: this.getCurrentDateTime(),
        stock: '',
        type: 'Achat',
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
        "Zellidja S.A"], // Static list of dropdown options
    }
  },
  watch: {
    'transaction.quantity': {
      handler(newValue) {
        this.calculateTotal()
      },
      immediate: true,
    },
    'transaction.buyprice': {
      handler(newValue) {
        this.calculateTotal()

      },
      immediate: true,
    },
    'transaction.total': {
      handler(newValue) {
        this.calculatePL()
      },
      immediate: true,
    },

  },
  methods: {
    getCurrentDateTime() {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')

      // Format the date to be compatible with datetime-local input
      return `${year}-${month}-${day}T${hours}:${minutes}`
    },

    handleDataUpdate(data) {
      // Do something with the data received from TransactionForm
      // For example, you can store it in a component's data property
      this.dataFromTransactionForm = data
    },


    calculateTotal() {
      const quantity = parseFloat(this.transaction.quantity)
      const buyPrice = parseFloat(this.transaction.buyprice)
      if (!isNaN(quantity) && !isNaN(buyPrice)) {
        this.transaction.total = (quantity * buyPrice).toFixed(2)
      } else {
        this.transaction.total = ''
      }
    },
    calculatePL() {
      const quantity = parseFloat(this.transaction.quantity)
      const buyPrice = parseFloat(this.transaction.buyprice)
      if (!isNaN(quantity) && !isNaN(buyPrice)) {
        const buyEntryTax = quantity * buyPrice * 0.0044

        this.transaction.tax = buyEntryTax.toFixed(2)
        this.transaction.totalcom = parseFloat(this.transaction.total) + parseFloat(this.transaction.tax)
      } else {
        this.transaction.entryBuyPrice = ''
      }

    },
    async submitForm() {
      if (
        !this.transaction.stock ||
        !this.transaction.quantity ||
        !this.transaction.buyprice ||
        !this.transaction.total ||
        !this.transaction.totalcom
      ) {
        swal('Important !', 'Veuillez remplir les champs obligatoires.', 'info')

        return
      }

      
      HistoryTransactionsService.postBuy(this.transaction)
        .then(() => {
          this.transaction.quantity = ''
          this.transaction.buyprice = ''
          this.transaction.totalcom = ''
          this.transaction.total = ''
          this.transaction.tax = ''

          this.$emit('buyTransactionAdded')
          swal('Succès !', 'Transaction enregistrée avec succés!', 'success')
        })
        .catch(error => {
          console.error(error)
          swal('Erreur', 'Failed to save transaction.', 'error')
        })
    },
    async clearForm() {

      this.transaction = {
        stock: '',
        quantity: '',
        buyprice: '',
        total: '',
        totalcom: '',
      }

    },
  },
}
</script>
