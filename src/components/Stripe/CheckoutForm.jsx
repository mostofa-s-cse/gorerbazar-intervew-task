import { useCreateCheckoutMutation } from "@/features/checkout/checkout";
import { useGetAllOrderQuery } from "@/features/order/order";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getUserInfo } from "../services/auth.service";

const CheckoutForm = ({ checkoutInfo }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [cardError, setCardError] = useState("");
  const [createCheckout] = useCreateCheckoutMutation();
  const [error, setError] = useState(null);

  const userInfo = getUserInfo();
  console.log("checkoutInfo", checkoutInfo);

  const [orderData, setOrderData] = useState([]);

  const { data, isLoading, isError, error: error2 } = useGetAllOrderQuery();

  useEffect(() => {
    if (isError) {
      // Handle error, you can log it or display an error message.
      console.error("Error fetching cart data:", error2);
    } else if (!isLoading) {
      // Only set the cart if there is data and it's not already set to avoid infinite re-renders.
      if (data && data.data.length > 0) {
        // setOrderData(data2.data);
        const lastOrderValue = data.data[data.data.length - 1];
        setOrderData(lastOrderValue);
      }
    }
  }, [data, isLoading, isError, error2]);

  const Price = orderData.total;
  // console.log('Price Order Data', Price)
  useEffect(() => {
    if (Price > 0) {
      axios
        .post(
          "https://createabit-backend.onrender.com/api/v1/payment/create-payment-intent",

          // "https://createabit-backend.onrender.com/api/v1/payment/create-payment-intent",
          { Price }
        )
        .then((res) => {
          console.log("res.data.clientSecret", res.data.clientSecret);
          setClientSecret(res.data.clientSecret);
        })
        .catch((error) => {
          console.error("Error fetching client secret:", error.message);
        });
    }
  }, [Price]);
  const router = useRouter();

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("error", error);
      setCardError(error.message);
    }

    // else {
    //   setCardError("");
    //   // console.log("PaymentMethod", paymentMethod);
    // }

    setProcessing(true);
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            email: userInfo.Email,
            name: userInfo.Name,
          },
        },
      });

    if (confirmError) {
      console.log("confirmError", confirmError);
      setError("Payment failed. Please try again.");
      return;
    }

    console.log("paymentIntent", paymentIntent);
    setProcessing(false);

    if (paymentIntent && paymentIntent.status === "succeeded") {
      setTransactionId(paymentIntent.id);

      console.log("transcationId", paymentIntent.id);
      // const transactionId = paymentIntent.id;
      toast.success("Transaction complete with transactionId", transactionId);
      //save payment information to the server

      const res = await createCheckout(checkoutInfo);
      if (res.data.status === "Success") {
        router.push("/page-purchase-success");
      } else {
        router.push("/page-purchase-failed");
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "20px",
                color: "white",
                "::placeholder": {
                  color: "white",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
        <button
          type="submit"
          disabled={!stripe || !clientSecret || processing}
          style={{
            padding: "12px 20px",
            marginTop: "15px",
            fontSize: "16px",
            border: "2px solid #430571",
            color: "#430571",
            fontWeight: "800",
            borderRadius: "50px",
            width: "100%",
          }}
        >
          Place Order
        </button>
      </form>

      {cardError && <p className="ml-8 text-red-500">{cardError}</p>}
      {error && <p className="ml-8 text-red-500">{error}</p>}

      {/* {transactionId && (
        <p className="text-green-500">
          Transaction complete with transactionId: {transactionId}
        </p>
      )} */}
    </>
  );
};

export default CheckoutForm;
