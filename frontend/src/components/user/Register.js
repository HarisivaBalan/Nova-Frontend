    import { useEffect, useState } from "react";
    import { useDispatch, useSelector } from "react-redux";
    import { clearAuthError, register } from "../../actions/userActions";
    import { toast } from "react-toastify";
    import { useNavigate } from "react-router-dom";
    import "react-toastify/dist/ReactToastify.css";
    import axios from 'axios'
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

    export default function Register() {
        const [userData, setUserData] = useState({
            name: "",
            email: "",
            password: "",
        });
        const [avatar, setAvatar] = useState("");
        const [avatarPreview, setAvatarPreview] = useState("/images/default_avatar.png");
        const [showPassword, setShowPassword] = useState(false);

        const dispatch = useDispatch();
        const navigate = useNavigate();
        //const { loading, error, otpPending } = useSelector((state) => state.authState);
        const { loading, error, otpPending, registeredEmail } = useSelector((state) => state.authState);

        const onChange = (e) => {
            if (e.target.name === "avatar") {
                const reader = new FileReader();
                reader.onload = () => {
                    if (reader.readyState === 2) {
                        setAvatarPreview(reader.result);
                        setAvatar(e.target.files[0]);
                    }
                };
                reader.readAsDataURL(e.target.files[0]);
            } else {
                setUserData({ ...userData, [e.target.name]: e.target.value });
            }
        };

        const submitHandler = (e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append("name", userData.name);
            formData.append("email", userData.email);
            formData.append("password", userData.password);
            formData.append("avatar", avatar);
            dispatch(register(formData)); // only triggers backend save and sets otpPending
        };
        useEffect(() => {
            const sendOtp = async () => {
                try {
                    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/send-otp`, { email: registeredEmail });
                    toast.success(
                        <div className="toast-center">
                            <span className="toast-icon">✅</span>
                            <p>Registration Successful! Please verify OTP.</p>
                        </div>,
                        {
                            position: "top-center",
                            autoClose: 2000,
                            icon: false,
                            onClose: () => navigate(`/verify-otp?email=${registeredEmail}`),
                        }
                    );
                } catch (err) {
                    toast.error("Failed to send OTP", {
                        position: "top-center",
                    });
                }
            };
        
            if (otpPending && registeredEmail) {
                sendOtp();
            }
        
            if (error) {
                toast.error(error, {
                    position: "bottom-center",
                    onOpen: () => dispatch(clearAuthError()),
                });
            }
        }, [otpPending, error, dispatch, navigate, registeredEmail]);
        
        

        return (
            <div className="row wrapper">
                <div className="col-10 col-lg-5" id="register">
                    <form onSubmit={submitHandler} className="shadow-lg" encType="multipart/form-data">
                        <h1 className="mb-3 text-center text-primary">Register</h1>

                        <div className="form-group">
                            <label htmlFor="name_field">Name</label>
                            <input
                                name="name"
                                onChange={onChange}
                                type="text"
                                id="name_field"
                                className="form-control"
                                value={userData.name}
                                placeholder="Enter Your Name "
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                name="email"
                                onChange={onChange}
                                value={userData.email}
                                placeholder="Enter Your Email "
                            />
                        </div>

                        {/* <div className="form-group">
                            <label htmlFor="password_field">Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                name="password"
                                onChange={onChange}
                                value={userData.password}
                                placeholder="Must include uppercase, lowercase and special character"

                            />
                        </div> */}
                       <div className="form-group password-wrapper">
    <label htmlFor="password_field">Password</label>
    <input
        type={showPassword ? "text" : "password"}
        id="password_field"
        className="form-control"
        name="password"
        onChange={onChange}
        value={userData.password}
        placeholder="Enter a new password"
    />
    <FontAwesomeIcon
        icon={showPassword ? faEyeSlash : faEye}
        style={ {
            position: "absolute",
            
            top: "70%",
    right: "15px",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#6c757d",
    zIndex: 2
          }}
        onClick={() => setShowPassword(!showPassword)}
    />
</div>



                        <div className="form-group">
                            <label htmlFor="avatar_upload">Avatar</label>
                            <div className="d-flex align-items-center">
                                <figure className="avatar mr-3 item-rtl">
                                    <img src={avatarPreview} className="rounded-circle" alt="User Avatar" />
                                </figure>
                                <div className="custom-file">
                                    <input
                                        type="file"
                                        name="avatar"
                                        className="custom-file-input"
                                        id="customFile"
                                        onChange={onChange}

                                    />
                                    <label className="custom-file-label" htmlFor="customFile">Choose Avatar</label>
                                </div>
                            </div>
                        </div>

                        <button
                            id="register_button"
                            type="submit"
                            disabled={loading}
                            className="btn btn-block py-3"
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                    Registering...
                                </>
                                ) : (
                                "Register"
                                )}

                        </button>
                    </form>
                </div>
            </div>
        );
    }
