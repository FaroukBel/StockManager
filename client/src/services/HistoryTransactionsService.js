import api from '@/services/api'

export default {
  index (params) {
    return api().get('history-transaction', {
      params: params
    })
  },
  post (transaction) {
    return api().post('history-transaction', transaction)
  }
}
