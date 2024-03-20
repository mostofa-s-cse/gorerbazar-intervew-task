import { useEffect } from "react";
//= Packages
import Head from "next/head";
//= Components
import Login from "@/components/Auth/Login";
import Loader from "@/components/Common/Loader";
import Navbar from "../navbar";

function UserLogin() {
  const metadata = {
    subTitle: "Registration",
    title: "User Registration",
  };

  return (
    <>
      <Head>
        <title>Task - User Login</title>
      </Head>

      <Loader />
      <div id="smooth-wrapper">
        <Navbar />
        <div id="smooth-content">
          <main className="main-bg">
            <Login />
          </main>
        </div>
      </div>
    </>
  );
}

export default UserLogin;
