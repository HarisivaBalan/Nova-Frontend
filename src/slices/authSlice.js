import { createSlice} from '@reduxjs/toolkit';
import axios from "axios"
import { createAsyncThunk } from "@reduxjs/toolkit";

// const userInfo = localStorage.getItem('user')
//   ? JSON.parse(localStorage.getItem('user'))
//   : null;

let userInfo = null;
const userFromStorage = localStorage.getItem('user');

if (userFromStorage && userFromStorage !== "undefined") {
  try {
    userInfo = JSON.parse(userFromStorage);
  } catch (error) {
    console.warn("Invalid JSON in localStorage: ", error);
    localStorage.removeItem('user'); // Clean it up to avoid future errors
  }
}



// ✅ Use `createAsyncThunk`
export const loadUser = createAsyncThunk("auth/loadUser", async (_, thunkAPI) => {
    try {
        const { data } = await axios.get("/api/v1/me", { withCredentials: true });

        // ✅ Store user in localStorage for persistence
        localStorage.setItem("user", JSON.stringify(data.user));

        return data.user;
    } catch (error) {
      // Handle 401 Unauthorized separately
      if (error.response?.status === 401) {
          console.warn("🚫 User is not logged in (401 Unauthorized)");
          return thunkAPI.rejectWithValue(null); // Just return null instead of an error message
      }

      console.error("❌ LoadUser Error:", error.response?.data?.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to load user");
  }
});

// Initial state
const initialState = {
  loading: false,
  isAuthenticated:userInfo?true: false,
  user: userInfo,
  error: null,
  otpPending: false,
};

// Create the slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest(state) {
      state.loading = true;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload)); 
    },
    loginFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    registerRequest(state) {
      state.loading = true;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.otpPending = true;
      state.user =null;
      state.registeredEmail=action.payload.email;
    },
    verifyOtpSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.otpPending = false;      // ✅ Clear pending
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    
    registerFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logoutSuccess(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('user');
    },
    logoutFail(state, action) {
      state.error = action.payload;
    },
    updateProfileRequest(state) {
      state.loading = true;
      state.isUpdated = true;
    },
    updateProfileSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
      state.isUpdated = true;
    },
    updateProfileFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearUpdateProfile(state) {
      state.isUpdated = false;
    },
    updatePasswordRequest(state) {
      state.loading = true;
      state.isUpdated = false;
    },
    updatePasswordSuccess(state) {
      state.loading = false;
      state.isUpdated = true;
    },
    updatePasswordFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    forgotPasswordRequest(state) {
      state.loading = true;
      state.message = null;
    },
    forgotPasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
    },
    forgotPasswordFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetPasswordRequest(state) {
      state.loading = true;
    },
    resetPasswordSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    resetPasswordFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        //console.log("✅ LoadUser Success:", action.payload);  // Debugging log
        state.loading = false;
        state.isAuthenticated = action.payload ? true : false;  // Ensure valid user
        state.user = action.payload || null;
        if (action.payload) {
            localStorage.setItem('user', JSON.stringify(action.payload));
        }
    })
    
      .addCase(loadUser.rejected, (state, action) => {
        //console.log("❌ LoadUser Failed:", action.payload);  // Debugging log
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload ||null;
        localStorage.removeItem('user');

      });
  },
});

// Export the actions for use in components
export const { 
  loginRequest, loginSuccess, loginFail, clearError,
  registerRequest, registerSuccess, registerFail,
  logoutFail, logoutSuccess, updateProfileFail,
  updateProfileRequest, updateProfileSuccess,
  updatePasswordRequest, updatePasswordSuccess, updatePasswordFail,
  clearUpdateProfile, forgotPasswordRequest, forgotPasswordSuccess,
  forgotPasswordFail, resetPasswordFail, resetPasswordSuccess, resetPasswordRequest,verifyOtpSuccess
} = authSlice.actions;

// Export the reducer to configure the store
export default authSlice.reducer;
