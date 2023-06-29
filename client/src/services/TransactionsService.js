import Api from '@/services/Api'

export default {
  index (params) {
    return Api().get('transactions', {
      params: params
    })
  },
  post (transaction) {
    return Api().post('transactions', transaction)
  }
}
