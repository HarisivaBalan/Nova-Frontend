import React, { useState, useEffect, Fragment } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import MetaData from "./MetaData";
import Loader from "./Loader";
import Pagination from "react-js-pagination";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap_white.css";
import Card from "./Card";

export default function ProductSearch() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [noProductsFound, setNoProductsFound] = useState(false);
  const keyword = searchParams.get("keyword") || "";
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [resPerPage, setResPerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [price, setPrice] = useState([Number(searchParams.get("minPrice")) || 1, Number(searchParams.get("maxPrice")) || 200000]);
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [rating, setRating] = useState(Number(searchParams.get("rating")) || 0);
  const [recentSearches, setRecentSearches] = useState(() => JSON.parse(localStorage.getItem("recentSearches")) || []);
  const [priceChanged, setPriceChanged] = useState(price);
  const categories = ["Laptops", "Accessories", "Food", "Snacks", "Mobile Phones", "Books", "Clothes","Shoes", "Beauty/Health", "Sports", "Outdoor", "Home", "Headphones", "Bags"];
  
  const setCurrentPageNo = (pageNo) => {
    setCurrentPage(pageNo);
    setSearchParams((prevParams) => {
      const updatedParams = new URLSearchParams(prevParams);
      updatedParams.set("page", pageNo);
      return updatedParams;
    });
  };
  
  const updateURL = (filters) => {
    const updatedParams = new URLSearchParams(searchParams);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) updatedParams.set(key, value);
      else updatedParams.delete(key);
    });
  
    if (filters.category) {
      updatedParams.delete("keyword");
    }
  
    updatedParams.set("limit", resPerPage);
  
    setSearchParams(updatedParams);
    navigate(`/search?${updatedParams.toString()}`);
  };
  

  const clearFilters = () => {
    setPrice([1, 200000]);
    setCategory("");
    setRating(0);
    setCurrentPage(1);
    updateURL({ minPrice: 1, maxPrice: 200000, category: "", rating: 0, page: 1 });
  };
  // useEffect(() => {
  //   //console.log("✅ Filters Sent to Backend:", {
  //     keyword,
  //     price,
  //     category,
  //     rating,
  //     currentPage,
  //   });
  // }, [keyword, price, category, rating, currentPage]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(

            `/api/v1/products?page=${currentPage}&limit=${resPerPage}${keyword ? `&keyword=${encodeURIComponent(keyword)}` : ""}&price[gte]=${price[0]}&price[lte]=${price[1]}${category ? `&category=${encodeURIComponent(category)}` : ""}${rating > 0 ? `&rating=${rating}` : ""}`
          );

        const data = await response.json();
        
        if (!data.products || data.products.length === 0) {
          toast.error("No products found!", { position: "top-center" });
          setProducts([]);
          setNoProductsFound(true);  // Set true only when API returns no products

          return;
        } else {
          setProducts(data.products);
          setProductsCount(data.productsCount ||data.count ||  0);
          setResPerPage(data.resPerPage || 9);
          setNoProductsFound(false);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Error fetching products.", { position: "top-center" });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, currentPage,  category, rating,priceChanged,resPerPage ]);
  useEffect(() => {
    console.log("Current Page:", currentPage);
  }, [currentPage]);
  useEffect(() => {
    if (keyword) {
      setRecentSearches((prev) => {
        const updatedSearches = [...new Set([keyword, ...prev])].slice(0, 5);
        localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
        return updatedSearches;
      });
    }
  }, [keyword]);

  const handlePriceChange = (newPrice) => {
    setPrice(newPrice);
  };

  const handlePriceRelease = () => {
    setPriceChanged(price);
    updateURL({ minPrice: price[0], maxPrice: price[1] });
  };
  return (
    <Fragment>
      <MetaData title={"Search Products"} />
      <div className="products-page">
        <div className="filters-sidebar">
          <h2>Filters</h2>

          <Slider
            range
            marks={{ 1: "₹1", 200000: "₹200000" }}
            min={1}
            max={200000}
            value={price}
            onChange={handlePriceChange}
            onChangeComplete={handlePriceRelease}
            handleRender={(renderProps) => (
              <Tooltip overlay={`₹${renderProps.props["aria-valuenow"]}`} placement="top">
                <div {...renderProps.props} />
              </Tooltip>
            )}
          />

          <button className="clear-filters" onClick={clearFilters}>CLEAR ALL</button>

          <hr className="my-5" />

          <h3 className="mb-3">Categories</h3>
          <ul className="pl-0">
            {categories.map((cat) => (
              <li
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  updateURL({ category: cat });
                }}
                className={category === cat ? "active-category" : ""}
                style={{ cursor: "pointer", listStyleType: "none" }}
              >
                {cat}
              </li>
            ))}
          </ul>

          <hr className="my-5" />

          <h4 className="mb-3">Rating</h4>
          <ul className="pl-0">
            {[5, 4, 3, 2, 1].map((star) => (
              <li
                key={star}
                onClick={() => {
                  setRating(star);
                  updateURL({ rating: star });
                }}
                style={{ cursor: "pointer", listStyleType: "none" }}
              >
                <div className="rating-outer">
                  <div className="rating-inner" style={{ width: `${star * 20}%` }}></div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="products-section">
          <h1 id="products_heading">Search Products</h1>
          {loading ? (
            <Loader />
          ) : (
            <div className="card-container1">
              {/* {products.length > 0 ? products.map((product) => <Card key={product._id} product={product} />) : <p></p>} */}
              {noProductsFound ? null : products.map((product) => <Card key={product._id} product={product} />)}

            </div>
          )}

          {!noProductsFound &&productsCount > resPerPage && (
            <div className="pagination">
            <Pagination
              activePage={currentPage}
              onChange={setCurrentPageNo}
              totalItemsCount={productsCount}
              itemsCountPerPage={resPerPage}
              nextPageText={"Next"}
              firstPageText={"First"}
              lastPageText={"Last"}
              itemClass={"page-item"}
              linkClass={"page-link"}
              style={{ marginLeft: "100px" }}
            />
            </div>
          )}
          
        </div>
      </div>
    </Fragment>
  );
}
