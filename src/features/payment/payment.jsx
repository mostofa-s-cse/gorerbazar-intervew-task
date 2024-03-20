import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productPaymentApi = createApi({
  reducerPath: "productPaymentApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://createabit-backend.onrender.com/api/v1/",
    baseUrl: "https://createabit-backend.onrender.com/api/v1/",
  }),

  endpoints: (build) => ({
    createPayment: build.mutation({
      query: (price) => ({
        url: "/payment/create-payment-intent",
        method: "POST",
        body: price,
      }),
    }),
  }),
});

export const { useCreatePaymentMutation } = productPaymentApi;
