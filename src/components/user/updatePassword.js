// import { useEffect, useState } from "react"
// import { clearAuthError, updatePassword as updatePasswordAction} from "../../actions/userActions";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// export default function UpdatePassword()
// {
//     const [password,setPassword]=useState("");
//     const [oldpassword,setoldPassword]=useState("");
//     const dispatch = useDispatch();
//     const {isUpdated,error}=useSelector(state=>state.authState)
//     const navigate=useNavigate();
//     const submitHandler =(e)=>
//     {
//         e.preventDefault();
//         const formData=new FormData();
//         formData.append('oldPassword',oldpassword);
//         formData.append('password', password);
//         dispatch(updatePasswordAction(formData));
//     }
//     useEffect(()=>{
//         if(isUpdated) {
//             toast.success("Password Updated Successfully", {
//             position: "top-center",
//             autoClose: 2000,
//             onClose: () => navigate("/myprofile"), // Redirect to the MyProfile page
//         })
//         setoldPassword("")
//         setPassword("");
//         return;
//         }
//                 if (error) {
//             toast.error(error, {
//                 position: "top-center",
//                 onOpen: () => {
//                     dispatch(clearAuthError);
//                 },
//             });
//             return;
//         }
//     },[isUpdated,error,dispatch,navigate])
//     return (
//         <div className="row wrapper">
//                 <div className="col-10 col-lg-5">
//                     <form onSubmit={submitHandler}className="shadow-lg">
//                         <h1 className="mt-2 mb-5">Update Password</h1>
//                         <div className="form-group">
//                             <label htmlfor="old_password_field">Old Password</label>
//                             <input
//                                 type="password"
//                                 id="old_password_field"
//                                 className="form-control"
//                                 placeholder='Enter your Old Password'
//                                 value={oldpassword}
//                                 onChange={e=>setoldPassword(e.target.value)}
//                             />
//                         </div>

//                         <div className="form-group">
//                             <label htmlfor="new_password_field">New Password</label>
//                             <input
//                                 type="password"
//                                 id="new_password_field"
//                                 className="form-control"
//                                 placeholder='Enter a New Password'
//                                 value={password}
//                                 onChange={e=>setPassword(e.target.value)}
//                             />
//                         </div>

//                         <button type="submit" className="btn update-btn btn-block mt-4 mb-3">Update Password</button>
//                     </form>
//                 </div>
//             </div>
        
//     )
// }
import { useEffect, useState } from "react";
import {
  clearAuthError,
  updatePassword as updatePasswordAction,
} from "../../actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [oldpassword, setoldPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const dispatch = useDispatch();
  const { loading,isUpdated, error } = useSelector((state) => state.authState);
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if(!oldpassword || !password)
    {
      toast.error("Both Fields are required",{
        position: "top-center",
        autoClose: 2000,
      })
      return;
    }
    const formData = new FormData();
    formData.append("oldPassword", oldpassword);
    formData.append("password", password);
    dispatch(updatePasswordAction(formData));
  };

  useEffect(() => {
    if (isUpdated) {
      toast.success("Password Updated Successfully", {
        position: "top-center",
        autoClose: 2000,
        onClose: () => navigate("/myprofile"),
      });
      setoldPassword("");
      setPassword("");
      return;
    }

    if (error) {
      toast.error(error, {
        position: "top-center",
        onOpen: () => {
          dispatch(clearAuthError());
        },
      });
      return;
    }
  }, [isUpdated, error, dispatch, navigate]);

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form onSubmit={submitHandler} className="shadow-lg">
          <h1 className="mt-2 mb-5">Update Password</h1>

          {/* Old Password Field */}
          <div className="form-group" style={{ position: "relative" }}>
            <label htmlFor="old_password_field">Old Password</label>
            <input
              type={showOldPassword ? "text" : "password"}
              id="old_password_field"
              className="form-control"
              placeholder="Enter your Old Password"
              value={oldpassword}
              onChange={(e) => setoldPassword(e.target.value)}
            />
            <FontAwesomeIcon
              icon={showOldPassword ? faEyeSlash : faEye}
              onClick={() => setShowOldPassword(!showOldPassword)}
              style={{
                position: "absolute",
                top: "70%",
                right: "15px",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#6c757d",
                zIndex: 10,
              }}
            />
          </div>

          {/* New Password Field */}
          <div className="form-group" style={{ position: "relative" }}>
            <label htmlFor="new_password_field">New Password</label>
            <input
              type={showNewPassword ? "text" : "password"}
              id="new_password_field"
              className="form-control"
              placeholder="Enter a New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FontAwesomeIcon
              icon={showNewPassword ? faEyeSlash : faEye}
              onClick={() => setShowNewPassword(!showNewPassword)}
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
            type="submit"
            className="btn update-btn btn-block mt-4 mb-3"
            disabled={loading}
          >
            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                    Updating Password...
                                </>
                                ) : (
                               "Update Password"
                    )}
          </button>
        </form>
      </div>
    </div>
  );
}
