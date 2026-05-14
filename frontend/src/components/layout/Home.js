import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, getCategories } from "../../actions/productActions";
import {
  setCategories,
  mergeProductsSuccess,
} from "../../slices/productSlice";
import Loader from "./Loader";
import Pagination from "react-js-pagination";
import Card from "./Card";
import MetaData from "./MetaData";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function Home() {
  const dispatch = useDispatch();

  const {
    loading,
    categories = [],
    totalCategories = 0,
    products = [],
  } = useSelector((state) => state.productsState);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [overlayPage, setOverlayPage] = useState(1);

  const categoriesPerPage = 5;
  const productsPerPage = 200;
  const resPerPage = 12;

  // Loading state
  const [productLoading, setProductLoading] = useState(true);

  // Selected category overlay
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Overlay products
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await dispatch(
          getCategories(currentPage, categoriesPerPage)
        );

        if (
          !categoryData ||
          !Array.isArray(categoryData.categories)
        ) {
          throw new Error(
            "API response is invalid or categories is not an array!"
          );
        }

        dispatch(setCategories(categoryData));
      } catch (error) {
        console.error("Category Fetch Error:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, [dispatch, currentPage]);

  // Fetch products for categories
  useEffect(() => {
    const fetchProductsForCategories = async () => {
      try {
        setProductLoading(true);

        if (categories.length > 0) {
          const categoryFilter = categories.join(",");

          const productData = await dispatch(
            getProducts(
              "",
              [1, 100000],
              categoryFilter,
              0,
              1,
              productsPerPage
            )
          );

          if (!productData?.products) {
            throw new Error("Products API failed!");
          }

          dispatch(
            mergeProductsSuccess({
              products: productData.products,
            })
          );
        }
      } catch (error) {
        console.error("Products Fetch Error:", error);
        toast.error("Failed to load products");
      } finally {
        setProductLoading(false);
      }
    };

    if (categories.length > 0) {
      fetchProductsForCategories();
    }
  }, [dispatch, categories]);

  // Fetch products for overlay category
  useEffect(() => {
    if (!selectedCategory) return;

    const fetchCategoryProducts = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/products?category=${encodeURIComponent(
            selectedCategory
          )}&limit=${resPerPage}&page=${overlayPage}`,
          {
            timeout: 30000,
          }
        );

        setCategoryProducts(data.products);
        setTotalProducts(data.count);
      } catch (error) {
        console.error("Overlay Product Fetch Error:", error);
      }
    };

    fetchCategoryProducts();
  }, [selectedCategory, overlayPage]);

  // Group products by category
  const categorizedProducts = categories.reduce((acc, category) => {
    acc[category] = products.filter(
      (product) => product.category === category
    );

    return acc;
  }, {});

  // Handle view all
  const handleViewAll = (category) => {
    setSelectedCategory(category);
    setOverlayPage(1);
    setCategoryProducts([]);
  };

  return (
    <>
      <div className="page-wrapper">

        {/* Loader while fetching */}
        {loading || productLoading ? (

          <div className="d-flex flex-column justify-content-center align-items-center mt-5">
            <Loader />
            <h4 className="mt-3">
              Loading products...
            </h4>
          </div>

        ) : categories.length > 0 ? (

          // Main Home Page
          <div className="home">

            <MetaData title={"Buy Products - NOVAMART"} />

            {/* Categories */}
            <div className="category-section">

              {Object.entries(categorizedProducts).map(
                ([category, items]) => (

                  <div
                    key={category}
                    className="category-container"
                  >

                    {/* Category Header */}
                    <div className="category-header">
                      <h2>{category}</h2>

                      <button
                        onClick={() =>
                          handleViewAll(category)
                        }
                      >
                        View All
                      </button>
                    </div>

                    {/* Category Products */}
                    <div className="category-products">

                      {items.length > 0 ? (

                        items
                          .slice(0, 6)
                          .map((product) => (
                            <Card
                              key={product._id}
                              product={product}
                            />
                          ))

                      ) : (

                        <div className="text-center w-100 mt-4">
                          <Loader />
                          <p className="mt-3">
                            Loading category products...
                          </p>
                        </div>

                      )}

                    </div>

                  </div>
                )
              )}

            </div>

            {/* Overlay */}
            {selectedCategory && (

              <div className="overlay">

                <div className="overlay-content">

                  {/* Close Button */}
                  <div className="overlay-header">
                    <button
                      className="close-button"
                      onClick={() =>
                        setSelectedCategory(null)
                      }
                    >
                      ✖
                    </button>
                  </div>

                  <h2>{selectedCategory}</h2>

                  {/* Overlay Products */}
                  <div className="all-products">

                    {categoryProducts.length > 0 ? (

                      categoryProducts.map((product) => (
                        <Card
                          key={product._id}
                          product={product}
                        />
                      ))

                    ) : (

                      <div className="text-center mt-4">
                        <Loader />
                        <p className="mt-3">
                          Loading category products...
                        </p>
                      </div>

                    )}

                  </div>

                  {/* Overlay Pagination */}
                  {totalProducts > resPerPage && (

                    <div className="d-flex justify-content-center mt-5">

                      <Pagination
                        activePage={overlayPage}
                        itemsCountPerPage={resPerPage}
                        totalItemsCount={totalProducts}
                        onChange={(page) =>
                          setOverlayPage(page)
                        }
                        nextPageText={"Next"}
                        firstPageText={"First"}
                        lastPageText={"Last"}
                        itemClass={"page-item"}
                        linkClass={"page-link"}
                      />

                    </div>

                  )}

                </div>

              </div>

            )}

          </div>

        ) : (

          // Server waking up
          <div className="text-center mt-5">

            <Loader />

            <h4 className="mt-3">
              Server is waking up, please wait...
            </h4>

          </div>

        )}

        {/* Category Pagination */}
        <div className="d-flex justify-content-center mt-5">

          <Pagination
            activePage={currentPage}
            onChange={(page) => setCurrentPage(page)}
            totalItemsCount={totalCategories}
            itemsCountPerPage={categoriesPerPage}
            nextPageText={"Next"}
            prevPageText={"Previous"}
            itemClass={"page-item"}
            linkClass={"page-link"}
          />

        </div>

      </div>
    </>
  );
}