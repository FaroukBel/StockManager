const {Transaction} = require('../models')

const getTransactions = async (req, res) => {
    try {
      const transactions = await Transaction.findAll(); // Retrieves all transactions from the "Transaction" model
  
      res.json(transactions); // Sends the retrieved transactions as a JSON response
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
module.exports = {
   
    getTransactions,
  }
