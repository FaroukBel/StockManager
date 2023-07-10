const AuthenticationController = require('./controllers/AuthentificationController') 
const HistoryTransctionController = require('./controllers/HistoryTransctionController') 
const TransactionController = require('./controllers/TransactionController') 

module.exports = (app) => {
    app.post('/register',
    AuthenticationController.register),
    app.post('/login',
    AuthenticationController.login),

    app.post('/history-update/:transactionId',
    HistoryTransctionController.updateTransaction),

    app.get('/history-get-buy-transaction',
    HistoryTransctionController.getTransactions),

    app.post('/history-buy-transaction',
    HistoryTransctionController.storeBuyTransaction),

    app.post('/history-sell-transaction',
    HistoryTransctionController.storeSellTransaction),

    app.get('/transaction', 
    TransactionController.getTransactions),

    app.post('/transaction', 
    TransactionController.storeTransaction),

    app.delete('/history-delete-transaction/:transactionId',
     HistoryTransctionController.deleteTransaction),

    app.delete('/delete-transaction', 
    TransactionController.deleteAllTransactions)
    
}
 