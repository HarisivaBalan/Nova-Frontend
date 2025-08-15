import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { debounce } from "lodash";

export default function Search() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const keywordFromURL = queryParams.get("keyword") || ""; // ✅ Extract once
    const [keyword, setKeyword] = useState(keywordFromURL);
    const [history, setHistory] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showHistory, setShowHistory] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const currentPage = parseInt(queryParams.get("page")) || 1;
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem("recentSearches")) || [];
        setHistory(storedHistory);
    }, []);

    const fetchSuggestionsRef = useRef(
        debounce(async (searchQuery) => {
            if (!searchQuery) {
                setSuggestions([]);
                setShowHistory(true);
                return;
            }

            try {
                const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/suggestions?query=${searchQuery}&limit=10`);
                const data = await res.json();

                if (!data.suggestions || data.suggestions.length === 0) {
                    setSuggestions([]);
                    return;
                }

                setSuggestions(data.suggestions);
                setShowHistory(false);
            } catch (err) {
                console.error("Error fetching suggestions:", err);
            }
        }, 300)
    );

    useEffect(() => {
        const fetchSuggestions = fetchSuggestionsRef.current; // ✅ Fix: Store ref value in a variable
        fetchSuggestions(keyword);

        return () => {
            fetchSuggestions.cancel();
        };
    }, [keyword]);

    const searchHandler = async (e) => {
        e.preventDefault();
        if (keyword.trim() === "") {
            navigate("/");
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products?page=1&limit=9&keyword=${encodeURIComponent(keyword)}`);
            const data = await response.json();

            if (!data.products || data.products.length === 0){
                toast.error("No products, brands, or categories found.", { position: "top-center" });
                return;
            }

            navigate(`/search?keyword=${encodeURIComponent(keyword)}&page=1`);

            if (keyword) {
                const updatedHistory = [keyword, ...history.filter((item) => item !== keyword)].slice(0, 5);
                setHistory(updatedHistory);
                localStorage.setItem("recentSearches", JSON.stringify(updatedHistory));
            }
            setKeyword("");
            setShowDropdown(false);
        } catch (error) {
            console.error("Error navigating to search page:", error);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            if (!keywordFromURL) return; // ✅ Fix: Use extracted `keywordFromURL`

            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products?page=${currentPage}&limit=6&keyword=${encodeURIComponent(keywordFromURL)}`);
                const data = await response.json();
                //console.log("🔹 API Response in Frontend:", data);
                if (data.totalProducts) {
                    setTotalPages(Math.ceil(data.totalProducts / 6));
                }
                if (data.products) {
                    setProducts(data.products);  // ✅ Ensure this updates state
                }
                //console.log("🔹 Products in State:", products);

            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, [keywordFromURL, currentPage]); // ✅ Fix: Use `keywordFromURL` instead of `queryParams`
    const suggestionClickHandler = (suggestion) => {
        navigate(`/search?keyword=${encodeURIComponent(suggestion)}&page=1`);
        // setKeyword(""); // ✅ Clear input field
        setShowDropdown(false);
    };
    useEffect(() => {
        setKeyword(""); // ✅ Clear input when URL changes
    }, [location.search]);
    
    const removeHistoryItem = (itemToRemove, e) => {
        e.stopPropagation();
        const updatedHistory = history.filter((item) => item !== itemToRemove);
        setHistory(updatedHistory);
        localStorage.setItem("recentSearches", JSON.stringify(updatedHistory));
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                inputRef.current !== event.target
            ) {
                setTimeout(() => setShowDropdown(false), 200);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="search-box mx-3" ref={dropdownRef} style={{ position: "relative" }}>
            <form onSubmit={searchHandler}>
                <button type="submit">
                    <i className="fas fa-search"></i>
                </button>
                <input
                    type="search"
                    ref={inputRef}
                    placeholder="Search products, brands, and more"
                    className="form-control"
                    onChange={(e) => setKeyword(e.target.value)}
                    value={keyword}
                    onFocus={() => {
                        setShowDropdown(true);
                        setShowHistory(true);
                    }}
                />

                {showDropdown && (
                    <div 
                        className="search-dropdown" 
                        style={{
                            position: "absolute",
                            top: "100%",
                            left: "0",
                            width: "100%",
                            background: "#fff",
                            border: "1px solid #ddd",
                            zIndex: "1000",
                            display: "block !important"
                        }}
                    >
                        {showHistory && history.length > 0 && (
                            <div className="recent-search-container">
                                <p className="recent-search-title">Recent Searches</p>
                                {history.map((item, index) => (
                                    <div
                                        key={index}
                                        className="search-item"
                                        onClick={() => {
                                            navigate(`/search?keyword=${encodeURIComponent(item)}&page=1`);
                                            setShowDropdown(false);
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.querySelector(".delete-icon").style.display = "inline"}
                                        onMouseLeave={(e) => e.currentTarget.querySelector(".delete-icon").style.display = "none"}
                                    >
                                        <i className="fas fa-history"></i> {item}
                                        <i
                                            className="fas fa-times delete-icon"
                                            style={{ display: "none", cursor: "pointer" }}
                                            onClick={(e) => removeHistoryItem(item, e)}
                                        ></i>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!showHistory && suggestions.length > 0 && (
                            <>
                                {suggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="search-item"
                                        // onClick={() => {
                                        //     navigate(`/search?keyword=${encodeURIComponent(suggestion)}&page=1`);
                                        //     setShowDropdown(false);
                                            
                                        // }}
                                        onClick={() => suggestionClickHandler(suggestion)}
                                    >
                                        <i className="fas fa-search"></i> {suggestion}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                )}
            </form>
        </div>
    );
}
