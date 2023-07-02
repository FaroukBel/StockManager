<script setup>
import { useTheme } from 'vuetify'
import illustrationJohnDark from '@images/cards/illustration-john-dark.png'
import illustrationJohnLight from '@images/cards/illustration-john-light.png'
import HistoryTable from '@/views/pages/tables/HistoryTable.vue'
const { global } = useTheme()
const illustrationJohn = computed(() => global.name.value === 'dark' ? illustrationJohnDark : illustrationJohnLight)
</script>

<template>
  <VCard class="text-center text-sm-start">
    <VRow no-gutters>
      <VCol
        cols="12"
        sm="12"
        order="2"
        order-sm="1"
      >
   
      <VCard title="Historique">
      
        <HistoryTable @tableDeleteRow="updateTable" :key="tableKey" />
      </VCard>

        
      </VCol>

    </VRow>
  </VCard>
</template>

<style lang="scss" scoped>
.john-illustration {
  inset-block-end: -0.0625rem;
  inset-inline-end: 3rem;
}
</style>


<script>
  export default {
    data() {
      return {
        tableKey: 0
      
      }
    },
    methods: {
    updateTable(){
      this.tableKey++;
    }
  }
  }

</script>
