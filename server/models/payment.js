const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    paymentId: { type: String },
    signature: { type: String },
});

module.exports = mongoose.model('Payment', paymentSchema);
