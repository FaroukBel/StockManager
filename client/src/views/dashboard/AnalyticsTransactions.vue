<script setup>
import chartInfo from '@images/cards/chart-info.png'
import creditCardSuccess from '@images/cards/credit-card-success.png'
import creditCardWarning from '@images/cards/credit-card-warning.png'
import paypalError from '@images/cards/paypal-error.png'
import walletPrimary from '@images/cards/wallet-primary.png'
const transactions = [
  {
    amount: +82.6,
    paymentMethod: 'Paypal',
    description: 'Send money',
    icon: paypalError,
    color: 'error',
  },
  {
    paymentMethod: 'Wallet',
    amount: +270.69,
    description: 'Mac\'D',
    icon: walletPrimary,
    color: 'primary',
  },
  {
    amount: +637.91,
    paymentMethod: 'Transfer',
    description: 'Refund',
    icon: chartInfo,
    color: 'info',
  },
  {
    paymentMethod: 'Credit Card',
    amount: -838.71,
    description: 'Ordered Food',
    icon: creditCardSuccess,
    color: 'success',
  },
  {
    paymentMethod: 'Wallet',
    amount: +203.33,
    description: 'Starbucks',
    icon: walletPrimary,
    color: 'primary',
  },
  {
    paymentMethod: 'Mastercard',
    amount: -92.45,
    description: 'Ordered Food',
    icon: creditCardWarning,
    color: 'warning',
  },
]

const moreList = [
  {
    title: 'Share',
    value: 'Share',
  },
  {
    title: 'Refresh',
    value: 'Refresh',
  },
  {
    title: 'Update',
    value: 'Update',
  },
]
</script>

<template>
  <v-card title="Transactions">
    <template #append>
      <div class="me-n3 mt-n2">
        <MoreBtn :menu-list="moreList" />
      </div>
    </template>

    <v-card-text style="max-height: 380px; overflow-y: auto;">
      <v-list class="card-list">
        <v-list-item
          v-for="item in transactions"
          :key="item.paymentMethod"
        >
          <template #prepend>
            <v-avatar
              rounded
              variant="tonal"
              :color="item.color"
              :src="item.icon"
              class="me-3"
            />
          </template>

          <v-list-item-subtitle class="text-disabled mb-1">
            {{ item.paymentMethod }}
          </v-list-item-subtitle>
          <v-list-item-title>
            {{ item.description }}
          </v-list-item-title>

          <template #append>
            <v-list-item-action>
              <span class="me-1">{{ item.amount > 0 ? `+$${Math.abs(item.amount)}` : `-$${Math.abs(item.amount)}` }}</span>
              <span class="text-disabled">USD</span>
            </v-list-item-action>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 1.6rem;
}

</style>
