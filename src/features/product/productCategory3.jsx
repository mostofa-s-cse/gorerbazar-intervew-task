import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productCategory3Api = createApi({
  reducerPath: "productCategory3Api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://createabit-backend.onrender.com/api/v1/",
  }),
  endpoints: (builder) => ({
    getProductCategory3: builder.query({
      query: () => "/productCategory3",
    }),
  }),
});

export const { useGetProductCategory3Query } = productCategory3Api;
