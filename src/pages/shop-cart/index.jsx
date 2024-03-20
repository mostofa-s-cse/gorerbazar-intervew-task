import { useEffect } from "react";
//= Packages
import Head from "next/head";
//= Components
import Loader from "@/components/Common/Loader";
import Cart from "@/components/Shop/Cart";
import Header from "@/components/Shop/Header";
import Navbar from "../navbar";
import Footer from "../footer";


function ShopCartLight() {

  const metadata = {
    title: "Cart",
  };

  return (
    <>
      <Head>
        <title>Task - Shop Cart</title>
      </Head>

      <Loader />
      <div id="smooth-wrapper">
        <Navbar/>
        <div id="smooth-content">
          <main className="main-bg" style={{marginBottom:'40px'}}>
            <Header data={metadata} />
            <Cart lightMode />
          </main>
          <Footer style={{marginBottom:'40px'}}/>
        </div>
      </div>
    </>
  );
}

// ShopCartLight.getLayout = (page) => <Layout lightMode>{page}</Layout>;

export default ShopCartLight;
