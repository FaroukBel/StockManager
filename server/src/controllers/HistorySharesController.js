const { HistoryShares } = require('../models');

const getShareTransactions = async (req, res) => {
  try {
    const sharesTransactions = await HistoryShares.findAll();

    res.json(sharesTransactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const storeShareTransaction = async (req, res) => {
  try {
    const { date_engagement, date_detachement, stock, quantity, buyprice, total, tax, totalcom } = req.body;
    
    const value = stock;
    const type = "div"
    const price = parseFloat(buyprice);
    const sharehistorytransaction = await HistoryShares.create({
        date_engagement,
        date_detachement,
      value,
      type,
      quantity,
      price,
      total,
      tax,
      totalcom
    });
    res.json(sharehistorytransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteShareTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const transaction = await HistoryShares.findByPk(transactionId);

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
    const { date, stock, type, quantity, price, total, tax, totalcom, bank } = req.body;

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
    storeShareTransaction,
  
  getShareTransactions,
  deleteShareTransaction,
  updateTransaction
};
