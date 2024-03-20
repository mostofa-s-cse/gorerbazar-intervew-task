//= Packages
import Head from "next/head";
import Script from "next/script";
//= Common Styles
import store from "@/app/store";
import "@/styles/globals.css";
import "@/styles/modal-video.css";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { isLoggedIn } from "@/components/services/auth.service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  // const router = useRouter();
  // const [isLoading, setIsLoading] = useState(false);
  // const userLoggedIn = isLoggedIn();
  // useEffect(() => {
  //   if (!userLoggedIn) {
  //     router.push("/dark/login");
  //   }
  //   setIsLoading(true);
  // }, [router, isLoading]);

  // if (!isLoading) {
  //   return <p>Loading...</p>;
  // }

  // console.log =
  //   console.warn =
  //   console.error =
  //   console.trace =
  //   console.info =
  //   console.dir =
  //   console.debug =
  //     () => {};
  return getLayout(
    <>
      <Head>
        <title>Task</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>

      <Provider store={store}>
        <Elements stripe={stripePromise}>
          <Component {...pageProps} />
        </Elements>
      </Provider>

      <Toaster />
      <Script strategy="beforeInteractive" src="/assets/js/plugins.js"></Script>
      <Script
        strategy="beforeInteractive"
        src="/assets/js/gsap.min.js"
      ></Script>
      <Script strategy="lazyOnload" src="/assets/js/scripts.js"></Script>
    </>
  );
}

export default App;
