const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/payment');
require('dotenv').config();

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body; 

        if (!amount || amount <= 0) {
            return res.status(400).send('Invalid amount');
        }

        const options = {
            amount: amount * 100, 
            currency: 'INR',
            receipt: `receipt_${new Date().getTime()}`,
            payment_capture: 1, 
        };

        console.log('Creating Razorpay order with options:', options);

        const order = await instance.orders.create(options);

        const newPayment = new Payment({
            orderId: order.id,
            amount: options.amount,
            currency: options.currency,
            status: 'Pending',
        });

        await newPayment.save();

        res.json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).send(error.message || 'Server error');
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { order_id, payment_id, signature } = req.body;

        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${order_id}|${payment_id}`)
            .digest('hex');

        if (generatedSignature === signature) {
            const updatedPayment = await Payment.findOneAndUpdate(
                { orderId: order_id },
                {
                    paymentId: payment_id,
                    signature: signature,
                    status: 'Completed',
                },
                { new: true } 
            );

            if (updatedPayment) {
                res.json({ status: 'Payment Successful', payment: updatedPayment });
            } else {
                res.status(404).json({ status: 'Payment record not found' });
            }
        } else {
            res.status(400).json({ status: 'Payment Verification Failed' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ status: 'Server Error', error: error.message });
    }
};
