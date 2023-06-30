const AuthenticationController = require('./controllers/AuthentificationController') 
const HistoryTransctionController = require('./controllers/HistoryTransctionController') 
const TransactionController = require('./controllers/TransactionController') 

module.exports = (app) => {
    app.post('/register',
    AuthenticationController.register),
    app.post('/login',
    AuthenticationController.login),
    app.get('/history-transaction',
    HistoryTransctionController.getTransactions),
    app.post('/history-transaction',
    HistoryTransctionController.storeTransaction),
    app.get('/transaction', 
    TransactionController.getTransactions),
    app.post('/transaction', 
    TransactionController.storeTransaction)

    
}
 