import api from '@/services/api'

export default {
  index (params) {
    return api().get('transaction', {
      params: params
    })
  },
  post (transaction) {
    return api().post('transaction', transaction)
  }
}
