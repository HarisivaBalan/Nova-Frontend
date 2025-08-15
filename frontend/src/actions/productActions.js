import axios from 'axios';
import {  productsFail, productsRequest } from '../slices/productSlice';
import { productFail, productRequest, productSuccess,createReviewFail, createReviewRequest, createReviewSuccess, } from '../slices/singleproductSlice';

export const getProducts = (
  keyword = '',
  Price = [1, 100000],
  category = '',
  rating = 0,
  page = 1,
  limit = 50
) => async (dispatch) => {
  try {
    dispatch(productsRequest());

    let link = `${process.env.REACT_APP_API_BASE_URL}/products?page=${page}&limit=${limit}`;

    if (keyword) {
      link += `&keyword=${encodeURIComponent(keyword)}`;
    }
    if (Price.length === 2) {
      link += `&price[gte]=${Price[0]}&price[lte]=${Price[1]}`;
    }
    if (category) {
      link += `&category=${encodeURIComponent(category)}`;
    }
    if (rating) {
      link += `&ratings[gte]=${rating}`;
    }

    // console.log("Final API URL:", link);

    const { data } = await axios.get(link);
    if (data && data.products) {
      return data; // ✅ Return the fetched products
    } else {
      dispatch(productsFail("Invalid data structure returned"));
      return { products: [] }; // Return empty array if failed
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    dispatch(productsFail(error.response?.data?.message || "Failed to load products"));
    return { products: [] }; // Return empty array on error
  }
};
export const getProduct =id=> async(dispatch)=>{
    // get all the product details
    try{
        dispatch(productRequest())
        const {data} = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/product/${id}`);
        dispatch(productSuccess(data))
    }
    catch(error)
    {
        //handle error
        dispatch(productFail(error.response.data.message));
        
    }
    
}
export const createReview = (reviewData) => async (dispatch) => {
  try {
    dispatch(createReviewRequest());

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/review`, reviewData, config);

    dispatch(createReviewSuccess(data));

    // Fetch updated product reviews immediately
    dispatch(getProduct(reviewData.productId));
  } catch (error) {
    console.error("Review submission error:", error.response?.data);
    dispatch(createReviewFail(error.response?.data?.message || "Failed to submit review"));
  }
};
export const getCategories = (page = 1, limit = 5) => async (dispatch) => {
  try {
    const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/categories?page=${page}&limit=${limit}`);

    // console.log("✅ getCategories API Response:", data); // Debug API response

    if (!data || !Array.isArray(data.categories)) {
      throw new Error("Invalid API response: categories is missing or not an array.");
    }

    return {
      categories: data.categories || [], // ✅ Ensure it's always an array
      totalCategories: data.totalCategories || 0,
    };
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    

    return { categories: [], totalCategories: 0 }; // ✅ Return a valid structure
  }
};
