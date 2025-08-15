import {Fragment, useEffect, useState} from 'react'
import MetaData from '../layout/MetaData'
import { clearAuthError, login } from '../../actions/userActions'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
export default function Login()
{
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const dispatch=useDispatch();       
    const Navigate=useNavigate();
    const location=useLocation();
    const {loading,error,isAuthenticated}=useSelector(state=> state.authState);
    //console.log("Auth State:", { loading, error, isAuthenticated });
    const redirect =location.search?'/'+location.search.split('=')[1]:'/';
    const [showPassword, setShowPassword] = useState(false);
    const submitHandler =(e)=>
    {
        e.preventDefault();
        if(!email || !password)
            {
              toast.error("Both Fields are required",{
                position: "top-center",
                autoClose: 2000,
              })
              return;
            }
        dispatch(login(email,password))
    }
    useEffect(()=>{
        if (redirect === '/shipping') {
            // Skip toast for /shipping
            Navigate(redirect);
          }
        if(isAuthenticated)
        {
            if (redirect === '/shipping') {
                // Skip toast for /shipping
                Navigate(redirect);
              }else
              {
            toast.success("Logged in successfully!",{
                position:"top-center",
                autoClose:2000
            })}
            setTimeout(() => Navigate(redirect), 1500);
            
        }

        if(error)
        {
              toast.error(error, {
                position: 'top-center',
                type:'error',
                onOpen:()=>{
                    dispatch(clearAuthError())
                }
                

              });
        }
    },[error,isAuthenticated,Navigate,dispatch,redirect])
    return(
    
        <Fragment>
            <MetaData title={`Login`}/>

        
        <div className="row wrapper"> 
                <div className="col-10 col-lg-5">
                <form className="shadow-lg" onSubmit={submitHandler}>
                <h1 className="mb-3" style={{ textAlign: "center", color: "#007bff" }}>Login</h1>
                    <div className="form-group">
                    <label htmlFor="email_field">Email</label>
                    <input
                        type="email"
                        id="email_field"
                        className="form-control"
                        placeholder='Enter your Email'
                        value={email}
                        onChange={e=> 
                            setEmail(e.target.value)}
                    />
                    </div>
        
                    <div className="form-group">
                    <label htmlFor="password_field">Password</label>
                    
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password_field"
                        className="form-control"
                        placeholder='Enter your Password'
                        value={password}
                        onChange={e=> 
                            setPassword(e.target.value)}
                    /><FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className="password-toggle-icon"
                    onClick={() => setShowPassword(!showPassword)}
                />
                    </div>

                    <Link to='/password/forgot' className="float-right mb-3 mt-3">Forgot Password?</Link>
        
                    <button
                    id="login_button"
                    type="submit"
                    className="btn btn-block py-3"
                    disabled={loading}
                    >
                    {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                    Logging in...
                                </>
                                ) : (
                               "Login"
                    )}
                    </button>
                    <div className="d-flex justify-content-end mt-3">
                          <Link to='/register'className="ml-2">New User?</Link> 
                    </div>

                </form>
                </div>
        </div>
    </Fragment>
    )
    
}