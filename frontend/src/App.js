import './App.css';
import Footer from './components/layout/footer';
import Header from './components/layout/header';
import Home from './components/layout/Home';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'
import {HelmetProvider} from 'react-helmet-async'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import ProductDetail from './components/ProductDetails';
import ProductSearch from './components/layout/ProductSearch';
import Login from './components/user/Login';
import Register from './components/user/Register';
import { useEffect, useState } from 'react';
// import store from './store'
// import { loadUser } from './actions/userActions';
import Profile from './components/user/Profile';
import ProtectedRoute from './components/route/ProtectedRoute';
import UpdateProfile from './components/user/updateProfile';
import UpdatePassword from './components/user/updatePassword';
import Forgotpassword from './components/user/forgotPassword';
import ResetPassword from './components/user/ResetPassword';
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import ConfirmOrder from './components/cart/confirmOrder';
import Payment from './components/cart/Payment';
import {Elements} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
//import { fetchUser } from './actions/userActions';  // Change `loadUser` to `fetchUser`
import { useSelector } from 'react-redux';
import { loadUser } from "./slices/authSlice";

//import store from './store';

import VerifyOtp from "./components/user/verifyOtp";


import Loader from './components/layout/Loader'
import OrderSuccess from './components/cart/OrderSuccess';
import UserOrder from './components/order/UserOrder';
import OrderDetail from './components/order/OrderDetail';
import { useDispatch } from 'react-redux';
import Wishlist from './components/layout/Fav';
function App() {
  const [stripeApikey,setStripeApiKey]=useState("");
  const dispatch=useDispatch();
  const { user } = useSelector(state=> state.authState) 
  const originalWarn = console.warn;
console.warn = (message, ...args) => {
  if (typeof message === "string" && message.includes("Stripe.js integration over HTTP")) {
    return;
  }
  originalWarn(message, ...args);
};



  // useEffect(() => {
  //   // store.dispatch(loadUser)
  //   if(user){
  //   async function getStripeApiKey(){
  //     const {data} = await axios.get('/api/v1/stripeapi')
  //     setStripeApiKey(data.stripeApiKey)
  //   }
  //   getStripeApiKey()
  // }
  // },[user]) ;
  
  
// useEffect(() => {
  
  
//       dispatch(fetchUser());
  
// }, [dispatch]); 
// useEffect(() => {
//   dispatch(loadUser());
// }, [dispatch]);
useEffect(() => {
  dispatch(loadUser()); // Call this ONLY once when app mounts
}, [dispatch]);

useEffect(() => {
  async function getStripeApiKey() {
    try {
      const { data } = await axios.get('/api/v1/stripeapi', {
        withCredentials: true,
      });
      setStripeApiKey(data.stripeApiKey);
      console.log("Fetched Stripe Key:", data.stripeApiKey);
    } catch (error) {
      console.error("Stripe API key fetch error:", error);
    }
  }

  // Only fetch API key if user is loaded & authenticated
  if (user) {
    getStripeApiKey();
  }
}, [user]);


// useEffect(() => {
//   store.dispatch(loadUser()); // properly dispatch the thunk
// }, [dispatch]);
// useEffect(() => {
//   async function getStripeApiKey() {
//     try {
//       const { data } = await axios.get('/api/v1/stripeapi', {
//         withCredentials: true
//       });
      
//       console.log("Stripe API Key: ", data.stripeApiKey);
//       setStripeApiKey(data.stripeApiKey);
//     } catch (error) {
//       console.error("Stripe API key fetch error:", error);
//     }
//   }

//   if (user?.user) getStripeApiKey();
// }, [user]);
  return (
    <Router>
    <div className="App">
      <HelmetProvider>
            <Header/> 
            <div className='container container-fluid'>
            <ToastContainer theme="dark"/>
                <Routes>
                      <Route path='/' element={<Home/>}/>
                      <Route path='/product/:id' element={<ProductDetail/>}/>
                      <Route path='/search/:keyword' element={<ProductSearch/>}/>
                      <Route path="/search" element={<ProductSearch />} />
                      <Route path="/verify-otp" element={<VerifyOtp />} />
                      <Route path='/login' element={<Login/>}/>
                      <Route path='/register' element={<Register/>}/>
                      <Route path='/myprofile' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
                      <Route path='/myprofile/update' element={<ProtectedRoute><UpdateProfile/></ProtectedRoute>}/>
                      <Route path='/password/forgot' element={<Forgotpassword/>}/>
                      <Route path='/password/reset/:token' element={<ResetPassword/>}/>

                      <Route path='/myprofile/update/password' element={<ProtectedRoute><UpdatePassword/></ProtectedRoute>}/>
                      <Route path='/cart' element={<Cart/>}/>
                      <Route path='/shipping' element={<ProtectedRoute><Shipping/></ProtectedRoute>}/>
                      <Route path='/order/success' element={<ProtectedRoute><OrderSuccess/></ProtectedRoute>}/>
                      <Route path='/order/confirm' element={<ProtectedRoute><ConfirmOrder/></ProtectedRoute>}/>
                      <Route path='/orders' element={<ProtectedRoute><UserOrder/></ProtectedRoute>}/>
                      <Route path='/order/:id' element={<ProtectedRoute><OrderDetail/></ProtectedRoute>}/>
                      <Route
                                path="/payment"
                                element={
                                  <ProtectedRoute>
                                    {stripeApikey ? (
                                      <Elements stripe={loadStripe(stripeApikey)}>
                                        <Payment />
                                      </Elements>
                                    ) : (
                                      <Loader />// fallback
                                    )}
                                  </ProtectedRoute>
                                }
                              />

                      <Route path="/wishlist" element={<Wishlist/>}></Route>
                </Routes>
            </div>
          
            <Footer/>
      </HelmetProvider>
    </div>
    </Router>
  );
}

export default App;
