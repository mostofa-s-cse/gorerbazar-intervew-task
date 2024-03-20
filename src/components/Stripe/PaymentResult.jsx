import { useState } from "react";

const PaymentResult = () => {
  const [status, setStatus] = useState("");

  if (typeof window !== "undefined") {
    // Access localStorage here
    const result = localStorage.getItem("payment-status");
    setStatus(result);
  }
  return (
    <div>
      <h2>Payment Status</h2>
      {status === "Success" ? <h3>Success</h3> : <h3>Failed</h3>}
    </div>
  );
};

export default PaymentResult;
