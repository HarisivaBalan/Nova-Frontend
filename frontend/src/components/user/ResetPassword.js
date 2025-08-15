// import { useEffect, useState } from "react"
// import { clearAuthError,resetPassword } from "../../actions/userActions";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";

// export default function ResetPassword(){
//         const[password,setPassword]=useState("");
//         const[confirmPassword,setConfirmPassword]=useState("");
//         const dispatch=useDispatch();
//         const{isAuthenticated,error}=useSelector(state=>state.authState)
//         const navigate=useNavigate();
//         const {token}=useParams();
//         const submitHandler =(e)=>
//     {
//         e.preventDefault();
//         const formData=new FormData();
//         formData.append('password',password);
//         formData.append('confirmPassword',confirmPassword);
        
//         dispatch(resetPassword(formData,token))

//     }
//     useEffect(()=>{
//         if(isAuthenticated){
//             toast('Password Successfully Changed!',{
//                 type:'success',
//                 position:'top-center'
                
//             })
//             setPassword("");
//             navigate('/')
                
//         }
//         if (error) {
//             toast.error(error, {
//                 position: "top-center",
//                 onOpen: () => {
//                     dispatch(clearAuthError);
//                 },
//             });
//         }
//     },[isAuthenticated,error,dispatch,navigate])
//         return(
//             <div className="row wrapper">
//             <div className="col-10 col-lg-5">
//                 <form onSubmit={submitHandler}className="shadow-lg">
//                     <h1 className="mb-3">New Password</h1>

//                     <div className="form-group">
//                         <label htmlfor="password_field">Password</label>
//                         <input
//                             type="password"
//                             id="password_field"
//                             placeholder='Enter your New Password'
//                             className="form-control"
//                             value={password}
//                             onChange={e=>setPassword(e.target.value)}
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label htmlfor="confirm_password_field">Confirm Password</label>
//                         <input
//                             type="password"
//                             id="confirm_password_field"
//                             className="form-control"
//                             placeholder='Re-Type Password'
//                             value={confirmPassword}
//                             onChange={e=>setConfirmPassword(e.target.value)}
//                         />
//                     </div>

//                     <button
//                         id="new_password_button"
//                         type="submit"
//                         className="btn btn-block py-3 mt-4">
//                         Set Password
//                     </button>

//                 </form>
//             </div>
//         </div>
//         )
// }
import { useEffect, useState } from "react";
import {
  clearAuthError,
  resetPassword,
} from "../../actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { loading } = useSelector((state) => state.authState);
  const dispatch = useDispatch();
  const { isAuthenticated, error } = useSelector((state) => state.authState);
  const navigate = useNavigate();
  const { token } = useParams();

  const submitHandler = (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Both password fields are required!", {
        position: "top-center",
      });
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!", {
        position: "top-center",
      });
      return;
    }
    const payload = { password, confirmPassword };
    dispatch(resetPassword(payload, token));
  };

  useEffect(() => {
    if (isAuthenticated) {
      toast("Password Successfully Changed!", {
        type: "success",
        position: "top-center",
      });
      setPassword("");
      setConfirmPassword("");
      navigate("/");
    }

    if (error) {
      toast.error(error, {
        position: "top-center",
        onOpen: () => {
          dispatch(clearAuthError());
        },
      });
    }
  }, [isAuthenticated, error, dispatch, navigate]);

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form onSubmit={submitHandler} className="shadow-lg">
          <h1 className="mb-3">New Password</h1>

          {/* Password Field */}
          <div className="form-group" style={{ position: "relative" }}>
            <label htmlFor="password_field">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password_field"
              placeholder="Enter your New Password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                top: "70%",
                right: "15px",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#6c757d",
                zIndex: 2,
              }}
            />
          </div>

          {/* Confirm Password Field */}
          <div className="form-group" style={{ position: "relative" }}>
            <label htmlFor="confirm_password_field">Confirm Password</label>
            <input
              type={showConfirm ? "text" : "password"}
              id="confirm_password_field"
              className="form-control"
              placeholder="Re-Type Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <FontAwesomeIcon
              icon={showConfirm ? faEyeSlash : faEye}
              onClick={() => setShowConfirm(!showConfirm)}
              style={{
                position: "absolute",
                top: "70%",
                right: "15px",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#6c757d",
                zIndex: 2,
              }}
            />
          </div>

          <button
            id="new_password_button"
            type="submit"
            className="btn btn-block py-3 mt-4"
            disabled={loading}
          >
            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                    Setting Password...
                                </>
                                ) : (
                               "Set Password"
                    )}
          </button>
        </form>
      </div>
    </div>
  );
}
