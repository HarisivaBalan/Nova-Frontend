import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, forgotPassword } from "../../actions/userActions";
import { toast } from "react-toastify";

export default function Forgotpassword()
{
    const[email,setEmail]=useState("")
    const dispatch =useDispatch();
    const {loading,error,message}=useSelector(state=>state.authState);
    const submitHandler =(e)=>
    {
        e.preventDefault();
        if(!email)
        {
            
                toast.error("Email is  required!", {
                  position: "top-center",
                });
                return;
              
        }
        const formData=new FormData();
        formData.append('email',email);
        dispatch(forgotPassword(formData))

    }
    useEffect(()=>
    {
        if(message)
        {
            toast(message,{
                type:'success',
                position:'top-center'
            })
            setEmail("");
            return;
        }
        if (error) {
            toast.error(error, {
                position: "top-center",
                onOpen: () => {
                    dispatch(clearAuthError);
                },
            });
        }
    },[message,error,dispatch])
    return(
        <div className="d-flex flex-column min-vh-100">
        <div className="flex-grow-1">
        <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form onSubmit={submitHandler}className="shadow-lg">
                        <h1 className="mb-3">Forgot Password</h1>
                        <div className="form-group">
                            <label htmlFor="email_field">Enter Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                placeholder='Enter your Email'
                                value={email}
                                onChange={e=>setEmail(e.target.value)}
                            />
                        </div>

                        <button
                            id="forgot_password_button"
                            type="submit"
                            className="btn btn-block py-3 mt-4"
                            disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                    Sending Email...
                                </>
                                ) : (
                               "Sent Email"
                    )}
                    </button>

                    </form>
                </div>
            </div>
            </div>
            </div>
    )
}