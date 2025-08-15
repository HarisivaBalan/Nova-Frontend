import { Fragment, useEffect } from "react";
import MetaData from "../layout/MetaData";
import {MDBDataTable} from 'mdbreact'
import { useDispatch, useSelector } from "react-redux";
import { userOrders  as userOrdersAction} from "../../actions/orderAction";
import { Link } from "react-router-dom";
import React from "react";
export default function UserOrder(){
    const {userOrders=[]}=useSelector(state=>state.orderState)

    const dispatch=useDispatch()
    // useEffect(() => {
    //     console.log(userOrders); // Log the state structure to the console
    //     dispatch(userOrdersAction());
    // }, [dispatch,userOrders]);
    
    useEffect(()=>{
        dispatch(userOrdersAction())
    },[dispatch])
    const setOrders=()=>{
        const data={
            columns:[
                {
                    label:"Product name",
                    field:"name",
                    sort:"asc"
                },
                {
                    label:"Number Of Items",
                    field:"numOfItems",
                    sort:"asc"
                },
                {
                    label:"Amount",
                    field:"amount",
                    sort:"asc"
                },
                {
                    label:"Status",
                    field:"status",
                    sort:"asc"
                },
                {
                    label:"Actions",
                    field:"actions",
                    sort:"asc"
                }
            ],
            rows:[]

        }
        userOrders.forEach(userOrder => {
            data.rows.push({
                name:userOrder.orderItems[0].name,
                numOfItems:userOrder.orderItems.length,
                amount:`₹${userOrder.totalPrice}`,
                status:userOrder.orderStatus && userOrder.orderStatus.includes('Delivered')?
                (<p style={{color:'green'}}>{userOrder.orderStatus}</p>):
                (<p style={{color:'red'}}>{userOrder.orderStatus}</p>),
                actions:<Link to={`/order/${userOrder._id}`}className="btn btn-primary">
                    <i className="fa fa-eye"></i>
                </Link>
            })
            
        });
        return data;
    }
    return(
        <div className="d-flex flex-column min-vh-100">
        <div className="flex-grow-1">
        <Fragment>
                <MetaData title="My Orders"/>
                {userOrders.length === 0 ? (
                <div className="d-flex flex-column justify-content-center align-items-center text-center"style={{ minHeight: "70vh" }}>
                    <img src="/images/norder.png"alt="No order"style={{ width: "150px", marginBottom: "20px" }}></img>
                <h4>You haven’t placed any orders yet.</h4>
                <p className="mt-3 mb-4">Searching for something new? Start shopping now!</p>
                <Link to="/" className="btn btn-primary mt-3">Browse Products</Link>
        </div>
      ) :(
        <div>
                <h1 className="mt-5">My Orders</h1>
                <MDBDataTable
                className='px-3'
                bordered
                striped
                hover
                data={setOrders()}></MDBDataTable></div>)}
        </Fragment></div></div>
    )
}