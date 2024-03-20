import { useEffect } from "react";
//= Packages
import Head from "next/head";
//= Components
import Loader from "@/components/Common/Loader";
import List from "@/components/Shop/List";
import Navbar from "../navbar";
import Footer from "../footer";


function ShopListLight() {
  const metadata = {
    subTitle: "SHOPPING",
    title: "List.",
  };

  return (
    <>
      <Head>
        <title>Task - Shop List</title>
      </Head>

      <Loader />
      <div id="smooth-wrapper">
        <Navbar />
        <div id="smooth-content">
          <main className="main-bg">
            {/* <Header data={metadata} /> */}
            <List />
          </main>
        </div>
      </div>
    </>
  );
}

// ShopListLight.getLayout = (page) => <Layout lightMode>{page}</Layout>;

export default ShopListLight;
