import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, getCategories } from "../../actions/productActions";
import { setCategories, mergeProductsSuccess } from "../../slices/productSlice";
import Loader from "./Loader";
import Pagination from "react-js-pagination";
import Card from "./Card";
import MetaData from "./MetaData";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
export default function Home() {
  const dispatch = useDispatch();
  const { loading, categories = [], totalCategories = 0, products = [] } = useSelector(
    (state) => state.productsState
  );

  // ✅ State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [overlayPage, setOverlayPage] = useState(1); // Overlay pagination
  const categoriesPerPage = 5;
  const productsPerPage = 200;
  const [productLoading, setProductLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const resPerPage = 12;

  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // console.log(`Fetching categories for page ${currentPage}...`);
        const categoryData = await dispatch(getCategories(currentPage, categoriesPerPage));

        if (!categoryData || !Array.isArray(categoryData.categories)) {
          throw new Error("API response is invalid or categories is not an array!");
        }

        dispatch(setCategories(categoryData)); // ✅ Store paginated categories in Redux
      } catch (error) {
        console.error("⚠️ API Error:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, [dispatch, currentPage]); // ✅ Runs when `currentPage` changes

  // ✅ Fetch products only for current page categories
  useEffect(() => {
    const fetchProductsForCategories = async () => {
      try {
        setProductLoading(true);

        if (categories.length > 0) {
          const categoryFilter = categories.join(","); // ✅ Join all paginated categories
          // console.log(`Fetching products for categories: ${categoryFilter}`);

          const productData = await dispatch(getProducts("", [1, 100000], categoryFilter, 0, 1, productsPerPage));

          if (!productData?.products) throw new Error("API failed!");

          dispatch(mergeProductsSuccess({ products: productData.products })); // ✅ Merge products without overwriting
        }

        setProductLoading(false);
      } catch (error) {
        setProductLoading(false);
        console.error("⚠️ API Error:", error);
        toast.error("Failed to load products");
      }
    };

    if (categories.length > 0) {
      fetchProductsForCategories();
    }
  }, [dispatch, categories]); // ✅ Runs when `categories` change

  // ✅ Fetch products dynamically for the selected category
  useEffect(() => {
    if (!selectedCategory) return;

    const fetchCategoryProducts = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/products?category=${encodeURIComponent(selectedCategory)}&limit=${resPerPage}&page=${overlayPage}`
        );
        setCategoryProducts(data.products);
        setTotalProducts(data.count);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchCategoryProducts();
  }, [selectedCategory, overlayPage]);

  // ✅ Group products dynamically by category
  const categorizedProducts = categories.reduce((acc, category) => {
    acc[category] = products.filter((product) => product.category === category);
    return acc;
  }, {});

  // ✅ Handle category selection (resets page to 1)
  const handleViewAll = (category) => {
    setSelectedCategory(category);
    setOverlayPage(1);
    setCategoryProducts([]); // Clear previous data before fetching new
  };

  return (
    <>
    <div className="page-wrapper">
      {loading || productLoading ? (
        <Loader />
      ) : categories.length > 0 ? (
        <div className="home">
          <MetaData title={"Buy Products"} />

          {/* ✅ Display categories */}
          <div className="category-section">
            {Object.entries(categorizedProducts).map(([category, items]) => (
              <div key={category} className="category-container">
                <div className="category-header">
                  <h2>{category}</h2>
                  <button onClick={() => handleViewAll(category)}>View All</button>
                </div>
                <div className="category-products">
                  {items.slice(0, 6).map((product) => (
                    <Card key={product._id} product={product} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Overlay for "View All" */}
          {selectedCategory && (
            <div className="overlay">
              <div className="overlay-content">
                <div className="overlay-header">
                  <button className="close-button" onClick={() => setSelectedCategory(null)}>✖</button>
                </div>
                <h2>{selectedCategory}</h2>
                <div className="all-products">
                  {categoryProducts.length > 0 ? (
                    categoryProducts.map((product) => (
                      <Card key={product._id} product={product} />
                    ))
                  ) : (
                    <p>No products available in this category.</p>
                  )}
                </div>

                {/* ✅ Pagination for selected category */}
                {totalProducts > resPerPage && (
                  <div className="d-flex justify-content-center mt-5">
                    <Pagination
                      activePage={overlayPage}
                      itemsCountPerPage={resPerPage}
                      totalItemsCount={totalProducts}
                      onChange={(page) => setOverlayPage(page)}
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
        <h2 className="text-center mt-5">No products found</h2>
      )}

      {/* ✅ Pagination for categories */}
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
