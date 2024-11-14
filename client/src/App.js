
import React, { useEffect } from "react";
import loadRazorpay from "./utils/loadrozar";
import PaymentButton from "./components/payment";

const App = () => {
  useEffect(() => {
    loadRazorpay();
  }, []);

  return (
    <div>
      <h1>Razorpay Payment Integration</h1>
      <PaymentButton />
    </div>
  );
};

export default App;
