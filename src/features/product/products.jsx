import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://createabit-backend.onrender.com/api/v1/",
    // baseUrl: "https://createabit-backend.onrender.com/api/v1/",
  }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/product/",
    }),
    singleCategory: builder.query({
      query: (category) => `/product/${category}`,
    }),
  }),
});

export const { useGetProductsQuery, useSingleCategoryQuery } = productsApi;
