import { Fragment, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createReview, getProduct } from "../actions/productActions";
import Loader from "./layout/Loader";
import { Carousel, Modal } from "react-bootstrap";
import MetaData from "./layout/MetaData";
import { addCartItem } from "../actions/cartActions";
import { clearReviewSubmitted, clearError } from "../slices/singleproductSlice";
import { toast } from "react-toastify";
import ProductReview from "./layout/ProductReview";

export default function ProductDetail() {
    const { loading, product = {}, isReviewSubmitted, error } = useSelector((state) => {
        
        return state.productState;
    });
    

    const { user } = useSelector(state => state.authState);
    const dispatch = useDispatch();
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [show, setShow] = useState(false);
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState("");
    const reviewSectionRef = useRef(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const increaseQty = () => {
        if (product.stock === 0 || quantity >= product.stock) return;
        setQuantity(quantity + 1);
    };
   
      

    const decreaseQty = () => {
        if (quantity === 1) return;
        setQuantity(quantity - 1);
    };

    const reviewHandler =async  (e) => {
        e.preventDefault();

        if (rating < 1 || !comment.trim()) {
            return toast.error("Please provide a rating and comment!", { position: "top-center", autoClose: 2000 });
        }

        if (!id) {
            return toast.error("Product ID is missing!", { position: "top-center", autoClose: 2000 });
        }

        const reviewData = { rating, comment, productId: id };

        // Close the modal immediately
        setShow(false);

        try {
            await dispatch(createReview(reviewData)); // Wait for action completion
            
    
            setShow(false); // Close modal after successful dispatch
        } catch (err) {
            console.error("Review submission failed:", err);
        }
    };
    
    
    // Fetch product details on component mount or when ID changes
    useEffect(() => {
        dispatch(getProduct(id));
    }, [dispatch, id]);

    // Handle review submission success and errors
    useEffect(() => {
        

        if (isReviewSubmitted) {
            // Close the modal
            setShow(false);

            // Show success toast
            toast.success("Review Submitted successfully!", { position: "top-center", autoClose: 2000 });

            // Fetch updated product data (including reviews)
           
            // Scroll to the review section after a slight delay
            setTimeout(() => {
                if (reviewSectionRef.current) {
                   
                    reviewSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 500); // Reduced delay to 500ms

            // Clear the review submission flag
            dispatch(clearReviewSubmitted());
        }

        if (error) {
            toast.error(error, { position: "top-center", autoClose: 2000 });
            dispatch(clearError());
        }
    }, [isReviewSubmitted, error, dispatch, id,product]);

    return (
        <Fragment>
            <div className="page-wrapper">
            {loading ? (
                <Loader />
            ) : product._id ? (
                <Fragment>
                    <MetaData title={product.name} />
                    <div className="row f-flex justify-content-around">
                        <div className="col-12 col-lg-5 img-fluid" id="product_image">
                            <Carousel pause="hover">
                                {product.images?.map(image => (
                                    <Carousel.Item key={image._id}>
                                        <img className="d-block w-100" src={image.url} alt={product.name} height="500" width="500" />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </div>

                        <div className="col-12 col-lg-5 mt-5">
                            <h3>{product.name}</h3>
                            <p id="product_id">Product # {product._id}</p>
                            <hr />
                            <div className="rating-outer">
                                <div className="rating-inner" style={{ width: `${(product.ratings / 5) * 100}%` }}></div>
                            </div>
                            <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>
                            <hr />
                            <p id="product_price">₹{product.price}</p>
                            <div className="stockCounter d-inline">
                                <button className="btn btn-danger" onClick={decreaseQty}>-</button>
                                <input type="number" className="form-control count d-inline" value={quantity} readOnly />
                                <button className="btn btn-primary" onClick={increaseQty}>+</button>
                            </div>
                            <button type="button" id="cart_btn"
                                disabled={product.stock === 0}
                                onClick={() => {
                                    dispatch(addCartItem(product._id, quantity));
                                    toast.success("Cart Item Added!", { position:  "top-center", autoClose: 2000 });
                                }}
                                className="btn btn-primary d-inline ml-4"
                            >
                                Add to Cart
                            </button>
                            <hr />
                            <p>Status: <span className={product.stock > 0 ? "greenColor" : "redColor"}>{product.stock > 0 ? "In Stock" : "Out of Stock"}</span></p>
                            <hr />
                            <h4>Description:</h4>
                            <p>{product.description}</p>
                            <p>Sold by: <strong>{product.seller}</strong></p>

                            {user ? (
                                <button onClick={handleShow} id="review_btn" className="btn btn-primary mt-4">
                                    Submit Your Review
                                </button>
                            ) : (
                                <div className="alert alert-danger mt-5">Login to Post Review</div>
                            )}

                            <Modal show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Submit Review</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <form onSubmit={reviewHandler}>
                                        <ul className="stars">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <li key={star} className={`star ${star <= rating ? "orange" : ""}`} onClick={() => setRating(star)}>
                                                    <i className="fa fa-star"></i>
                                                </li>
                                            ))}
                                        </ul>
                                        <textarea onChange={(e) => setComment(e.target.value)} className="form-control mt-3" placeholder="Add a comment" />
                                        <button type="submit" disabled={loading} className="btn my-3 float-right review-btn px-4 text-white">
                                            Submit
                                        </button>
                                    </form>
                                </Modal.Body>
                            </Modal>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div ref={reviewSectionRef}>
                        {product.reviews?.length > 0 ? <ProductReview reviews={product.reviews} /> : <h2 className="text-center mt-5">No Reviews Yet</h2>}
                    </div>
                </Fragment>
            ) : (
                <h2 className="text-center mt-5">Product not found</h2>
            )}
            </div>
        </Fragment>
    );
}