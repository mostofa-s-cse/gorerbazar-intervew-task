import {
  useDeleteCartMutation,
  useGetAllCartQuery,
} from "@/features/cart/cart";
import { useCreateOrderMutation } from "@/features/order/order";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { isLoggedIn } from "../services/auth.service";

function Cart({ lightMode }) {
  // const [products, setProducts] = useState([]);
  const router = useRouter();
  const userLoggedIn = isLoggedIn();
  console.log("userLoggedIn", userLoggedIn);
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const { data, isLoading, isError, error } = useGetAllCartQuery(userId);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (isError) {
      // Handle error, you can log it or display an error message.
      console.error("Error fetching cart data:", error);
    } else if (!isLoading) {
      // Only set the cart if there is data and it's not already set to avoid infinite re-renders.
      if (data && data.data) {
        setCart(data.data);
      }
    }
  }, [data, isLoading, isError, error]);

  // Function to update the cart item quantity and update local storage
  const updateQuantity = (id, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.Cart_Id === id) {
          // Update the quantity of the specific item
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );

    // Recalculate and update the subtotal, discount, and total
    const updatedSubtotal = calculateTotal();

    const updatedDiscount = appliedDiscount; // You might need to recalculate the discount based on the updated cart.
    const updatedTotal = updatedSubtotal - updatedDiscount;
    setCartTotal(updatedTotal);

    // Update the local storage with the new cart data after changing the state
    const updatedCart = JSON.stringify(cart);
    localStorage.setItem("cart", updatedCart);
  };

  // Function to calculate the subtotal of an item
  const calculateSubtotal = (price, quantity) => price * quantity;

  // Function to calculate the total cart price
  const calculateTotal = () =>
    cart.reduce(
      (total, item) => total + calculateSubtotal(item.price, item.quantity),
      0
    );

  const [deleteCart] = useDeleteCartMutation();
  const handleDelete = async (id) => {
    if (id) {
      if (window.confirm("Do you want to delete?")) {
        // First, update the state by filtering the item

        console.log("productId", id);
        const res = await deleteCart(id);

        const updatedCart = cart.filter((item) => item.Cart_Id !== id);
        setCart(updatedCart);

        // Recalculate and update the subtotal, discount, and total
        const updatedSubtotal = calculateTotal();
        const updatedDiscount = appliedDiscount; // You might need to recalculate the discount based on the updated cart.
        const updatedTotal = updatedSubtotal - updatedDiscount;
        setCartTotal(updatedTotal);

        // Update the local storage with the new cart data after removing the item
        const updatedCartJSON = JSON.stringify(updatedCart);
        localStorage.setItem("cart", updatedCartJSON);
      }
    }
  };

  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [cartTotal, setCartTotal] = useState(calculateTotal());

  // Function to handle changes in the coupon code input field
  const handleCouponCodeChange = (e) => {
    setCouponCode(e.target.value);
  };

  // Function to apply the coupon and calculate the discount
  const applyCoupon = () => {
    // You can add logic here to validate the coupon code and calculate the discount.
    // For this example, we'll apply a fixed 20% discount if the coupon is "OCT".

    if (couponCode === "OCT20") {
      const totalBeforeDiscount = calculateTotal();
      const discount = (totalBeforeDiscount * 20) / 100; // 20% discount
      const discountedTotal = totalBeforeDiscount - discount;

      setAppliedDiscount(discount);
      setCartTotal(discountedTotal);
    }
  };

  const handleProceedToCheckout = () => {
    // Calculate the subtotal and total one more time
    const subtotal = calculateTotal();
    const total = subtotal - appliedDiscount;

    // Store the values in localStorage
    localStorage.setItem("subtotal", subtotal.toFixed(2));
    localStorage.setItem("total", total.toFixed(2));

    // router.push("/dark/shop-checkout/", { scroll: false });
  };

  const handleAlertCheckout = () => {
    const confirmed = window.confirm(
      "Please login first. Do you want to go to the login page?"
    );

    if (confirmed) {
      router.push("/login");
    }
  };
  const [createOrder] = useCreateOrderMutation();
  const handleCreateOrder = async () => {
    const subtotal = calculateTotal();
    const total = subtotal - appliedDiscount;
    const data = {
      orderDetails: cart,
      subtotal: subtotal.toFixed(2),
      total: total.toFixed(2),
    };
    const res = await createOrder(data);
    if (res) {
      toast.success("Now you are ready for proceed checkout");
      router.push("/shop-checkout");
    }
  };

  return (
    <section
      className={`shop-cart ${lightMode ? "light" : ""} section-padding`}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-11">
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {cart?.map((item) => (
                    <tr key={item.Cart_Id}>
                      <td data-column="Product">
                        <div className="d-flex align-items-center">
                          <div>
                            <div className="img icon-img-80">
                              {/* <Image src={item.image} alt={item.title} /> */}
                              <Image
                                src={`https://createabit-backend.onrender.com/${item.Image}`}
                                alt=""
                                width={70}
                                height={50}
                              />
                            </div>
                          </div>
                          <div className="ml-30">
                            <h6>{item.title}</h6>
                          </div>
                        </div>
                      </td>
                      <td data-column="price">
                        <h5 className="main-color4 fz-18">${item.price}</h5>
                      </td>
                      <td data-column="Quantity">
                        <div className="counter">
                          <span
                            className="down"
                            onClick={() =>
                              updateQuantity(item.Cart_Id, item.quantity - 1)
                            }
                          >
                            -
                          </span>
                          <input type="text" value={item.quantity} readOnly />
                          <span
                            className="up"
                            onClick={() =>
                              updateQuantity(item.Cart_Id, item.quantity + 1)
                            }
                          >
                            +
                          </span>
                        </div>
                      </td>
                      <td data-column="Subtotal">
                        <h5 className="main-color4 fz-18">
                          $
                          {calculateSubtotal(item.price, item.quantity).toFixed(
                            2
                          )}
                        </h5>
                      </td>
                      <td className="remove">
                        <button
                          style={{ backgroundColor: "white", color: "black" }}
                          onClick={() => {
                            handleDelete(item.Cart_Id);
                          }}
                        >
                          <span className="pe-7s-close"></span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="row mt-80">
              <div className="col-lg-6">
                <div className="mt-40 coupon">
                  <h4>Discount</h4>
                  <p className="fz-13">
                    Enter your coupon code if you have one.
                  </p>
                  <form action="contact.php">
                    <div className="form-group d-flex mt-30">
                      <input
                        type="text"
                        name="coupon_code"
                        value={couponCode}
                        onChange={handleCouponCodeChange}
                      />
                      <button
                        type="button"
                        className="butn butn-md butn-bord"
                        onClick={applyCoupon}
                      >
                        <span>Apply</span>
                      </button>
                    </div>
                    <span className="mt-10 fz-13 opacity-7">Coupon code</span>
                  </form>
                </div>
              </div>
              <div className="col-lg-4 offset-lg-2">
                {cart && cart.length > 0 && (
                  <div className="mt-40 total">
                    <h4>Cart totals</h4>
                    <ul className="rest mt-30">
                      <li className="mb-5">
                        <h6>
                          Subtotal :{" "}
                          <span className="ml-10 fz-16 main-color4">
                            ${calculateTotal().toFixed(2)}
                          </span>
                        </h6>
                      </li>
                      <li className="mb-5">
                        <h6>
                          Discount :{" "}
                          <span className="ml-10 fz-16 main-color4">
                            -${appliedDiscount.toFixed(2)}
                          </span>
                        </h6>
                      </li>
                      <li className="mb-5">
                        <h6>
                          Total :{" "}
                          <span className="ml-10 fz-16 main-color4">
                            ${(calculateTotal() - appliedDiscount).toFixed(2)}
                          </span>
                        </h6>
                      </li>
                    </ul>

                    {userLoggedIn ? (
                      <span
                        onClick={handleCreateOrder}
                        className="cursor-pointer butn butn-md butn-bord mt-30"
                      >
                        <Link
                          href="/shop-checkout/"
                          className="text-u fz-13 fw-600"
                        >
                          Proceed to checkout
                        </Link>
                      </span>
                    ) : (
                      <span
                        onClick={handleAlertCheckout}
                        className="cursor-pointer butn butn-md butn-bord mt-30"
                      >
                        <Link
                          href="/login/"
                          className="text-u fz-13 fw-600"
                        >
                          Proceed to checkout
                        </Link>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cart;
