import { useEffect } from "react";
//= Packages
import Head from "next/head";
//= Components
import ShopListLight from "./shop-list";
import Navbar from "./navbar";
import Footer from "./footer";
function LandingPreview() {
  useEffect(() => {
    document.body.classList.add("sub-bg");
    return () => document.body.classList.remove("sub-bg");
  }, []);

  return (
    <>
      <Head>
        <title>Task - Preview</title>
      </Head>
      <Navbar/>
      <main>
        <ShopListLight />
      </main>
      <Footer/>
    </>
  );
}

export default LandingPreview;
