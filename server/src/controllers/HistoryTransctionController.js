const { HistoryTransaction } = require('../models');

const getTransactions = async (req, res) => {
  try {
    const transactions = await HistoryTransaction.findAll();

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const storeBuyTransaction = async (req, res) => {
  try {
    const { date, stock, type, quantity, buyprice, total, tax, totalcom, bank } = req.body;
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
      totalcom,
      bank
    });
    res.json(buyhistorytransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const storeSellTransaction = async (req, res) => {
  try {
    const { date, stock, type, quantity, sellprice, total, tax, totalcom, bank } = req.body;
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
      totalcom,
      bank
    });
    res.json(sellhistorytransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const transaction = await HistoryTransaction.findByPk(transactionId);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await transaction.destroy();

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const updateTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    console.log(transactionId)
    const { date, stock, type, quantity, price, total, tax, totalcom, bank } = req.body;
    console.log(date)
    const transaction = await HistoryTransaction.findByPk(transactionId);
    if (!transaction) {
      
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // // Update the transaction with the new values
    transaction.date = date;
    transaction.value = stock;
    transaction.type = type;
    transaction.quantity = quantity;
    transaction.price = price;
    transaction.total = total;
    transaction.tax = tax;
    transaction.totalcom = totalcom;
    transaction.bank = bank;

    // Save the updated transaction
    await transaction.save();

    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  getTransactions,
  storeSellTransaction,
  storeBuyTransaction,
  deleteTransaction,
  updateTransaction
};
