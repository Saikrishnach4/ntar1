
const express = require('express');
const { createOrder, verifyPayment } = require('../controllers/paymentcontroller');
const Payment = require('../models/payment');

const router = express.Router();

router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);

router.get('/payments', async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
