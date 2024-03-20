import { useGetAllCartQuery } from "@/features/cart/cart";
import { useGetAllOrderQuery } from "@/features/order/order";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isLoggedIn } from "../services/auth.service";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function Checkout({ lightMode }) {
  const [subTotal, setSubTotal] = useState([]);
  const [total, setTotal] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");

  const [shippingFirstName, setShippingFirstName] = useState("");
  const [shippingLastName, setShippingLastName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [isChecked, setChecked] = useState(false);

  const handleCheckboxChange = () => {
    setChecked(!isChecked);
  };

  const router = useRouter();
  // const [isLoading, setIsLoading] = useState(false);
  const userLoggedIn = isLoggedIn();

  useEffect(() => {
    if (!userLoggedIn) {
      router.push("/login");
    }
    // setIsLoading(true);
  }, [router]);

  useEffect(() => {
    // const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    // setProducts(savedCart);
    const subtotal = localStorage.getItem("subtotal");
    setSubTotal(subtotal);
    const total = localStorage.getItem("total");
    setTotal(total);
  }, []);

  const { data, isLoading, isError, error } = useGetAllCartQuery();
  const [products, setProducts] = useState([]);

  const [orderData, setOrderData] = useState([]);

  const {
    data: data2,
    isLoading: isLoading2,
    isError: isError2,
    error: error2,
  } = useGetAllOrderQuery();

  useEffect(() => {
    if (isError2) {
      // Handle error, you can log it or display an error message.
      console.error("Error fetching cart data:", error2);
    } else if (!isLoading2) {
      // Only set the cart if there is data and it's not already set to avoid infinite re-renders.
      if (data2 && data2.data.length > 0) {
        // setOrderData(data2.data);
        const lastOrderValue = data2.data[data2.data.length - 1];
        setOrderData(lastOrderValue);
      }
    }
  }, [data2, isLoading2, isError2, error2]);

  console.log("orderData", orderData);
  useEffect(() => {
    if (isError) {
      // Handle error, you can log it or display an error message.
      console.error("Error fetching cart data:", error);
    } else if (!isLoading) {
      // Only set the cart if there is data and it's not already set to avoid infinite re-renders.
      if (data && data.data) {
        setProducts(data.data);
      }
    }
  }, [data, isLoading, isError, error]);

  // const handleCheckout = () => {
  let checkoutInfo = {
    orderDetails: products,
    FirstName: firstName,
    LastName: lastName,
    Email: email,
    Country: country,
    City: city,
    Area: area,
    PostCode: postalCode,
    Address: address,
    Phone: phone,
    orderDetails: products,
    SubTotal: orderData.subtotal,
    Total: orderData.total,
    Shipping_FirstName: shippingFirstName,
    Shipping_LastName: shippingLastName,
    Shipping_Address: shippingAddress,
  };

  // toast.success("Successfully create order");

  return (
    <section
      className={`shop-checkout ${lightMode ? "light" : ""} section-padding`}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="order-form md-mb50">
              <h6 className="mb-40">Billing Details</h6>
              <form action="contact.php">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="">First Name *</label>
                      <input
                        onChange={(e) => setFirstName(e.target.value)}
                        type="text"
                        name="first_name"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="">last Name *</label>
                      <input
                        onChange={(e) => setLastName(e.target.value)}
                        type="text"
                        name="last_name"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <label htmlFor="">Your Email *</label>
                      <input
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        name="email"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <label htmlFor="">Country *</label>
                      <input
                        onChange={(e) => setCountry(e.target.value)}
                        type="text"
                        name="country"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="">City / Town *</label>
                      <input
                        onChange={(e) => setCity(e.target.value)}
                        type="text"
                        name="city"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="">Area *</label>
                      <input
                        onChange={(e) => setArea(e.target.value)}
                        type="text"
                        name="area"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="">Post Code *</label>
                      <input
                        onChange={(e) => setPostalCode(e.target.value)}
                        type="text"
                        name="postal_code"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <label htmlFor="">Address *</label>
                      <input
                        onChange={(e) => setAddress(e.target.value)}
                        type="text"
                        name="address"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="">Phone *</label>
                      <input
                        onChange={(e) => setPhone(e.target.value)}
                        type="text"
                        name="phone"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="">Company Name *</label>
                      <input
                        onChange={(e) => setCompany(e.target.value)}
                        type="text"
                        name="company"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h6>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
                    Same As Billing
                  </h6>

                  {isChecked && (
                    <div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="">First Name *</label>
                          <input
                            onChange={(e) =>
                              setShippingFirstName(e.target.value)
                            }
                            type="text"
                            name="shipping_first_name"
                            value={firstName || ""}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="">Last Name *</label>
                          <input
                            onChange={(e) =>
                              setShippingLastName(e.target.value)
                            }
                            type="text"
                            name="shipping_last_name"
                            value={lastName || ""}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="">Address*</label>
                          <input
                            onChange={(e) => setShippingAddress(e.target.value)}
                            type="text"
                            name="shipping_address"
                            value={address || ""}
                            required
                          />
                        </div>
                      </div>

                      {/* Add more form fields as needed */}
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
          <div className="col-lg-5 offset-lg-1">
            <div className="checkout-order-info">
              <h4 className="mb-40">Your Order</h4>
              <div>
                <ul className="rest">
                  {products.map((product) => (
                    <li className="mb-5" key={product.id}>
                      <div className="d-flex align-items-center">
                        <div>
                          <p>{product.title}</p>
                        </div>
                        <div className="ml-auto">
                          <h5 className="fz-18">${product.price}</h5>
                        </div>
                      </div>
                    </li>
                  ))}

                  <li className="pt-10 bord-thin-top">
                    <div className="d-flex align-items-center">
                      <div>
                        <h6>Subtotal</h6>
                      </div>
                      <div className="ml-auto">
                        <h5 className="main-color4 fz-20">
                          ${orderData.subTotal}
                        </h5>
                      </div>
                    </div>
                  </li>
                  <li className="pt-10 bord-thin-top bord-thin-bottom">
                    <div className="d-flex align-items-center">
                      <div>
                        <h6>Total</h6>
                      </div>
                      <div className="ml-auto">
                        <h5 className="main-color4 fz-20">
                          ${orderData.total}
                        </h5>
                      </div>
                    </div>
                  </li>
                </ul>
                <div className="mt-40 text">
                  <p>
                    Your personal data will be used to process your order,
                    support your experience throughout this website, and for
                    other purposes described in our{" "}
                    {/* <Link href=''>
                      <p>privacy policy</p>
                    </Link> */}
                    .
                  </p>
                </div>
                <div className="mt-30">
                  <Elements stripe={stripePromise}>
                    <CheckoutForm checkoutInfo={checkoutInfo} />
                  </Elements>
                </div>
                {/* <div className="mt-30">
                  <button
                    type="submit"
                    className="main-colorbg4 butn butn-md butn-bg text-dark"
                  >
                    <span className="text-u fw-600">Place Order</span>
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Checkout;
