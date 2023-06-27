const AuthenticationController = require('./controllers/AuthentificationController') 
const AuthenticationPolicy = require('./policies/AuthentificationPolicy') 

module.exports = (app) => {
    app.post('/register',
    AuthenticationPolicy.register,
    AuthenticationController.register)
}
 