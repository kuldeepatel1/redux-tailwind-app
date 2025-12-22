import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp, resendOtp } from "../features/auth/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

export default function OtpPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {}; // get email from state

  const { loading, error } = useSelector((s) => s.auth);
  const [otp, setOtp] = useState("");
  const [canResend, setCanResend] = useState(true);
  const [resendSeconds, setResendSeconds] = useState(30);

  useEffect(() => {
    if (!email) {
      // redirect back if email is missing
      navigate("/register");
    }
  }, [email, navigate]);

  const handleVerify = async () => {
    if (otp.length !== 6) return alert("Enter a valid 6-digit OTP");
    const res = await dispatch(verifyOtp({ email, otp }));
    if (res.meta.requestStatus === "fulfilled") {
      navigate("/login");
    }
  };

  const handleResend = async () => {
    setCanResend(false);
    await dispatch(resendOtp(email));

    let seconds = 30;
    setResendSeconds(seconds);

    const interval = setInterval(() => {
      seconds -= 1;
      setResendSeconds(seconds);
      if (seconds <= 0) {
        setCanResend(true);
        clearInterval(interval);
      }
    }, 1000);
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow">
        <h2 className="text-xl font-bold text-center mb-4">Verify OTP</h2>
        <p className="text-center mb-4">Enter the 6-digit OTP sent to {email}</p>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg mb-4 text-center"
          placeholder="Enter OTP"
        />

        <button
          onClick={handleVerify}
          disabled={loading || otp.length !== 6}
          className="w-full py-3 bg-orange-500 text-white rounded-lg disabled:opacity-50 mb-2"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="text-center mt-2">
          <button
            onClick={handleResend}
            disabled={!canResend || loading}
            className="text-indigo-600"
          >
            {canResend ? "Resend OTP" : `Resend in ${resendSeconds}s`}
          </button>
        </div>

        {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
      </div>
    </AuthLayout>
  );
}
