//= Data

import {
  useCreateCartMutation,
  useGetAllCartQuery,
} from "@/features/cart/cart";
import {
  useGetProductsQuery,
  useSingleCategoryQuery,
} from "@/features/product/products";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { isLoggedIn, storgeUserInfo } from "../services/auth.service";
import Loader from "../Common/Loader";

function Products() {
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const { data, isLoading, isError, error } = useGetProductsQuery();

  const products = data?.data;

  // console.log("products", products);

  const { data2, isLoading2, isError2, error2 } = useGetAllCartQuery(userId);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (isError2) {
      // Handle error, you can log it or display an error message.
      console.error2("Error fetching cart data:", error2);
    } else if (!isLoading2) {
      // Only set the cart if there is data and it's not already set to avoid infinite re-renders.
      if (data2 && data2.data) {
        setCart(data2.data);
      }
    }
  }, [data2, isLoading2, isError2, error2]);

  const [createCart] = useCreateCartMutation();

  const addToCart = (product, Id) => {
    if (cart.some((item) => item.Product_Id === product.Product_Id)) {
      alert("This product is already in the cart.");
    } else {
      // Create a new cart with the added product
      const updatedCart = [...cart, product];

      setCart(updatedCart);
      const data = {
        title: product.title,
        price: product.price,
        Image: product.Image,
        usertblUserID: Id,
      };
      console.log("cart data here", product);
      createCart(data);
      // Save the updated cart data to local storage
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      // Show a success toast message to indicate that the product has been added
      toast.success("Product added to the cart");
    }
  };

  const [selectCategory, setSelectCategory] = useState(null);

  const handleCategoryClick = async (category) => {
    setSelectCategory(category);
  };

  const {
    data: data1,
    isLoading: isLoading1,
    error: error1,
  } = useSingleCategoryQuery(selectCategory);

  console.log("data1", data1);

  const userLoggedIn = isLoggedIn();

  const [showPopup, setShowPopup] = useState(false);

  const handleAddToCart = () => {
    // Add your logic here for adding the product to the cart
    // For demonstration, I'll just show the popup
    setShowPopup(true);
  };

  const router = useRouter();

  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  console.log("formData", formData);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://createabit-backend.onrender.com/api/v1/user/login",
        // "https://createabit-backend.onrender.com/api/v1/user/login",
        formData
      );

      if (response.data.data.accessToken) {
        toast.success("Successfully Logged In");
        localStorage.setItem("userId", response.data.data.user.User_ID);
        router.push("/");
      }
      storgeUserInfo({ accessToken: response.data.data.accessToken });
    } catch (error) {
      console.error("Error:", error);
      // Handle the error, e.g., show an error message to the user.
    }
  };
  return (
    <div className="row">
      <div className="col-lg-12" style={{ marginTop: "80px" }}>
        {error ? (
          <>Oh no, there was an error</>
        ) : isLoading ? (
          <>Loding...</>
        ) : data || data1 ? (
          <div className="shop-products">
            {selectCategory && data1.status === "Success" ? (
              <div className="row">
                {data1.data?.map((item) => (
                  <div className="col-md-4 col-lg-4" key={item.Product_Id}>
                    <div className="item mb-50">
                      <div className="img">
                        <Image
                          src={`https://createabit-backend.onrender.com/${item.Image}`}
                          alt=""
                          width={300}
                          height={200}
                        />
                        {userLoggedIn ? (
                          <button
                            onClick={() => addToCart(item, userId)}
                            className="cart-color add-cart"
                          >
                            Add to Cart
                          </button>
                        ) : (
                          <button
                            onClick={handleAddToCart}
                            className="cart-color add-cart"
                          >
                            Add to Cart
                          </button>
                        )}
                        <span className="fav">
                          <i className="far fa-heart"></i>
                        </span>
                      </div>
                      <div className="cont">
                        <div className="rate">
                          {/* {new Array(item.stars).fill().map((_, i) => (
  <i className="fas fa-star" key={i}></i>
))}
{new Array(5 - item.stars).fill().map((_, i) => (
  <i className="far fa-star" key={i}></i>
))} */}
                        </div>
                        <h6>{item.title}</h6>
                        <h5>${item.price}</h5>
                      </div>
                    </div>

                    <Modal show={showPopup} onHide={() => setShowPopup(false)}>
                      <Modal.Header closeButton>
                        <Modal.Title className="text-dark">
                          Welcome! Please Login to continue.
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <form onSubmit={handleSubmit} className="register-form">
                          <div className="form-group">
                            <label className="text-left " htmlFor="email">
                              Email
                            </label>
                            <input
                              className="form-input"
                              type="email"
                              name="Email"
                              id="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="text-left " htmlFor="password">
                              Password
                            </label>
                            <input
                              className="form-input"
                              type="password"
                              name="Password"
                              id="password"
                              value={formData.Password}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <button
                            type="submit"
                            className="mt-3 butn butn-md butn-bord radius-10"
                          >
                            Login
                          </button>
                        </form>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="dark"
                          onClick={() => setShowPopup(false)}
                        >
                          Close
                        </Button>
                        {/* Additional buttons can be added here */}
                      </Modal.Footer>
                    </Modal>
                  </div>
                ))}
              </div>
            ) : (
              <div className="row">
                {products?.map((item) => (
                  <div className="col-md-4 col-lg-4" key={item.Product_Id}>
                    <div className="item mb-50">
                      <div className="img">
                        <Image
                          src={`https://createabit-backend.onrender.com/${item.Image}`}
                          alt=""
                          width={300}
                          height={200}
                        />

                        {userLoggedIn ? (
                          <button
                            onClick={() => addToCart(item, userId)}
                            className="cart-color add-cart"
                          >
                            Add to Cart
                          </button>
                        ) : (
                          <button
                            onClick={handleAddToCart}
                            className="cart-color add-cart"
                          >
                            Add to Cart
                          </button>
                        )}
                        <span className="fav">
                          <i className="far fa-heart"></i>
                        </span>
                      </div>
                      <div className="cont">
                        <div className="rate">
                          {/* {new Array(item.stars).fill().map((_, i) => (
  <i className="fas fa-star" key={i}></i>
))}
{new Array(5 - item.stars).fill().map((_, i) => (
  <i className="far fa-star" key={i}></i>
))} */}
                        </div>
                        <h6>{item.title}</h6>
                        <h5>${item.price}</h5>
                      </div>
                    </div>

                    <Modal
                      size="lg"
                      show={showPopup}
                      onHide={() => setShowPopup(false)}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title className="mx-auto text-dark">
                          Please Login to continue
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div className="row">
                          <div className="col-lg-12">
                          <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label className="text-left text-dark" htmlFor="email">
            Email
          </label>
          <input
            className="form-input"
            type="email"
            name="Email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="text-left text-dark" htmlFor="password">
            Password
          </label>
          <input
            className="form-input"
            type="password"
            name="Password"
            id="password"
            value={formData.Password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="mt-3 text-white bg-black butn butn-md butn-bord radius-10"
                                style={{ width: "300px" }}>
          Login
        </button>
      </form>
                            <p className="mt-2 text-center text-black">
                              <span>Don't have account?</span>
                              <span>
                                <Link
                                  href="/register"
                                  className="text-primary"
                                >
                                  Sign Up
                                </Link>
                              </span>
                            </p>
                          </div>
                         
                        </div>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          // variant="dark"
                          className="text-white bg-black border-0"
                          onClick={() => setShowPopup(false)}
                        >
                          Close
                        </Button>
                        {/* Additional buttons can be added here */}
                      </Modal.Footer>
                    </Modal>
                  </div>
                ))}
              </div>
            )}

            {/* <div className="pagination d-flex justify-content-center mt-30">
  <ul className="rest">
    <li className="active">
      <a href="#0">1</a>
    </li>
    <li>
      <a href="#0">2</a>
    </li>
    <li>
      <a href="#0">
        <i className="fas fa-chevron-right"></i>
      </a>
    </li>
  </ul>
</div> */}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Products;
