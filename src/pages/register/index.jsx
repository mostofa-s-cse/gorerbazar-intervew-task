import { useEffect } from "react";
//= Packages
import Head from "next/head";
//= Components
import Register from "@/components/Auth/Register";
import Loader from "@/components/Common/Loader";
import Navbar from "../navbar";

function UserRegistration() {

  const metadata = {
    subTitle: "Registration",
    title: "User Registration",
  };

  return (
    <>
      <Head>
        <title>Task - User Register</title>
      </Head>

      <Loader />
      <div id="smooth-wrapper">
        <Navbar />
        <div id="smooth-content">
          <main className="main-bg">
            <Register />
          </main>
        </div>
      </div>
    </>
  );
}

export default UserRegistration;
