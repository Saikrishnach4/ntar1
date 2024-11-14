import React, { useState } from 'react';
import axios from 'axios';
import styles from './payment.module.css';

const PaymentButton = () => {
  const [amount, setAmount] = useState(500);

  const handlePayment = async () => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/payment/create-order', { amount });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Ntar",
        description: "Test Transaction",
        order_id: data.id,
        handler: async (response) => {
          try {
            const verifyUrl = 'http://localhost:5000/api/payment/verify-payment';
            const { data: verifyData } = await axios.post(verifyUrl, {
              order_id: data.id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            alert(verifyData.status);
          } catch (error) {
            console.error(error);
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>Make Payment</div>
      <input
        type="number"
        className={styles.inputField}
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        onClick={handlePayment}
        className={styles.button}
        disabled={amount <= 0}
      >
        Pay Now
      </button>
    </div>
  );
};

export default PaymentButton;
