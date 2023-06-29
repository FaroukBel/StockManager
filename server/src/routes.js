const AuthenticationController = require('./controllers/AuthentificationController') 
const AuthenticationPolicy = require('./policies/AuthentificationPolicy') 

module.exports = (app) => {
    app.post('/register',
    AuthenticationController.register),
    app.post('/login',
    AuthenticationController.login)
}
 