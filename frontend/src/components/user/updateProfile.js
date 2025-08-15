import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { updateProfile, clearAuthError } from "../../actions/userActions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { clearUpdateProfile } from "../../slices/authSlice";

export default function UpdateProfile() {
    const {loading,error, user, isUpdated } = useSelector(state => state.authState);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("./images/default_avatar.png");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onChangeAvatar = (e) => {
        if (e.target.name === "avatar") {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result); // Update avatar preview
                    setAvatar(e.target.files[0]); // Set avatar file
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("avatar", avatar);
        dispatch(updateProfile(formData));
    };

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email); // Corrected typo
            if (user.avatar) {
                setAvatarPreview(user.avatar);
            }
        }
        if (isUpdated) {
            toast.success("Profile Updated Successfully", {
                position: "top-center",
                autoClose: 2000,
                onClose: () => navigate("/myprofile"), // Redirect to the MyProfile page
                onOpen:()=>dispatch(clearUpdateProfile())
            });
        }
        if (error) {
            toast.error(error, {
                position: "bottom-center",
                onOpen: () => {
                    dispatch(clearAuthError());
                },
            });
        }
    }, [user, isUpdated, error, dispatch, navigate]); // Proper dependency array

    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data'>
                    <h1 className="mt-2 mb-5">Update Profile</h1>

                    <div className="form-group">
                        <label htmlFor="email_field">Name</label>
                        <input
                            type="text"
                            id="name_field"
                            className="form-control"
                            name='name'
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email_field">Email</label>
                        <input
                            type="email"
                            id="email_field"
                            className="form-control"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='avatar_upload'>Avatar</label>
                        <div className='d-flex align-items-center'>
                            <div>
                                <figure className='avatar mr-3 item-rtl'>
                                    <img
                                        src={avatarPreview}
                                        className='rounded-circle'
                                        alt='Avatar Preview'
                                    />
                                </figure>
                            </div>
                            <div className='custom-file'>
                                <input
                                    type='file'
                                    name='avatar'
                                    className='custom-file-input'
                                    id='customFile'
                                    onChange={onChangeAvatar}
                                />
                                <label className='custom-file-label' htmlFor='customFile'>
                                    Choose Avatar
                                </label>
                            </div>
                        </div>
                    </div>

                    <button type="submit"  className="btn update-btn btn-block mt-4 mb-3"
                    disabled={loading}>
                        {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                    Updating Profile...
                                </>
                                ) : (
                                    "Update Profile"
                    )}</button>
                </form>
            </div>
        </div>
    );
}
