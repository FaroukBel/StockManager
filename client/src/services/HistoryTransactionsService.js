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

  postShare (transaction) {
    return api().post('history-share-transaction', transaction)
  },
  reqShares (params) {
    return api().get('history-get-share-transaction', {
      params: params
    })
  },

  postSell (transaction) {
    return api().post('history-sell-transaction', transaction)
  },
  deleteTransaction(transactionId) {
    return api().delete(`history-delete-transaction/${transactionId}`);
  },
  deleteShareTransaction(transactionId) {
    return api().delete(`history-delete-share-transaction/${transactionId}`);
  },
  updateTransaction(transactionId, transaction){
    return api().put(`history-update/${transactionId}`, transaction);

  }

}
