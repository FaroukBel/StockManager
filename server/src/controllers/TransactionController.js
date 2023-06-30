const {Transaction, HistoryTransaction} = require('../models');

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
      const { stock, quantity, buyprice, sellprice, total, pl, totalgain } = req.body;
  
      const transaction = await Transaction.create({
        stock,
        quantity,
        buyprice,
        sellprice,
        total,
        pl,
        totalgain
      });
    
      var type = "buy";
      var price = buyprice;
      const value = stock;
      const date = "";
      const brut = "";
      const tax = "";
      const net = "";
      const buyhistorytransaction = await HistoryTransaction.create({
        date,
        value,
        type,
        quantity,
        price,
        brut,
        tax,
        net,
      });
      var type = "sell";
      var price = sellprice;

      const sellhistorytransaction = await HistoryTransaction.create({
        date,
        value,
        type,
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
