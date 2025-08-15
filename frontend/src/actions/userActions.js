import axios from "axios";
import { 
  clearError, forgotPasswordFail, forgotPasswordRequest, forgotPasswordSuccess, 
  loginFail, loginRequest, loginSuccess, logoutFail, logoutSuccess, 
  registerFail, registerRequest, registerSuccess, resetPasswordFail, 
  resetPasswordRequest, resetPasswordSuccess, updatePasswordFail, 
  updatePasswordRequest, updatePasswordSuccess, updateProfileFail, 
  updateProfileRequest, updateProfileSuccess, loadUser 
} from "../slices/authSlice";  // Import `loadUser` instead of `loadUserFail`
axios.defaults.withCredentials = true;
export const login = (email, password) => async (dispatch) => {
    try {
        dispatch(loginRequest());
        const { data } = await axios.post(`/api/v1/login`, { email, password });
        //console.log("Login Response:", data);
        dispatch(loginSuccess(data.user));
        dispatch(fetchUser());
    } catch (error) {
        dispatch(loginFail(error.response.data.message));
    }
};

export const clearAuthError = () =>  (dispatch) => {
    dispatch(clearError());
};

export const register = (userData) => async (dispatch) => {
    try {
        dispatch(registerRequest());
        const config = { headers: { 'Content-type': 'multipart/form-data' } };
        const { data } = await axios.post(`/api/v1/register`, userData, config);
        // dispatch(registerSuccess(data.user));
        dispatch(registerSuccess({ email: data.user.email }));
    } catch (error) {
        dispatch(registerFail(error.response?.data?.message || "Registration failed"));

    }
};

export const fetchUser = () => async (dispatch,getState) => {
    // const state = getState(); 
    // //console.log("State:", state);// Get the current state
    // const auth = state?.authState;  // ✅ Use authState instead of auth
    //     if (!auth || !auth.isAuthenticated) {
    //         //console.warn("User is not authenticated");
    //         return;
    //     }
    try {   
        const { data } = await axios.get(`/api/v1/myprofile`, { withCredentials: true });
        dispatch(loadUser.fulfilled(data.user));
    } catch (error) {
        dispatch(loadUser.rejected(error.response.data.message));
    }
};


export const logout = () => async (dispatch) => {
    try {
        await axios.post(`/api/v1/logout`);
        dispatch(logoutSuccess());
    } catch (error) {
        dispatch(logoutFail(error.response.data.message));
    }
};

export const updateProfile = (userData) => async (dispatch) => {
    try {
        dispatch(updateProfileRequest());
        const config = { headers: { 'Content-type': 'multipart/form-data' } };
        const { data } = await axios.put(`/api/v1/update`, userData, config);
        dispatch(updateProfileSuccess(data.user));
    } catch (error) {
        dispatch(updateProfileFail(error.response.data.message));
    }
};

export const updatePassword = (formData) => async (dispatch) => {
    try {
        dispatch(updatePasswordRequest());
        const config = { headers: { 'Content-type': 'application/json' } };
        await axios.put(`/api/v1/password/change`, formData, config);
        dispatch(updatePasswordSuccess());
    } catch (error) {
        dispatch(updatePasswordFail(error.response.data.message));
    }
};

export const forgotPassword = (formData) => async (dispatch) => {
    try {
        dispatch(forgotPasswordRequest());
        const config = { headers: { 'Content-type': 'application/json' } };
        const { data } = await axios.post(`/api/v1/password/forgot`, formData, config);
        dispatch(forgotPasswordSuccess(data));
    } catch (error) {
        dispatch(forgotPasswordFail(error.response.data.message));
    }
};

export const resetPassword = (payload, token) => async (dispatch) => {
    try {
        dispatch(resetPasswordRequest());
        const config = { headers: { 'Content-type': 'application/json' } };
        const { data } = await axios.post(`/api/v1/password/reset/${token}`, payload, config);
        dispatch(resetPasswordSuccess(data));
    } catch (error) {
        dispatch(resetPasswordFail(error.response.data.message));
    }
};
