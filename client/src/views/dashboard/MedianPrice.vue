
<template>
  <v-card>
    <v-card-title>
      <div class="d-flex align-center justify-space-between">
        <div>CUMP</div>
        <div>
          <v-btn color="primary mt-1" @click="addRow">Ajouter</v-btn>
        <v-btn color="error mt-1" class="  ml-2" @click="deleteAllRows">Vider</v-btn>
        </div>
       

      </div>
    </v-card-title>

    <v-card-text style="max-height: 480px; overflow-y: auto;">
      <v-list class="card-list py-5">
        <template v-for="(row, index) in rows" :key="index">
          <v-row>
            <v-col cols="5">
              <v-text-field :label="`Prix d'achat ${index + 1}`" type="number" v-model="row.buyPrice"></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-text-field :label="`Quantité ${index + 1}`" type="number" v-model="row.quantity"></v-text-field>
              
            </v-col>
            <v-col>
              <v-btn icon color="error" @click="deleteRow(index)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          
          </v-row>
        </template>
      </v-list>
    </v-card-text>

    <v-card-actions>
      <div class="d-flex justify-space-around w-100">

        <div class="w-100">
          <v-text-field label="Total quantité" v-model="totalSecondInputs" readonly></v-text-field>
        </div>
        <div class="w-100">
          <v-text-field label="CUMP" v-model="weightedAveragePrice" readonly></v-text-field>
        </div>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      rows: []
    };
  },
  computed: {
    totalFirstInputs() {
      return this.rows.reduce((total, row) => total + Number(row.buyPrice), 0);
    },
    totalSecondInputs() {
      return this.rows.reduce((total, row) => total + Number(row.quantity), 0);
    },
    weightedAveragePrice() {
      if (this.rows.length === 0) {
        return 0;
      }

      let totalWeightedPrice = 0;
      let totalQuantity = 0;

      for (const row of this.rows) {
        const buyPrice = Number(row.buyPrice);
        const quantity = Number(row.quantity);

        totalWeightedPrice += buyPrice * quantity;
        totalQuantity += quantity;
      }

      if (totalQuantity === 0) {
        return 0;
      }

      return (totalWeightedPrice / totalQuantity).toFixed(2);
    }
  },
  methods: {
    deleteAllRows() {
      this.rows = [];
    },

    deleteRow(index) {
      this.rows.splice(index, 1);
    },
    addRow() {
      const index = this.rows.length;
      this.rows.push({
        buyPrice: '',
        quantity: ''
      });
    },
    getFirstInputs() {
      const firstInputs = this.rows.map(row => row.buyPrice);

    },
    getSecondInputs() {
      const secondInputs = this.rows.map(row => row.quantity);
    }
  }
};
</script>


<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 1.6rem;
}
</style>
<style>
.text-red {
  color: rgb(var(--v-theme-error));
}

.text-green {
  color: rgb(var(--v-theme-success));
}
</style>
