const {HistoryTransaction} = require('../models')

const getTransactions = async (req, res) => {
    try {
      const transactions = await HistoryTransaction.findAll(); // Retrieves all transactions from the "Transaction" model
  
      res.json(transactions); // Sends the retrieved transactions as a JSON response
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  const storeTransaction = async (req, res) => {
    try {
      const { date, value, designation, quantity, price, brut, tax, net } = req.body;
  
      const transaction = await HistoryTransaction.create({
        date,
        value,
        designation,
        quantity,
        price,
        brut,
        tax,
        net,
      });
  
      res.json(transaction);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
module.exports = {
   
    getTransactions,
    storeTransaction
  }
