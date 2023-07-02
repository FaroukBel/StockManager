import api from '@/services/api'

export default {
  index (params) {
    return api().get('history-get-buy-transaction', {
      params: params
    })
  },
  
  postBuy (transaction) {
    return api().post('history-buy-transaction', transaction)
  },
  postSell (transaction) {
    return api().post('history-sell-transaction', transaction)
  },
  deleteTransaction(transactionId) {
    return api().delete(`history-delete-transaction/${transactionId}`);
  }

}
