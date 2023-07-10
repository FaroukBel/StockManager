const {Transaction} = require('../models');

const getTransactions = async (req, res) => {
    try {
      const transactions = await Transaction.findAll(); // Retrieves all transactions from the "Transaction" model
  
      res.json(transactions); // Sends the retrieved transactions as a JSON response
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  const storeTransaction = async (req, res) => {
    try {
      const { stock, quantity, buyprice, sellprice, total, pl, tax, taxtva, totalgain } = req.body;
  
      const transaction = await Transaction.create({
        stock,
        quantity,
        buyprice,
        sellprice,
        total,
        pl,
        tax,
        taxtva,
        totalgain
      });
    
    
      res.json(transaction);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const deleteAllTransactions = async (req, res) => {
    try {
      await Transaction.destroy({
        where: {},
        truncate: true
      });
  
      res.json({ message: 'All transactions deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

module.exports = {
   deleteAllTransactions,
    getTransactions,
    storeTransaction
  }
