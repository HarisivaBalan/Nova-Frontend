import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtpSuccess } from "../../slices/authSlice";

export default function VerifyOtp() {
    const inputRefs = useRef([]);
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(60);
    const [resendCount, setResendCount] = useState(0);
    const [isResending, setIsResending] = useState(false);
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth || {});

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("/api/v1/verify-otp", { email, otp });
            dispatch(verifyOtpSuccess( data.user));
            toast.success("OTP Verified Successfully", {
                position: "top-center",
                onClose: () => navigate("/"),
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid OTP");
        }
    };

    const handleResendOtp = async () => {
        if (resendCount >= 3) return;
        try {
            setIsResending(true);
            await axios.post("/api/v1/send-otp", { email });
            setResendCount(resendCount + 1);
            setTimer(60);
            toast.success("OTP resent successfully", { position: "top-center" });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to resend OTP");
        } finally {
            setIsResending(false);
        }
    };

    useEffect(() => {
        if (timer > 0) {
            const countdown = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(countdown);
        }
    }, [timer]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form onSubmit={handleVerify} className="shadow-lg">
                    <h1 className="mb-3 text-center text-primary">Verify OTP</h1>

                    <div className="form-group text-center">
                        <label htmlFor="otp_field">Enter OTP sent to your email</label>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "10px",
                                marginTop: "10px",
                            }}
                        >
                            {[...Array(6)].map((_, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    value={otp[index] || ""}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    onClick={() => {
                                        inputRefs.current[index].select();
                                    }}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/, "");
                                        const newOtp = otp.split("");
                                        newOtp[index] = value;
                                        setOtp(newOtp.join(""));
                                        if (value && index < 5) {
                                            inputRefs.current[index + 1]?.focus();
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Backspace" && !otp[index] && index > 0) {
                                            inputRefs.current[index - 1]?.focus();
                                        }
                                    }}
                                    className="form-control text-center"
                                    style={{
                                        width: "40px",
                                        fontSize: "20px",
                                        padding: "5px",
                                    }}
                                    id={`otp-${index}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="text-center mt-3">
                        {timer > 0 ? (
                            <div
                                style={{
                                    display: "inline-block",
                                    background: "#f0f0f0",
                                    color: "#007bff",
                                    padding: "6px 14px",
                                    borderRadius: "25px",
                                    fontWeight: "500",
                                }}
                            >
                                Resend OTP in {timer}s
                            </div>
                        ) : resendCount < 3 ? (
                            <button
                                type="button"
                                className="btn btn-outline-primary btn-sm"
                                onClick={handleResendOtp}
                                disabled={isResending}
                            >
                                {isResending ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                        />
                                        Resending...
                                    </>
                                ) : (
                                    "Resend OTP"
                                )}
                            </button>
                        ) : (
                            <p className="text-danger">You’ve reached the maximum resend attempts.</p>
                        )}
                    </div>

                    <button type="submit" className="btn btn-block py-3 mt-3">
                        VERIFY OTP
                    </button>
                </form>
            </div>
        </div>
    );
}
