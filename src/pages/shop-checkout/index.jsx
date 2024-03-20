import { useEffect } from "react";
//= Packages
import Head from "next/head";
//= Components
import Loader from "@/components/Common/Loader";
import Header from "@/components/Shop/Header";
import Checkout from "@/components/Stripe/Checkout";
import Navbar from "../navbar";

function ShopCheckout() {
  const metadata = {
    subTitle: "SHOPPING",
    title: "checkout.",
  };

  return (
    <>
      <Head>
        <title>Task - Shop Checkout</title>
      </Head>
      <Navbar/>
      <Loader />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main className="main-bg" style={{marginBottom:'100px'}}>
            <Header data={metadata} />
            <Checkout />
          </main>
        </div>
      </div>
    </>
  );
}

export default ShopCheckout;
