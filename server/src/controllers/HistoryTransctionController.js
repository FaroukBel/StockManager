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

  const storeBuyTransaction = async (req, res) => {
    try {
      const { date, stock, type, quantity, buyprice, total, tax, totalcom } = req.body;
      const value = stock;
      const price = buyprice;
      const buyhistorytransaction = await HistoryTransaction.create({
        date,
        value,
        type,
        quantity,
        price,
        total,
        tax,
        totalcom
      });


      res.json(buyhistorytransaction);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  const storeSellTransaction = async (req, res) => {
    try {
      const { date, stock, type, quantity, sellprice, total, tax, totalcom } = req.body;
  
      const value = stock;
      const price = parseFloat(sellprice);
      const sellhistorytransaction = await HistoryTransaction.create({
        date,
        value,
        type,
        quantity,
        price,
        total,
        tax,
        totalcom
      });
  
      res.json(sellhistorytransaction);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
module.exports = {
   
    getTransactions,
    storeSellTransaction,
    storeBuyTransaction
  }
